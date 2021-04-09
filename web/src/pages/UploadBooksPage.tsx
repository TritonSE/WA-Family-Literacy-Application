import React, { useState, useEffect } from 'react';
import { BookCard } from '../components/BookCard';
import { Book } from '../models/Book';
import { Language, LanguageLabels } from '../models/Languages';
import { WordsAliveAPI } from '../api/WordsAliveAPI';

import './UploadBooksPage.css';

export const UploadBooksPage: React.FC = () => {
  // all books view states
  const [books, setBooks] = useState<Book[]>([]);
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

  // set up api client
  const baseURL = 'http://localhost:8080';
  // const baseURL = 'https://words-alive-staging.herokuapp.com';
  const client: WordsAliveAPI = new WordsAliveAPI(baseURL);
  useEffect(
    () => {
      (async () => {
        const res = await client.getBooks();
        setBooks(res);
      })();
    },
    [],
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
      <div className="row">
        <input className="search body1" onChange={event => setQuery(event.target.value)} name="q" type="search" placeholder="Search Book to Edit" />
      </div>
      <div className="row">
        <div className="row">
          <p className="title h2">Recent Releases</p>
          <button type="button" onClick={() => setViewAll(!viewAll)} className="clickableText body3">
            {viewAll ? 'View Less' : 'View All'}
          </button>
        </div>
      </div>
      <div className="row">
        <p className="body3">(Tap book to edit)</p>
        <button type="button" onClick={() => setDeleteMode(!deleteMode)} className="clickableText body3">
          {deleteMode ? 'Done' : 'Delete Books'}
        </button>
      </div>
      <div className="books">
        {books.filter(search).slice(0, viewAll ? books.length : 12).map((book) => (
          <BookCard key={book.id} book={book} onDelete={displayModal} deleteMode={deleteMode} />
        ))}
      </div>
      {showModal &&
        (
          <div className="modal">
            <div className="modalContent">
              <form>
                {confirmationModal ? (
                  <div>
                    <p className="h3 modalTitle">Are you sure you want to delete these book(s)?</p>
                    <div className="buttons">
                      <button className="cancelBtn body3" type="button" onClick={() => { setShowModal(false); setConfirmationModal(false); }}>Cancel</button>
                      <button className="deleteBtn body3" type="button" onClick={handleDelete}>Delete</button>
                    </div>
                  </div>
                )
                  : (
                    <div>
                      <p className="h3 modalTitle">Which version(s) of this book would you like to delete?</p>
                      {modalLanguages.map(lang => (
                        <label key={lang} className="checkboxContainer checkLabel body1" htmlFor={lang}>
                          {LanguageLabels[lang]}
                          <input className="checkbox" checked={checked[lang]} onChange={() => toggleCheck(lang)} id={lang} type="checkbox" />
                          <span className="checkmark"></span>
                          <br />
                        </label>
                      ))}
                      <label className="checkboxContainer checkLabel body1" htmlFor="all">
                        All languages
                        <input className="checkbox" id="all" checked={checkedAll} onChange={(event) => selectAllCheck(event.target.checked)} type="checkbox" />
                        <span className="checkmark"></span>
                        <br />
                      </label>
                      <div className="buttons">
                        <button className="cancelBtn body3" type="button" onClick={() => setShowModal(false)}>Cancel</button>
                        <button className="deleteBtn body3" type="button" onClick={() => setConfirmationModal(true)}>Delete</button>
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
