export type Subject = 'math' | 'physics' | 'chemistry' | 'literature' | 'history' | 'biology';

export const subjects: Subject[] = ['math', 'physics', 'chemistry', 'literature', 'history', 'biology'];

export const resources = {
  en: {
    translation: {
      title: 'Homework Mentor',
      subtitle: 'Your personal study companion',
      upload: {
        dropzone: 'Drop your homework file here or click to select',
        or: 'or type your question below',
        textInput: 'Type your homework question here...',
        subject: 'Select Subject',
        submit: 'Get Solution',
        processing: 'Processing...',
        uploading: 'Uploading...',
        error: 'Error processing your request. Please try again.',
      },
      subjects: {
        math: 'Mathematics',
        physics: 'Physics',
        chemistry: 'Chemistry',
        literature: 'Literature',
        history: 'History',
        biology: 'Biology'
      },
      solution: 'Solution',
    }
  },
  id: {
    translation: {
      title: 'Homework Mentor',
      subtitle: 'Teman belajar pribadimu',
      upload: {
        dropzone: 'Letakkan file PR Anda di sini atau klik untuk memilih',
        or: 'atau ketik pertanyaan di bawah',
        textInput: 'Ketik pertanyaan PR Anda di sini...',
        subject: 'Pilih Mata Pelajaran',
        submit: 'Dapatkan Solusi',
        processing: 'Memproses...',
        uploading: 'Mengunggah...',
        error: 'Gagal memproses permintaan. Silakan coba lagi.',
      },
      subjects: {
        math: 'Matematika',
        physics: 'Fisika',
        chemistry: 'Kimia',
        literature: 'Sastra',
        history: 'Sejarah',
        biology: 'Biologi'
      },
      solution: 'Solusi',
    }
  },
  es: {
    translation: {
      title: 'Homework Mentor',
      subtitle: 'Tu compañero personal de estudios',
      upload: {
        dropzone: 'Suelta tu archivo de tarea aquí o haz clic para seleccionar',
        or: 'o escribe tu pregunta abajo',
        textInput: 'Escribe tu pregunta de tarea aquí...',
        subject: 'Seleccionar Materia',
        submit: 'Obtener Solución',
        processing: 'Procesando...',
        uploading: 'Subiendo...',
        error: 'Error al procesar tu solicitud. Por favor, inténtalo de nuevo.',
      },
      subjects: {
        math: 'Matemáticas',
        physics: 'Física',
        chemistry: 'Química',
        literature: 'Literatura',
        history: 'Historia',
        biology: 'Biología'
      },
      solution: 'Solución',
    }
  }
};
