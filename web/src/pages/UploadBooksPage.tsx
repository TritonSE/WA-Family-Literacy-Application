import React, { useState, useEffect } from 'react';
import { BookCard } from '../components/BookCard';
import { Book } from '../models/Book';

import './UploadBooksPage.css';

export const UploadBooksPage: React.FC = () => {
  const books: Book[] = [
    {
      id: 'a',
      title: 'foo',
      image: 'https://placekitten.com/200/300',
      createdAt: '10000',
      author: 'cat',
      languages: ['en'],
    },
    {
      id: 'b',
      title: 'bar',
      image: 'https://placekitten.com/200/301',
      createdAt: '1500',
      author: 'cat',
      languages: ['en'],
    },
    {
      id: 'c',
      title: 'bar',
      image: 'https://placekitten.com/200/302',
      createdAt: '2000',
      author: 'cat',
      languages: ['en'],
    },
    {
      id: 'd',
      title: 'bar',
      image: 'https://placekitten.com/200/303',
      createdAt: '3000',
      author: 'cat',
      languages: ['en'],
    },
    {
      id: 'e',
      title: 'bar',
      image: 'https://placekitten.com/200/304',
      createdAt: '1000',
      author: 'cat',
      languages: ['en'],
    },
    {
      id: 'f',
      title: 'bar',
      image: 'https://placekitten.com/200/305',
      createdAt: '1000',
      author: 'cat',
      languages: ['en'],
    },
    {
      id: 'g',
      title: 'bar',
      image: 'https://placekitten.com/200/306',
      createdAt: '1000',
      author: 'cat',
      languages: ['en'],
    },
    {
      id: 'a',
      title: 'foo',
      image: 'https://placekitten.com/200/300',
      createdAt: '10000',
      author: 'cat',
      languages: ['en'],
    },
    {
      id: 'b',
      title: 'bar',
      image: 'https://placekitten.com/200/301',
      createdAt: '1500',
      author: 'cat',
      languages: ['en'],
    },
    {
      id: 'c',
      title: 'bar',
      image: 'https://placekitten.com/200/302',
      createdAt: '2000',
      author: 'cat',
      languages: ['en'],
    },
    {
      id: 'd',
      title: 'bar',
      image: 'https://placekitten.com/200/303',
      createdAt: '3000',
      author: 'cat',
      languages: ['en'],
    },
    {
      id: 'e',
      title: 'bar',
      image: 'https://placekitten.com/200/304',
      createdAt: '1000',
      author: 'cat',
      languages: ['en'],
    },
    {
      id: 'f',
      title: 'bar',
      image: 'https://placekitten.com/200/305',
      createdAt: '1000',
      author: 'cat',
      languages: ['en'],
    },
    {
      id: 'g',
      title: 'bar',
      image: 'https://placekitten.com/200/306',
      createdAt: '1000',
      author: 'cat',
      languages: ['en'],
    },
    {
      id: 'a',
      title: 'foo',
      image: 'https://placekitten.com/200/300',
      createdAt: '10000',
      author: 'cat',
      languages: ['en'],
    },
    {
      id: 'b',
      title: 'bar',
      image: 'https://placekitten.com/200/301',
      createdAt: '1500',
      author: 'cat',
      languages: ['en'],
    },
    {
      id: 'c',
      title: 'bar',
      image: 'https://placekitten.com/200/302',
      createdAt: '2000',
      author: 'cat',
      languages: ['en'],
    },
    {
      id: 'd',
      title: 'bar',
      image: 'https://placekitten.com/200/303',
      createdAt: '3000',
      author: 'cat',
      languages: ['en'],
    },
    {
      id: 'e',
      title: 'bar',
      image: 'https://placekitten.com/200/304',
      createdAt: '1000',
      author: 'cat',
      languages: ['en'],
    },
    {
      id: 'f',
      title: 'bar',
      image: 'https://placekitten.com/200/305',
      createdAt: '1000',
      author: 'cat',
      languages: ['en'],
    },
    {
      id: 'g',
      title: 'bar',
      image: 'https://placekitten.com/200/306',
      createdAt: '1000',
      author: 'cat',
      languages: ['en'],
    },
  ];

  const [deleteMode, setDeleteMode] = useState(false);
  const [deleteLabel, setDeleteLabel] = useState('Delete Books');
  const [viewAll, setViewAll] = useState(false);
  const [viewLabel, setViewLabel] = useState('View All');
  const [numBooksShown, setNumBooksShown] = useState(0);

  useEffect(
    () => {
      if (deleteMode) {
        setDeleteLabel('Done');
      } else {
        setDeleteLabel('Delete Books');
      }
    },
    [deleteMode],
  );

  useEffect(
    () => {
      if (viewAll) {
        setViewLabel('View Less');
        setNumBooksShown(books.length);
      } else {
        setViewLabel('View All');
        setNumBooksShown(12);
      }
    },
    [viewAll],
  );

  return (
    <div className="upload">
      <div className="row">
        <input className="search" type="search" placeholder="Search Book to Edit" />
      </div>
      <div className="row">
        <div className="row">
          <p className="title">Recent Releases</p>
          <button type="button" onClick={() => setViewAll(!viewAll)} className="clickable">{viewLabel}</button>
        </div>
      </div>
      <div className="row">
        <p>(Tap book to edit)</p>
        <button type="button" onClick={() => setDeleteMode(!deleteMode)} className="clickable">{deleteLabel}</button>
      </div>
      <div className="books">
        {books.slice(0, numBooksShown).map((book) => (
          <BookCard book={book} />
        ))}
      </div>
    </div>
  );
};
