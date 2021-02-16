import React, { createContext } from 'react';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  en: require('../../assets/i18n/en.json'),
};
// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;
// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;

export const I18nContext = createContext(i18n);

export const I18nProvider: React.FC = ({ children }) => {
  const state = i18n;
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