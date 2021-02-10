import React, { createContext, useReducer } from 'react';
const axios = require('axios').default;
import { Book } from '../models/Book';

type APIState = {
    APIClient: any , // holds all the books we have stored
};

const initialState: APIState = {
  APIClient: axios.create({baseURL:"https://localhost:8080"}),
};

export const APIContext = createContext<APIState>(initialState);

export const APIProvider: React.FC = ({ children }) => {

    const state = initialState;
    
    // function books(): Book[] {
    //   const books: Book[] = [
    //     {
    //       id: 'a',
    //       title: 'foo',
    //       image: 'https://placekitten.com/200/300',
    //       createdAt: '10000',
    //     },
    //     {
    //       id: 'b',
    //       title: 'bar',
    //       image: 'https://placekitten.com/200/301',
    //       createdAt: '1500',
    //     },
    //     {
    //       id: 'c',
    //       title: 'bar',
    //       image: 'https://placekitten.com/200/302',
    //       createdAt: '2000',
    //     },
    //     {
    //       id: 'd',
    //       title: 'bar',
    //       image: 'https://placekitten.com/200/303',
    //       createdAt: '3000',
    //     },
    //     {
    //       id: 'e',
    //       title: 'bar',
    //       image: 'https://placekitten.com/200/304',
    //       createdAt: '1000',
    //     },
    //     {
    //       id: 'f',
    //       title: 'bar',
    //       image: 'https://placekitten.com/200/305',
    //       createdAt: '1000',
    //     },
    //     {
    //       id: 'g',
    //       title: 'bar',
    //       image: 'https://placekitten.com/200/306',
    //       createdAt: '1000',
    //     },
    //     {
    //       id: 'h',
    //       title: 'bar',
    //       image: 'https://placekitten.com/200/307',
    //       createdAt: '1000',
    //     },
    //     {
    //       id: 'i',
    //       title: 'bar',
    //       image: 'https://placekitten.com/200/310',
    //       createdAt: '1000',
    //     },
    //     {
    //       id: 'j',
    //       title: 'foo',
    //       image: 'https://placekitten.com/200/300',
    //       createdAt: '10000',
    //     },
    //     {
    //       id: 'k',
    //       title: 'bar',
    //       image: 'https://placekitten.com/200/301',
    //       createdAt: '1500',
    //     },
    //     {
    //       id: 'l',
    //       title: 'bar',
    //       image: 'https://placekitten.com/200/302',
    //       createdAt: '2000',
    //     },
    //     {
    //       id: 'm',
    //       title: 'bar',
    //       image: 'https://placekitten.com/200/303',
    //       createdAt: '3000',
    //     },
    //     {
    //       id: 'n',
    //       title: 'bar',
    //       image: 'https://placekitten.com/200/304',
    //       createdAt: '1000',
    //     },
    //     {
    //       id: 'o',
    //       title: 'bar',
    //       image: 'https://placekitten.com/200/305',
    //       createdAt: '1000',
    //     },
    //     {
    //       id: 'p',
    //       title: 'bar',
    //       image: 'https://placekitten.com/200/306',
    //       createdAt: '1000',
    //     },
    //     {
    //       id: 'q',
    //       title: 'bar',
    //       image: 'https://placekitten.com/200/307',
    //       createdAt: '1000',
    //     },
    //     {
    //       id: 'r',
    //       title: 'bar',
    //       image: 'https://placekitten.com/200/310',
    //       createdAt: '1000',
    //     },
    //     {
    //       id: 's',
    //       title: 'foo',
    //       image: 'https://placekitten.com/200/300',
    //       createdAt: '10000',
    //     },
    //     {
    //       id: 't',
    //       title: 'bar',
    //       image: 'https://placekitten.com/200/301',
    //       createdAt: '1500',
    //     },
    //     {
    //       id: 'u',
    //       title: 'bar',
    //       image: 'https://placekitten.com/200/302',
    //       createdAt: '2000',
    //     },
    //     {
    //       id: 'v',
    //       title: 'bar',
    //       image: 'https://placekitten.com/200/303',
    //       createdAt: '3000',
    //     },
    //     {
    //       id: 'w',
    //       title: 'bar',
    //       image: 'https://placekitten.com/200/304',
    //       createdAt: '1000',
    //     },
    //     {
    //       id: 'x',
    //       title: 'bar',
    //       image: 'https://placekitten.com/200/305',
    //       createdAt: '1000',
    //     },
    
    //     ];
    //     return books
    //   }
        return (
            <APIContext.Provider
                value= {{ 
                  APIClient: state.APIClient,
                }}>
                  {children}
            </APIContext.Provider>
        )
};


// type BookAction = {type: 'BOOKS_LOADED', payload: Book[]};

// const reducer = (state: APIState, action: BookAction): APIState => {
//   switch (action.type) {
//     case 'BOOKS_LOADED':
//       return { ...state, books: action.payload };
//     default:
//       return state;
//   }
// };
