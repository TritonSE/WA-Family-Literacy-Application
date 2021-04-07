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

  // loads books. If error, logs error and returns a loading indicator of true
  function fetchBooks(): void {
    dispatch({ type: 'API_CALL_STARTED' });
    client.getBooks().then((res) => {
      dispatch({ type: 'API_RETURNED', payload: res });
    }).catch((err) => {
      console.log(err);
      const books: Book[] = [
        {
          id: '1',
          title: 'Harry Potter',
          image: 'https://placekitten.com/200/300',
          author: 'JK Rowling',
          languages: ['en', 'es', 'fr'],
          created_at: '10000',
        },
        {
          id: '2',
          title: 'Holes',
          image: 'https://placekitten.com/200/301',
          author: 'Loius Sachar',
          languages: ['en'],
          created_at: '1500',
        },
        {
          id: '3',
          title: 'Pinocchio',
          image: 'https://placekitten.com/200/302',
          author: 'Carlo Collodi',
          languages: ['en'],
          created_at: '2000',
        },
        {
          id: '4',
          title: 'Hunger Games',
          image: 'https://placekitten.com/200/303',
          author: 'Suzanne Collins',
          languages: ['en'],
          created_at: '3000',
        },
        {
          id: '5',
          title: 'Maze Runner',
          image: 'https://placekitten.com/200/304',
          author: 'James Dashner',
          languages: ['en'],
          created_at: '1000',
        },
        {
          id: '6',
          title: 'Great Gatsby',
          image: 'https://placekitten.com/200/305',
          author: 'F. Scott Fitzgerald',
          languages: ['en'],
          created_at: '1000',
        },
        {
          id: '7',
          title: '1984',
          image: 'https://placekitten.com/200/306',
          author: 'George Orwell',
          languages: ['en', 'es'],
          created_at: '1000',
        },
        {
          id: '8',
          title: 'Brave New World',
          image: 'https://placekitten.com/200/307',
          author: 'Aldous Huxley',
          languages: ['en'],
          created_at: '1000',
        },
        {
          id: '9',
          title: 'Percy Jackson',
          image: 'https://placekitten.com/200/310',
          author: 'Rick Riordan',
          languages: ['en', 'es'],
          created_at: '1000',
        },
        {
          id: '10',
          title: 'Dune',
          image: 'https://placekitten.com/200/300',
          author: 'Frank Herbert',
          languages: ['en'],
          created_at: '10000',
        },
        {
          id: '11',
          title: 'Charlotte\'s Web',
          image: 'https://placekitten.com/200/301',
          author: 'E.B. White',
          languages: ['en', 'fr', 'es'],
          created_at: '1500',
        },
        {
          id: '12',
          title: 'Where the Wild Things Are',
          image: 'https://placekitten.com/200/302',
          author: 'Maurice Sendak',
          languages: ['en'],
          created_at: '2000',
        },
        {
          id: '13',
          title: 'Süite française',
          image: 'https://placekitten.com/200/303',
          author: 'Irène Némirovsky',
          languages: ['fr'],
          created_at: '3000',
        },
        {
          id: '14',
          title: 'The Kane Chronicles',
          image: 'https://placekitten.com/200/304',
          author: 'Rick Riordan',
          languages: ['en', 'es'],
          created_at: '1000',
        },
        {
          id: '15',
          title: 'Charlie and the Chocolate Factory',
          image: 'https://placekitten.com/200/305',
          author: 'Roald Dahl',
          languages: ['en', 'fr'],
          created_at: '1000',
        },
        {
          id: '16',
          title: 'Diary of a Wimpy Kid',
          image: 'https://placekitten.com/200/306',
          author: 'Jeff Kinney',
          languages: ['en'],
          created_at: '1000',
        },
        {
          id: '17',
          title: 'The Giver',
          image: 'https://placekitten.com/200/307',
          author: 'Lois Lowry',
          languages: ['en', 'fr', 'es'],
          created_at: '1000',
        },
        {
          id: '18',
          title: '!@#%^&*(()_+{}|:"?><~-=',
          image: 'https://placekitten.com/200/310',
          author: 'no author',
          languages: ['fr', 'es'],
          created_at: '1000',
        },
        {
          id: '19',
          title: 'The BFG',
          image: 'https://placekitten.com/200/300',
          author: 'Roald Dahl',
          languages: ['en'],
          created_at: '10000',
        },
        {
          id: '20',
          title: 'Hobbit',
          image: 'https://placekitten.com/200/301',
          author: 'J.R.R. Tolkien',
          languages: ['en'],
          created_at: '1500',
        },
        {
          id: '21',
          title: 'La fiesta de cumpleaños',
          image: 'https://placekitten.com/200/302',
          author: 'Toon Tellegen',
          languages: ['es'],
          created_at: '2000',
        },
        {
          id: '22',
          title: 'Nos jeux préférés',
          image: 'https://placekitten.com/200/303',
          author: 'Jean-Phillipe Chabot',
          languages: ['es', 'fr'],
          created_at: '3000',
        },
        {
          id: '23',
          title: 'Winnie-the-Pooh',
          image: 'https://placekitten.com/200/304',
          author: 'A.A. Milne',
          languages: ['en', 'es', 'fr'],
          created_at: '1000',
        },
        {
          id: '24',
          title: 'Bridge to Terabithia',
          image: 'https://placekitten.com/200/305',
          author: 'Katherine Patterson',
          languages: ['en'],
          created_at: '1000',
        },
      ];
      dispatch({ type: 'API_RETURNED', payload: books });
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
