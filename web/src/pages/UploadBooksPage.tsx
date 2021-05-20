import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { BookCard } from '../components/BookCard';
import { Book } from '../models/Book';
import { Language, LanguageLabels } from '../models/Languages';
import { APIContext } from '../context/APIContext';
import AddIcon from '../assets/images/plus-circle-solid.svg';
import SearchIcon from '../assets/images/search-solid.svg';

import '../App.css';
import styles from './UploadBooksPage.module.css';

export const UploadBooksPage: React.FC = () => {
  // book grid view states
  const [books, setBooks] = useState<Book[]>([]);
  const [newBooks, setNewBooks] = useState<Book[]>([]);
  const [viewAll, setViewAll] = useState(false);

  // delete states
  const [deleteMode, setDeleteMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [modalLanguages, setModalLanguages] = useState<Language[]>([]);
  const [checkedAll, setCheckedAll] = useState(false);
  const [checked, setChecked] = useState<{ [key in Language]?: boolean }>({});
  const [deleteId, setDeleteId] = useState('');

  // search state
  const [query, setQuery] = useState('');

  const client = useContext(APIContext);
  const history = useHistory();

  useEffect(
    () => {
      (async () => {
        const res = await client.getBooks();
        setBooks(res);
      })();
    },
    [],
  );

  useEffect(
    () => {
      const tmpBooks: Book[] = books;
      setNewBooks(tmpBooks.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }));
    },
    [books],
  );

  // show delete menu with book's languages and checkboxes
  const displayModal = (id: string, langs: Language[]): void => {
    setShowModal(true);
    setDeleteId(id);
    setModalLanguages(langs);
    setCheckedAll(false);
    const langDict: { [key in Language]?: boolean } = {};
    for (let i = 0; i < langs.length; i++) {
      langDict[langs[i]] = false;
    }
    setChecked(langDict);
  };

  // delete checked languages on confirmation
  const handleDelete = async (): Promise<void> => {
    setConfirmationModal(false);
    setShowModal(false);
    const langs: Language[] = Object.keys(checked) as Array<Language>;
    if (checkedAll) {
      await client.deleteBook(deleteId);
      setBooks(books.filter(book => book.id !== deleteId));
    } else {
      langs.map(async (lang) => {
        if (checked[lang]) {
          await client.deleteBookByLang(deleteId, lang);
          setBooks(books.map((book) => {
            if (book.id === deleteId) {
              const updatedBook: Book = book;
              updatedBook.languages = updatedBook.languages.filter(language => language !== lang);
              return updatedBook;
            }
            else {
              return book;
            }
          }));
        }
      });
    }
  };

  // toggle state of individual checkbox on select/deselect
  const toggleCheck = (lang: Language): void => {
    setChecked((prevState) => {
      const newState = { ...prevState };
      newState[lang] = !prevState[lang];
      return newState;
    });
  };

  // checking or unchecking 'All' checkbox changes all language checkboxes
  const selectAllCheck = (isChecked: boolean): void => {
    setCheckedAll(isChecked);
    setChecked((prevState) => {
      const newState = { ...prevState };
      const langs: Language[] = Object.keys(newState) as Array<Language>;
      for (let i = 0; i < langs.length; i++) {
        newState[langs[i]] = isChecked;
      }
      return newState;
    });
  };

  // checking all languages activates 'All' checkbox, unchecking any deactivates
  useEffect(() => {
    let allChecked = true;
    const langs: Language[] = Object.keys(checked) as Array<Language>;
    for (let i = 0; i < langs.length; i++) {
      if (checked[langs[i]] === false) {
        allChecked = false;
      }
    }
    if (allChecked) {
      setCheckedAll(true);
    } else {
      setCheckedAll(false);
    }
  }, [checked]);

  // predicate callback for filtering book array on search
  const search = (currBook: Book): boolean => {
    const queryIdxTitle = currBook.title.toLowerCase().indexOf(query.toLowerCase());
    const queryIdxAuthor = currBook.author.toLowerCase().indexOf(query.toLowerCase());

    // show book if title or author contains query substring
    return queryIdxTitle !== -1 || queryIdxAuthor !== -1;
  };


  return (
    <div>
      <div className={styles.row}>
        <div></div>
        <div className={styles.searchContainer}>
          <input className={styles.search} onChange={event => setQuery(event.target.value)} name="q" type="search" placeholder="Search Book to Edit" />
          <button type="button" className={styles.searchButton}>
            <img className={styles.searchIcon} src={SearchIcon} alt='' />
          </button>
        </div>
        <button type="button" className={styles.newButton} onClick={() => history.push("/books/new")}>
          <p>New Book</p>
          <img className={styles.addIcon} src={AddIcon} alt='' />
        </button>
      </div>
      <div className={styles.row}>
        <div className={styles.row}>
          <p className={styles.title}>{viewAll ? 'All Books' : 'Recent Releases'}</p>
          <button type="button" onClick={() => setViewAll(!viewAll)} className={styles.clickableText}>
            {viewAll ? 'View Less' : 'View All'}
          </button>
        </div>
      </div>
      <div className={styles.row}>
        <p className="body3">(Tap book to edit)</p>
        <button type="button" onClick={() => setDeleteMode(!deleteMode)} className={styles.clickableText}>
          {deleteMode ? 'Done' : 'Delete Books'}
        </button>
      </div>
      <div className={styles.books}>
        {viewAll ? books.filter(search).sort((a, b) => {
          if (a.title < b.title) { return -1; }
          if (a.title > b.title) { return 1; }
          return 0;
        })
          .map((book) => (
            <BookCard key={book.id} book={book} onDelete={displayModal} deleteMode={deleteMode} />
          )) :
          newBooks.filter(search).map((book) => (
            <BookCard key={book.id} book={book} onDelete={displayModal} deleteMode={deleteMode} />
          ))

        }
      </div>
      {showModal &&
        (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <form>
                {confirmationModal ? (
                  <div>
                    <p className={styles.modalTitle}>Are you sure you want to delete these book(s)?</p>
                    <div className={styles.buttonsContainer}>
                      <button className={styles.cancelBtn} type="button" onClick={() => { setShowModal(false); setConfirmationModal(false); }}>Cancel</button>
                      <button className={styles.deleteBtn} type="button" onClick={handleDelete}>Delete</button>
                    </div>
                  </div>
                )
                  : (
                    <div>
                      <p className={styles.modalTitle}>Which version(s) of this book would you like to delete?</p>
                      {modalLanguages.map(lang => (
                        <label key={lang} className={styles.checkboxContainer} htmlFor={lang}>
                          {LanguageLabels[lang]}
                          <input checked={checked[lang]} onChange={() => toggleCheck(lang)} id={lang} type="checkbox" />
                          <span className={styles.checkmark}></span>
                          <br />
                        </label>
                      ))}
                      <label className={styles.checkboxContainer} htmlFor="all">
                        All languages
                        <input id="all" checked={checkedAll} onChange={(event) => selectAllCheck(event.target.checked)} type="checkbox" />
                        <span className={styles.checkmark}></span>
                        <br />
                      </label>
                      <div className={styles.buttonsContainer}>
                        <button className={styles.cancelBtn} type="button" onClick={() => setShowModal(false)}>Cancel</button>
                        <button className={styles.deleteBtn} type="button" onClick={() => setConfirmationModal(true)}>Delete</button>
                      </div>
                    </div>
                  )}
              </form>
            </div>
          </div>
        )}
    </div>
  );
};
