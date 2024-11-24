import React from 'react'
import ReactDOM from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import './index.css'
import App from './App.tsx'
import './i18n/i18n'

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f5f5f5',
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
