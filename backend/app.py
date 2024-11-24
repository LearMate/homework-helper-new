from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from openai import OpenAI
import json
from PyPDF2 import PdfReader
import io

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def extract_text_from_pdf(file_storage):
    try:
        # Read the file into a bytes buffer
        pdf_bytes = io.BytesIO(file_storage.read())
        
        # Create PDF reader object
        pdf_reader = PdfReader(pdf_bytes)
        
        # Extract text from all pages
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        
        print(f"Extracted text from PDF: {text[:200]}...")  # Print first 200 chars
        return text.strip()
    except Exception as e:
        print(f"Error extracting text from PDF: {str(e)}")
        raise Exception(f"Failed to read PDF file: {str(e)}")

def get_solution_from_openai(text, subject, language_code='en', is_file=False):
    try:
        if not text:
            return "Please provide a question to get a solution."
            
        # Create language-specific system message
        system_messages = {
            'en': "You are a knowledgeable tutor who helps students understand concepts and solve problems step by step.",
            'id': "Anda adalah tutor yang berpengetahuan luas yang membantu siswa memahami konsep dan memecahkan masalah langkah demi langkah.",
            'es': "Eres un tutor experto que ayuda a los estudiantes a comprender conceptos y resolver problemas paso a paso."
        }
        
        # Create language-specific prompts
        prompts = {
            'en': f"You are a helpful tutor. Please help solve this {subject} question from {'a PDF file' if is_file else 'the student'}:\n\n{text}\n\nProvide a clear, step-by-step solution.",
            'id': f"Anda adalah tutor yang membantu. Mohon bantu selesaikan soal {subject} ini dari {'file PDF' if is_file else 'siswa'}:\n\n{text}\n\nBerikan solusi yang jelas, langkah demi langkah.",
            'es': f"Eres un tutor servicial. Por favor, ayuda a resolver esta pregunta de {subject} de {'un archivo PDF' if is_file else 'el estudiante'}:\n\n{text}\n\nProporciona una solución clara, paso a paso."
        }
        
        # Use the appropriate language or fall back to English
        system_message = system_messages.get(language_code, system_messages['en'])
        prompt = prompts.get(language_code, prompts['en'])
        
        print(f"Sending request to OpenAI with prompt in {language_code}")
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        # Extract the solution from the response
        solution = response.choices[0].message.content
        print(f"Received solution from OpenAI: {solution[:200]}...")  # Print first 200 chars
        return solution
    
    except Exception as e:
        print(f"OpenAI API error: {str(e)}")
        if "api_key" in str(e).lower():
            raise Exception("OpenAI API key is invalid or not set. Please check your .env file.")
        raise Exception(f"Failed to generate solution: {str(e)}")

@app.route('/api/homework', methods=['POST'])
def submit_homework():
    print("=== Received new homework submission ===")
    print("Headers:", dict(request.headers))
    print("Form data:", dict(request.form))
    print("Files:", request.files)
    
    try:
        # Get text, subject, and language from form data
        text = request.form.get('text', '').strip()
        subject = request.form.get('subject', '')
        language = request.form.get('language', 'en')  # Default to English
        
        print(f"Processing - Text: {text}, Subject: {subject}, Language: {language}")
        
        # Handle file if present
        if 'file' in request.files:
            file = request.files['file']
            if file.filename:
                print(f"Processing file: {file.filename}")
                if file.filename.endswith('.pdf'):
                    text = extract_text_from_pdf(file)
                elif file.filename.endswith('.txt'):
                    text = file.read().decode('utf-8')
                else:
                    return jsonify({"error": "Unsupported file type. Please upload a PDF or TXT file."}), 400
        
        if not text:
            return jsonify({"error": "Please provide either text or a file with readable content"}), 400
        
        # Get solution from OpenAI in the specified language
        solution = get_solution_from_openai(
            text, 
            subject, 
            language_code=language,
            is_file=bool(request.files.get('file'))
        )
        
        response = {
            "message": "Homework received successfully",
            "text": text,
            "subject": subject,
            "solution": solution,
            "language": language
        }
        
        print("Sending response:", response)
        return jsonify(response), 200
    
    except Exception as e:
        error_msg = f"Error processing request: {str(e)}"
        print(error_msg)
        return jsonify({"error": error_msg}), 500

@app.route('/api/test', methods=['GET'])
def test():
    try:
        # Test OpenAI connection
        solution = get_solution_from_openai("What is 2+2?", "math")
        return jsonify({
            "status": "Backend is running",
            "openai_test": "OpenAI connection successful",
            "test_response": solution
        }), 200
    except Exception as e:
        return jsonify({
            "status": "Backend is running",
            "openai_error": str(e)
        }), 200

if __name__ == '__main__':
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        print("Warning: OPENAI_API_KEY not found in environment variables")
    else:
        print("OpenAI API key found")
    
    print("Starting server on port 8000...")
    app.run(host='0.0.0.0', port=8000, debug=True)
