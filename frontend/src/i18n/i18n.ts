import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './translations';

// Map country codes to language codes
const countryToLanguage: { [key: string]: string } = {
  us: 'en',
  gb: 'en',
  au: 'en',
  id: 'id',
  es: 'es',
  mx: 'es',
  ar: 'es',
};

// Initialize i18n with default English
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default to English
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Function to get user's country code from IP and update language
export async function updateLanguageFromLocation() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const countryCode = data.country_code.toLowerCase();
    const language = countryToLanguage[countryCode] || 'en';
    
    if (i18n.language !== language) {
      await i18n.changeLanguage(language);
    }
  } catch (error) {
    console.error('Error detecting location:', error);
  }
}

export default i18n;
