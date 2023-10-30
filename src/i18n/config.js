import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import settings from '../configs/config_settings.json';

i18n.use(initReactI18next).init({
  fallbackLng: 'en_US',

  lng: settings.language,
  resources: {
    fi_FI: {
      translations: require('./locales/fi_FI.json'),
    },
    en_US: {
      translations: require('./locales/en_US.json'),
    },
    sv_SE: {
      translations: require('./locales/sv_SE.json'),
    },
  },
  ns: ['translations'],
  defaultNS: 'translations',
});

i18n.languages = Object.keys(settings.languages)
  .map((k) => settings.languages[k])
  .map((el1) => el1.value);

export default i18n;
