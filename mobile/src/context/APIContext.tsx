import React, { createContext } from 'react';
import { WordsAliveAPI } from '../classes/WordsAliveAPI';

//set baseURL using environment varibales
const baseURL = 'http://' + (process.env.BASE_URL || 'localhost:8080');

const initialState: WordsAliveAPI = new WordsAliveAPI(baseURL);

export const APIContext = createContext<WordsAliveAPI>(initialState);

//provides an instance of the API class to all children
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
