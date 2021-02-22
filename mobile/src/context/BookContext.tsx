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
  loading: false,
};

export const BookContext = createContext<BookState>(initialState);

export const BookProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const client = useContext(APIContext);

  // loads books. If error, logs erorr and returns a loading indicator of true
  function fetchBooks(): void {
    dispatch({ type: 'API_CALL_STARTED' });
    client.getBooks().then((res) => {
      dispatch({ type: 'API_RETURNED', payload: res });
    }).catch((err) => {
      console.log(err);
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

type BookAction
  = { type: 'API_CALL_STARTED' }
  | { type: 'API_RETURNED', payload: Book[] };

const reducer = (state: BookState, action: BookAction): BookState => {
  switch (action.type) {
    case 'API_CALL_STARTED':
      return { ...state, loading: true };
    case 'API_RETURNED':
      return { ...state, books: action.payload, loading: false };
    default:
      return state;
  }
};
