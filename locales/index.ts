import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import {I18n} from 'i18n-js';
import {I18nManager} from 'react-native';

import en from './en.json';
import he from './he.json';

const i18n = new I18n();

i18n.translations = {
  'en-US': en,
  'en-UK': en,
  'en-IL': en,
  he,
};

// Fallback to English if a translation isn't available in the selected language
i18n.defaultLocale = 'en-US';

// Set initial language
export const setLanguage = async (language: string) => {
  i18n.locale = language;
  await AsyncStorage.setItem('appLanguage', language);
};

export const getStoredLanguage = async () => {
  const storedLanguage = await AsyncStorage.getItem('appLanguage');
  console.log({storedLanguage});
  if (storedLanguage) {
    i18n.locale = storedLanguage;
  } else {
    const [{languageTag}] = Localization.getLocales();
    i18n.locale = languageTag;
  }
  const isRTL = i18n.locale === 'he';
  console.log({isRTL});
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
};

export const IS_RTL = I18nManager.isRTL;
console.log({IS_RTL});
export default i18n;
