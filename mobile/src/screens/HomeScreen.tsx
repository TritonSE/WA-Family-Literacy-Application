import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';

import { Svg, Circle } from 'react-native-svg';

import { BookFilter } from '../components/BookFilter';
import { PaginatedBookList } from '../components/PaginatedBookList';
import { HorizontalBookList } from '../components/HorizontalBookList';
import { LoadingCircle } from '../components/LoadingCircle';
import { BookContext } from '../context/BookContext';
import { TextStyles } from '../styles/TextStyles';
import { Colors } from '../styles/Colors';
import { I18nContext } from '../context/I18nContext';
import { Language } from '../models/Languages';
import { Book } from '../models/Book';

// how many books to display per page (in the Paginated Booklist)
const BOOKS_PER_PAGE = 9;

const { width } = Dimensions.get('window');

/**
 * Renders the homescreen for the app. Currently displays heading, new books, all books.
 */
export const HomeScreen: React.FC = () => {
  // get books from backend
  const booksCtx = useContext(BookContext);
  useEffect(booksCtx.fetchBooks, []);
  const newBooks = booksCtx.books
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);
  const { books, loading } = booksCtx;

  //i18n Context and translate function "t"
  const i18nCtx = useContext(I18nContext);
  const { t } = i18nCtx;

  // the current search term, selected languages, and filtered books
  const [search, setSearch] = useState('');
  const [langs, setLangs] = useState<Language[]>(['en']);
  const [filteredBooks, setFilteredBooks] = useState(books);

  // re-filter when the books (from the backend), search term, or selected languages change
  useEffect(() => {
    setFilteredBooks(filter(books, search, langs));
  }, [books, search, langs]);

  // set the current search term and selected languages, for the BookFilter, whenever they are changed
  const onFilter = (newSearch: string, newLangs: Language[]): void => {
    setSearch(newSearch);
    setLangs(newLangs);
  };

  return (

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView>

        <View style={styles.heading}>
          <View style={styles.top}/>
          <Svg height="100%" width="100%" viewBox="0 0 1 1">
            <Circle cx="0.5" cy="-0.3" r="0.8" stroke={Colors.orange} fill={Colors.orange} />
          </Svg>
        </View>

        <View style={styles.newBooksTextPadding}>
          <Text style={TextStyles.heading3}>{t('newBooks')}</Text>
        </View>

        <View>
          { booksCtx.loading ? <LoadingCircle/> : <HorizontalBookList books={newBooks}/> }
        </View>

        <View style={styles.allBooksTextPadding}>
          <Text style={TextStyles.heading3}>{t("allBooks")}</Text>
        </View>

        <View>
          <BookFilter onFilter={onFilter}/>

          <View style={styles.bookDisplay}>

            { loading ? <LoadingCircle/> : <PaginatedBookList books={filteredBooks} booksPerPage={BOOKS_PER_PAGE}/> }

            <View style={loading ? styles.loading : filteredBooks.length === 0 ? styles.loading : null}>
              { !loading && filteredBooks.length === 0 ? <Text style={styles.noResult}>No results</Text> : null }
            </View>

          </View>

        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// filters the books by title, author, and language
// if multiple languages are selected, returns books that have all of the languages
// if no languages are selected, returns books of all languages based on the search term
const filter = (books: Book[], search: string, langs: Language[]): Book[] => {
  const searchNorm = search.toLowerCase();

  return books.filter(book => {
    if (!langs.every(lang => book.languages.includes(lang))) {
      return false;
    }

    const title = book.title.toLowerCase();
    const author = book.author.toLowerCase();

    return title.includes(searchNorm) || author.includes(searchNorm);
  });
};

const styles = StyleSheet.create({
  heading: {
    color: Colors.orange,
    height: 400,
  },
  top: {
    marginTop: -500,
    height: 500,
    backgroundColor: Colors.orange,
  },
  newBooksTextPadding: {
    paddingTop: 33,
    paddingBottom: 19,
    paddingLeft: 17,
  },
  allBooksTextPadding: {
    paddingTop: 33,
    paddingBottom: 13,
    paddingLeft: 17,
  },
  bookDisplay: {
    marginTop: 19,
  },
  loading: {
    height: (0.28 * width * BOOKS_PER_PAGE / 3) + (12 * BOOKS_PER_PAGE / 3) + 25,
  },
  noResult: {
    ...TextStyles.caption2,
    textAlign: 'center',
  },
});
