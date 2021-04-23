import React, { createContext } from 'react';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

import { Language, Languages } from '../models/Languages';


import AsyncStorage from '@react-native-async-storage/async-storage';
const STORAGE_KEY = '@locale';


type I18nState = {
  i18n: any,
  setLocale: (locale: string) => void,
  getData: () => void,
  storeData: (value: Language) => Promise<void>,
};

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  en: require('../../assets/i18n/en.json'),
  es: require('../../assets/i18n/es.json'),
  fr: require('../../assets/i18n/fr.json'),
};

// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;

// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;

const setLocale = (locale: string) => {
  i18n.locale = locale;
};

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    if(value !== null) {
      i18n.locale = value;
    //console.log("LOCALE CHANGE to", i18n.locale, value);
    }
  } catch(e) {
    console.log(e);
  }
}

const storeData = async (value: Language) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, value);
  } catch (e) {
    console.log(e);
  }
}

 
const val: I18nState = {
  i18n,
  setLocale,
  getData,
  storeData,
};

export const I18nContext = createContext<I18nState>(val);



export const I18nProvider: React.FC = ({ children }) => {
  const state = {
    i18n: i18n,
    setLocale,
    getData,
    storeData,
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
