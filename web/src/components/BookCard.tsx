import React, { useContext } from 'react';
import { Book } from '../models/Book';
import DeleteIcon from '../assets/images/Minus-sign.svg';
import { Language } from '../models/Languages';

import styles from './BookCard.module.css';
import { useHistory } from 'react-router';
import { AuthContext } from '../context/AuthContext';

// eslint-disable-next-line
type BookCardProps = { book: Book, size?: number, deleteMode: boolean, onDelete: (id: string, lang: Language[]) => void };

/**
 * Renders the image of a book in a rounded square. Size is both width and height.
 */
export const BookCard: React.FC<BookCardProps> = ({ book, size = 150, deleteMode, onDelete }) => {
  const history = useHistory();
  const auth = useContext(AuthContext);

  return <>
    {
      auth.admin?.can_edit_books ?
        <button className={styles.containerClickable} onClick={() => history.push(`/books/${book.id}`)}>
          <img className={styles.bookImg} src={book.image} alt="" width={size} height={size} style={{ objectFit: 'cover' }} />
          {deleteMode ? <img className={styles.deleteIcon} role="presentation" src={DeleteIcon} width="20px" height="20px" alt="" onClick={() => onDelete(book.id, book.languages)} /> : null}
        </button>
        :
        <div className={styles.container}>
          <img className={styles.bookImg} src={book.image} alt="" width={size} height={size} style={{ objectFit: 'cover' }} />
          {deleteMode ? <img className={styles.deleteIcon} role="presentation" src={DeleteIcon} width="20px" height="20px" alt="" onClick={() => onDelete(book.id, book.languages)} /> : null}
        </div>
    }
  </>;

};
