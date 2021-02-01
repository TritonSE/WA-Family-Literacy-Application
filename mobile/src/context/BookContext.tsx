import React, { createContext, useReducer } from 'react';

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

  function fetchBooks(): void {
    const books: Book[] = [
      {
        id: 'a',
        title: 'foo',
        image: 'https://placekitten.com/200/300',
        created_at: '10000',
      },
      {
        id: 'b',
        title: 'bar',
        image: 'https://placekitten.com/200/301',
        created_at: '1500',
      },
      {
        id: 'c',
        title: 'bar',
        image: 'https://placekitten.com/200/302',
        created_at: '2000',
      },
      {
        id: 'd',
        title: 'bar',
        image: 'https://placekitten.com/200/303',
        created_at: '3000',
      },
      {
        id: 'e',
        title: 'bar',
        image: 'https://placekitten.com/200/304',
        created_at: '1000',
      },
      {
        id: 'f',
        title: 'bar',
        image: 'https://placekitten.com/200/305',
        created_at: '1000',
      },
      {
        id: 'g',
        title: 'bar',
        image: 'https://placekitten.com/200/306',
        created_at: '1000',
      },
      {
        id: 'h',
        title: 'bar',
        image: 'https://placekitten.com/200/307',
        created_at: '1000',
      },
      {
        id: 'i',
        title: 'bar',
        image: 'https://placekitten.com/200/310',
        created_at: '1000',
      },
      {
        id: 'j',
        title: 'foo',
        image: 'https://placekitten.com/200/300',
        created_at: '10000',
      },
      {
        id: 'k',
        title: 'bar',
        image: 'https://placekitten.com/200/301',
        created_at: '1500',
      },
      {
        id: 'l',
        title: 'bar',
        image: 'https://placekitten.com/200/302',
        created_at: '2000',
      },
      {
        id: 'm',
        title: 'bar',
        image: 'https://placekitten.com/200/303',
        created_at: '3000',
      },
      {
        id: 'n',
        title: 'bar',
        image: 'https://placekitten.com/200/304',
        created_at: '1000',
      },
      {
        id: 'o',
        title: 'bar',
        image: 'https://placekitten.com/200/305',
        created_at: '1000',
      },
      {
        id: 'p',
        title: 'bar',
        image: 'https://placekitten.com/200/306',
        created_at: '1000',
      },
      {
        id: 'q',
        title: 'bar',
        image: 'https://placekitten.com/200/307',
        created_at: '1000',
      },
      {
        id: 'r',
        title: 'bar',
        image: 'https://placekitten.com/200/310',
        created_at: '1000',
      },
      {
        id: 's',
        title: 'foo',
        image: 'https://placekitten.com/200/300',
        created_at: '10000',
      },
      {
        id: 't',
        title: 'bar',
        image: 'https://placekitten.com/200/301',
        created_at: '1500',
      },
      {
        id: 'u',
        title: 'bar',
        image: 'https://placekitten.com/200/302',
        created_at: '2000',
      },
      {
        id: 'v',
        title: 'bar',
        image: 'https://placekitten.com/200/303',
        created_at: '3000',
      },
      {
        id: 'w',
        title: 'bar',
        image: 'https://placekitten.com/200/304',
        created_at: '1000',
      },
      {
        id: 'x',
        title: 'bar',
        image: 'https://placekitten.com/200/305',
        created_at: '1000',
      },
      {
        id: 'y',
        title: 'bar',
        image: 'https://placekitten.com/200/306',
        created_at: '1000',
      },
      {
        id: 'z',
        title: 'bar',
        image: 'https://placekitten.com/200/307',
        created_at: '1000',
      },

    ];
    dispatch({ type: 'BOOKS_LOADED', payload: books });
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
