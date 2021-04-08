import React from 'react';
import { Book } from '../models/Book';
import DeleteIcon from './Minus-sign.svg';
import { Language } from '../models/Languages';

import './BookCard.css';

// eslint-disable-next-line
type BookCardProps = { book: Book, size?: number, deleteMode: boolean, onDelete: (id: string, lang: Language[]) => void };

/**
 * Renders the image of a book in a rounded square. Size is both width and height.
 */
export const BookCard: React.FC<BookCardProps> = ({ book, size = 150, deleteMode, onDelete }) => {
  const testClick = (): void => {
    onDelete(book.id, book.languages);
  };
  return (
    <div className="container">
      <img className="bookImg" src={book.image} alt="" width={size} height={size} style={{ objectFit: 'cover' }}/>
      {deleteMode && <img className="deleteIcon" role="presentation" src={DeleteIcon} width="20px" height="20px" alt="" onClick={testClick}/>}
    </div>
  );
};
