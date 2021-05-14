import React, { createContext } from 'react';
import { WordsAliveAPI } from '../api/WordsAliveAPI';

// set baseURL using: export REACT_APP_BASE_URL=<name>
const baseURL = process.env.REACT_APP_BASE_URL|| 'http://localhost:8080';

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
