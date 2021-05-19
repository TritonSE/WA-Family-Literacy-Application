import React, { createContext } from 'react';
import Constants from 'expo-constants';
import { WordsAliveAPI } from '../api/WordsAliveAPI';

// set baseURL using environment varibales -- use export BASE_URL=<name>
const baseURL: string = Constants.manifest.extra.baseUrl;

const initialState: WordsAliveAPI = new WordsAliveAPI(baseURL);

export const APIContext = createContext<WordsAliveAPI>(initialState);

// provides an instance of the API class to all children
export const APIProvider: React.FC = ({ children }) => {
  const state = initialState;
  return (
    <APIContext.Provider
      value={
        state
      }
    >
      {children}
    </APIContext.Provider>
  );
};
