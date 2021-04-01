import React from 'react';
import { Book } from '../models/Book';

import './BookCard.css';

type BookCardProps = { book: Book, size?: number };

/**
 * Renders the image of a book in a rounded square. Size is both width and height.
 */
export const BookCard: React.FC<BookCardProps> = ({ book, size = 150 }) => {
  return (
    <div>
      <img src={book.image} alt="" width={size} height={size} style={{ objectFit: 'cover' }}/>
      <div style={{ backgroundColor: 'black', width: '20px', height: '20px' }}/>
    </div>
  );
};
