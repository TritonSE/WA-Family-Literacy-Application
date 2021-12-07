import React, { createContext, useReducer, useContext } from 'react';
import { APIContext } from './APIContext';
import { Book } from '../models/Book';
import AsyncStorage from '@react-native-async-storage/async-storage';

type BookState = {
  books: Book[], // holds all the books we have stored
  popularBooks: Book[], // holds the popular books stored
  fetchBooks: () => void, // api call to get books
  fetchPopularBooks: () => void, // api call to get popular books
  loading: boolean, // lets us know if the books are being loaded or not
  popularLoading: boolean,
  error: boolean,
};

const initialState: BookState = {
  books: [],
  popularBooks: [],
  fetchBooks: () => {},
  fetchPopularBooks: () => {},
  loading: false,
  popularLoading: false,
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

  function fetchPopularBooks(): void {
    dispatch({ type: 'POPULAR_API_CALL_STARTED' });
    
    client.getPopularBooks().then(async (res) => {
      dispatch({ type: 'POPULAR_BOOKS_RETURNED', payload: res });
      // cache response in async
      await AsyncStorage.setItem('popularBooks', JSON.stringify(res));
    }).catch(async (err) => {
      const result = await AsyncStorage.getItem('popularBooks');
      if (result != null) {
        // we aren't connected but have the result cached
        // somehow return the result
        dispatch({ type: 'POPULAR_BOOKS_RETURNED', payload: JSON.parse(result) });
        
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
        popularBooks: state.popularBooks,
        fetchBooks,
        fetchPopularBooks,
        loading: state.loading,
        popularLoading: state.popularLoading,
        error: state.error,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

type BookAction
  = { type: 'API_CALL_STARTED' }
  | { type: 'POPULAR_API_CALL_STARTED' }
  | { type: 'BOOKS_RETURNED', payload: Book[] }
  | { type: 'POPULAR_BOOKS_RETURNED', payload: Book[]};

const reducer = (state: BookState, action: BookAction): BookState => {
  switch (action.type) {
    case 'API_CALL_STARTED':
      return { ...state, loading: true };
    case 'POPULAR_API_CALL_STARTED':
      return { ...state, popularLoading: true};
    case 'BOOKS_RETURNED':
      return { ...state, books: action.payload, loading: false };
    case 'POPULAR_BOOKS_RETURNED':
      return { ...state, popularBooks: action.payload, popularLoading: false };
    default:
      return state;
  }
};
