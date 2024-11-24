import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Typography, Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { HomeworkUploader } from './components/HomeworkUploader';
import { updateLanguageFromLocation } from './i18n/i18n';
import '@fontsource/outfit';

const theme = createTheme({
  typography: {
    fontFamily: '"Outfit", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
      marginBottom: '0.5rem',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 500,
      letterSpacing: '0.02em',
      textTransform: 'none',
    },
  },
  palette: {
    background: {
      default: '#f8f9fa',
    },
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#0ea5e9',
      light: '#38bdf8',
      dark: '#0284c7',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 12,
          textTransform: 'none',
          padding: '10px 24px',
          fontSize: '1rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            fontSize: '1rem',
            lineHeight: 1.7,
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.gradient-text': {
            background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          },
        },
      },
    },
  },
});

function App() {
  const { t } = useTranslation();

  useEffect(() => {
    updateLanguageFromLocation();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h1" 
            align="center" 
            className="gradient-text"
            sx={{ 
              mb: 1,
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
            }}
          >
            {t('title')}
          </Typography>
          <Typography 
            variant="h5" 
            align="center" 
            color="text.secondary"
            sx={{ 
              mb: 4,
              maxWidth: '600px',
              mx: 'auto',
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
              fontWeight: 300,
            }}
          >
            {t('subtitle')}
          </Typography>
          <HomeworkUploader />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
