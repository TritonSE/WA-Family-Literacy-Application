import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { YoutubeVideo } from '../components/YoutubeVideo';
import { OfflineIndicator } from '../components/OfflineIndicator';

// how many books to display per page (in the Paginated Booklist)
const BOOKS_PER_PAGE = 9;

const { width } = Dimensions.get('window');

// YouTube videos shown in the orange header, with their titles
const TOP_VIDEOS = [
  {
    title: 'Welcome to Words Alive!',
    url: 'https://youtu.be/A4Dv8Z_M5VQ',
  },
  {
    title: 'The Big 5: Talk, Read, Sing, Write, and Play',
    url: 'https://youtu.be/-dYFwK5eDS0',
  },
];

/**
 * Renders the homescreen for the app. Currently displays heading, new books, all books.
 */
export const HomeScreen: React.FC = () => {
  // get books from backend
  const booksCtx = useContext(BookContext);
  useEffect(booksCtx.fetchBooks, []);
  const { books, loading } = booksCtx;
  const newBooks = [...books]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView>
        {/* Orange box above the screen, in case the user scrolls past the top of the screen */}
        <View style={styles.top} />
        {/* Starts at the top of the screen, containing the welcome videos and orange rounded background */}
        <View style={styles.heading}>
          <SafeAreaView edges={["top"]}>
            <OfflineIndicator variant="white" style={{ height: "60%" }}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={styles.videos}
                contentContainerStyle={styles.videoChildContainer}
              >
                {TOP_VIDEOS.map((video) => (
                  <View key={video.url} style={styles.videoContainer}>
                    <YoutubeVideo
                      url={video.url}
                      width={0.8 * width}
                      height={(9 / 16) * 0.8 * width}
                    />
                    <Text style={[TextStyles.heading2, styles.videoTitle]}>
                      {video.title}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </OfflineIndicator>
          </SafeAreaView>

          <Svg
            height="100%"
            width="100%"
            viewBox="0 0 1 1"
            style={styles.circle}
          >
            <Circle
              cx="0.5"
              cy="-0.3"
              r="0.8"
              stroke={Colors.orange}
              fill={Colors.orange}
            />
          </Svg>
        </View>

        <View style={styles.newBooksTextPadding}>
          <Text style={TextStyles.heading3}>{t("newBooks")}</Text>
        </View>

        <View>
          {booksCtx.loading ? (
            <LoadingCircle />
          ) : (
            <HorizontalBookList books={newBooks} />
          )}
        </View>

        <View style={styles.allBooksTextPadding}>
          <Text style={TextStyles.heading3}>{t("allBooks")}</Text>
        </View>

        <View>
          <BookFilter onFilter={onFilter} />

          <View style={styles.bookDisplay}>
            {loading ? (
              <LoadingCircle />
            ) : (
              <PaginatedBookList
                books={filteredBooks}
                booksPerPage={BOOKS_PER_PAGE}
              />
            )}

            <View
              style={
                loading
                  ? styles.loading
                  : filteredBooks.length === 0
                    ? styles.loading
                    : null
              }
            >
              {!loading && filteredBooks.length === 0 ? (
                <Text style={styles.noResult}>No results</Text>
              ) : null}
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
  circle: {
    marginTop: -400,
    zIndex: -1, // needed to render behind the welcome videos
  },
  videos: {
    height: '100%',
    width: '100%',
  },
  videoChildContainer: {
    // this + videoContainer.marginHorizontal must equal 0.1, to keep videos centered but allowing the next/previous video to peek around the edges of the screen
    paddingHorizontal: 0.075 * width,
  },
  videoContainer: {
    marginTop: 16,
    alignItems: 'center',
    width: 0.8 * width,
    marginHorizontal: 0.025 * width,
    height: 300,
  },
  videoTitle: {
    color: Colors.white,
    marginTop: 16,
    textAlign: 'center',
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
