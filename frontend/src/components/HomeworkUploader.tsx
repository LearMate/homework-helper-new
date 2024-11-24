import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  useTheme,
  LinearProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';

const API_URL = import.meta.env.VITE_API_URL;

// Default illustration for solutions
const DEFAULT_ILLUSTRATION = 'https://img.freepik.com/free-vector/hand-drawn-mathematics-background_23-2148157167.jpg';

export function HomeworkUploader() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [solution, setSolution] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setText('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const handleSubmit = async () => {
    if (!text && !file) return;
    
    setIsLoading(true);
    setError('');
    setSolution('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      formData.append('text', text);
      formData.append('language', i18n.language);

      const response = await axios.post(`${API_URL}/api/homework`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.loaded / (progressEvent.total || 1) * 100;
          setUploadProgress(Math.min(progress, 99)); // Cap at 99% until complete
        },
      });

      setUploadProgress(100);
      if (response.data.solution) {
        setSolution(response.data.solution);
        // Reset form after successful submission
        setText('');
        setFile(null);
        setUploadProgress(0);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : t('upload.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Card
        elevation={8}
        sx={{
          background: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* File Upload Area */}
          <Box
            {...getRootProps()}
            sx={{
              border: '3px dashed',
              borderColor: isDragActive ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
              borderRadius: 3,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.8)',
                bgcolor: 'rgba(255,255,255,0.2)',
                transform: 'scale(1.02)',
              },
            }}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 48, color: 'white', mb: 2 }} />
            <Typography 
              color="white" 
              variant="h6" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                letterSpacing: '0.01em',
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
              }}
            >
              {file ? file.name : t('upload.dropzone')}
            </Typography>
            <Typography 
              variant="body2" 
              color="rgba(255,255,255,0.7)" 
              sx={{ 
                mt: 1,
                fontWeight: 300,
                letterSpacing: '0.02em',
              }}
            >
              {t('upload.or')}
            </Typography>
          </Box>

          {/* Text Input */}
          <Box sx={{ mt: 3 }}>
            <TextField
              multiline
              rows={4}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setFile(null);
              }}
              placeholder={t('upload.textInput')}
              disabled={!!file}
              sx={{
                width: '100%',
                '& .MuiInputBase-root': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                  borderRadius: 2,
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  fontWeight: 400,
                  fontFamily: 'inherit',
                },
                '& .MuiInputBase-input': {
                  '&::placeholder': {
                    fontWeight: 300,
                    opacity: 0.8,
                  },
                },
              }}
              variant="outlined"
            />
          </Box>

          {/* Upload Progress */}
          {isLoading && (
            <Box sx={{ mt: 3 }}>
              <Typography 
                color="white" 
                variant="body2" 
                gutterBottom
                sx={{
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                }}
              >
                {uploadProgress < 100 ? t('upload.uploading') : t('upload.processing')}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'white',
                  }
                }}
              />
            </Box>
          )}

          {/* Submit Button */}
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading || (!file && !text)}
            startIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{ 
              mt: 3,
              py: 1.5,
              px: 4,
              bgcolor: 'white',
              color: 'primary.main',
              borderRadius: 3,
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontWeight: 600,
              letterSpacing: '0.02em',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
                transform: 'scale(1.02)',
              },
              transition: 'all 0.3s ease',
            }}
            size="large"
            fullWidth
          >
            {isLoading ? t('upload.processing') : t('upload.submit')}
          </Button>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert 
          severity="error" 
          variant="filled"
          sx={{ 
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: 28
            },
            '& .MuiAlert-message': {
              fontSize: '0.95rem',
              fontWeight: 500,
              letterSpacing: '0.01em',
            }
          }}
        >
          {error}
        </Alert>
      )}

      {/* Solution */}
      {solution && (
        <Card
          elevation={8}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)',
          }}
        >
          <Box
            sx={{
              height: 200,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <img
              src={DEFAULT_ILLUSTRATION}
              alt="Solution"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
              }}
            />
          </Box>
          <CardContent sx={{ p: 4 }}>
            <Typography 
              variant="h5" 
              gutterBottom 
              color="primary" 
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.01em',
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
              }}
            >
              {t('solution')}:
            </Typography>
            <Typography 
              sx={{ 
                whiteSpace: 'pre-wrap',
                fontSize: { xs: '1rem', sm: '1.1rem' },
                lineHeight: 1.7,
                fontWeight: 400,
                letterSpacing: '0.01em',
              }}
            >
              {solution}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
