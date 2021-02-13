import React, { createContext } from 'react';
import { WordsAliveAPI } from '../classes/WordsAliveAPI';

const initialState: WordsAliveAPI = new WordsAliveAPI(process.env.BASE_URL);

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
