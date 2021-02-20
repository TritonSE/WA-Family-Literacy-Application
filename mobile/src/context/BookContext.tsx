import React, { createContext, useReducer, useContext } from 'react';
import { APIContext } from './APIContext';
import { Book } from '../models/Book';

type BookState = {
    books: Book[], // holds all the books we have stored
    fetchBooks: () => void, // api call to get books
    loading: boolean, // lets us know if the books are being loaded or not
};

const initialState: BookState = {
  books: [],
  fetchBooks: () => {},
  loading: true,
};

export const BookContext = createContext<BookState>(initialState);

export const BookProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const client = useContext(APIContext);
  
  // loads books. If error, logs erorr and returns a loading indicator of true 
  function fetchBooks(): void {
    client.getBooks().then((res) => {
      dispatch({ type: 'BOOKS_LOADED', payload: res , loading: false});
    }).catch((err) => {
      console.log(err);
      // if books not found, continue indicating loading
      dispatch({ type: 'ERROR', payload: null , loading: true});
      
    });

  }

  return (
    <BookContext.Provider
      value={{
        books: state.books,
        fetchBooks,
        loading: state.loading,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

type BookAction = {type: String , payload: Book[], loading: boolean };

const reducer = (state: BookState, action: BookAction): BookState => {
  switch (action.type) {
    case 'BOOKS_LOADED':
      return { ...state, books: action.payload, loading: action.loading };
    case 'ERROR':
      return { ...state, loading: action.loading};
    default:
      return state;
  }
};
