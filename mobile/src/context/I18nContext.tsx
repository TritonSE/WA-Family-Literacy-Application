import React, { createContext, useEffect, useState } from 'react';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

import { Language } from '../models/Languages';
import AsyncStorage from '@react-native-async-storage/async-storage';

// key for setting and retrieving locale saved locally on device
const STORAGE_KEY = '@locale';

// language defaults to the system's locale
const DEFAULT_LANGUAGE = Localization.locale.substring(0, 2) as Language;

type I18nState = {
  i18n: typeof i18n,
  setLocale: (locale: Language) => void,
  t: typeof i18n.t,
  locale: Language,
};

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  en: require('../../assets/i18n/en.json'),
  es: require('../../assets/i18n/es.json'),
  fr: require('../../assets/i18n/fr.json'),
};

// Set the locale once at the beginning of your app.
i18n.locale = DEFAULT_LANGUAGE;

// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;

const val: I18nState = {
  i18n,
  setLocale: () => {},
  t: i18n.t,
  locale: DEFAULT_LANGUAGE,
};

export const I18nContext = createContext<I18nState>(val);

export const I18nProvider: React.FC = ({ children }) => {
  // current locale
  const [locale, setLocale] = useState<Language>(DEFAULT_LANGUAGE);

  // update the i18n locale globally when the locale is changed
  useEffect(() => {
    i18n.locale = locale;
  },[locale]);

  // run on first render to retrieve the locally stored locale, if it exists
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(value => {
      if(value !== null) {
        setLocale(value as Language);
      }
    });
  },[]);

  // update the i18n, state, and storage locale when the locale is changed
  const publicSetLocale = (locale: Language): void => {
    i18n.locale = locale;
    setLocale(locale);
    AsyncStorage.setItem(STORAGE_KEY, locale);
  };

  const state = {
    i18n: i18n,
    setLocale: publicSetLocale,
    t: i18n.t,
    locale: locale,
  };


  return (
    <I18nContext.Provider
      value={
        state
      }
    >
      {children}
    </I18nContext.Provider>
  );
};
