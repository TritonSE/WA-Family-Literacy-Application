import React, { createContext, useReducer, useContext } from 'react';
import { APIContext } from './APIContext';
import { Book } from '../models/Book';

type BookState = {
    books: Book[], // holds all the books we have stored
    fetchBooks: () => void, // api call to get books
};

const initialState: BookState = {
  books: [],
  fetchBooks: () => {},
};

export const BookContext = createContext<BookState>(initialState);

export const BookProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const client = useContext(APIContext);
  function fetchBooks(): void {
    client.getBooks().then((res) => {
      dispatch({ type: 'BOOKS_LOADED', payload: res });
    }).catch((err) => {
      console.log(err);
    });
  }

  return (
    <BookContext.Provider
      value={{
        books: state.books,
        fetchBooks,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

type BookAction = {type: 'BOOKS_LOADED', payload: Book[]};

const reducer = (state: BookState, action: BookAction): BookState => {
  switch (action.type) {
    case 'BOOKS_LOADED':
      return { ...state, books: action.payload };
    default:
      return state;
  }
};
