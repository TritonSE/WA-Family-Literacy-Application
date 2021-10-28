import React, { createContext, useReducer, useContext } from 'react';
import { APIContext } from './APIContext';
import { Book } from '../models/Book';
import AsyncStorage from '@react-native-async-storage/async-storage';

type BookState = {
  books: Book[], // holds all the books we have stored
  fetchBooks: () => void, // api call to get books
  loading: boolean, // lets us know if the books are being loaded or not
  error: boolean,
};

const initialState: BookState = {
  books: [],
  fetchBooks: () => {},
  loading: false,
  error: false,
};

export const BookContext = createContext<BookState>(initialState);

export const BookProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const client = useContext(APIContext);

  // loads books. If error, logs error and returns a loading indicator of true
  function fetchBooks(): void {
    dispatch({ type: 'API_CALL_STARTED' });
    
    client.getBooks().then(async (res) => {
      dispatch({ type: 'BOOKS_RETURNED', payload: res });
      // cache response in async
      await AsyncStorage.setItem('books', JSON.stringify(res));
    }).catch(async (err) => {
      const result = await AsyncStorage.getItem('books');
      if (result != null) {
        // we aren't connected but have the result cached
        // somehow return the result
        dispatch({ type: 'BOOKS_RETURNED', payload: JSON.parse(result) });
        
      } else {
        // error case 
        state.error = true;
        console.log(err);
      }
      
    });
  }

  return (
    <BookContext.Provider
      value={{
        books: state.books,
        fetchBooks,
        loading: state.loading,
        error: state.error,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

type BookAction
  = { type: 'API_CALL_STARTED' }
  | { type: 'BOOKS_RETURNED', payload: Book[] };

const reducer = (state: BookState, action: BookAction): BookState => {
  switch (action.type) {
    case 'API_CALL_STARTED':
      return { ...state, loading: true };
    case 'BOOKS_RETURNED':
      return { ...state, books: action.payload, loading: false };
    default:
      return state;
  }
};
