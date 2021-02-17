import React, { createContext } from 'react';
import { WordsAliveAPI } from '../classes/WordsAliveAPI';

const baseURL = "http://" + (process.env.BASE_URL || 'localhost:8080')
console.log(baseURL);

const initialState: WordsAliveAPI = new WordsAliveAPI(baseURL);

export const APIContext = createContext<WordsAliveAPI>(initialState);

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
