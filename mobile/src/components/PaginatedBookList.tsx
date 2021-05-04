import React, { useContext, useState } from 'react';
import { Dimensions, StyleSheet, View, Text, ScrollView, NativeSyntheticEvent, NativeScrollEvent, Animated } from 'react-native';

import { Book } from '../models/Book';
import { TextStyles } from '../styles/TextStyles';
import { BookCard } from './BookCard';
import { useNavigation } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { I18nContext } from '../context/I18nContext';

const { width } = Dimensions.get('window');

type PaginatedBookListProps = { books: Book[], booksPerPage: number };

/**
 * Renders a "paginated" list of books where books are grouped into grids and displayed on multiple pages.
 */
export const PaginatedBookList: React.FC<PaginatedBookListProps> = ({ books, booksPerPage }) => {
  const i18n = useContext(I18nContext);
  const navigation = useNavigation();

  // "chunks" the books into groups of size <booksPerPage> and fills any empty spots
  const bookPages: Book[][] = [];
  const empty = Array(booksPerPage).fill(null);

  for (let i = 0; i < books.length; i += booksPerPage) {
    const emptyCount = i + booksPerPage > books.length ? (i + booksPerPage) - books.length : 0;
    bookPages.push(books.slice(i, i + booksPerPage).concat(empty.slice(0, emptyCount)));
  }

  const [currentPage, setCurrentPage] = useState(1);
  // Called when the ScrollView is scrolled, to determine the current page, shown below the ScrollView
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const pos = e.nativeEvent.contentOffset.x;
    const pageWidth = e.nativeEvent.layoutMeasurement.width;

    setCurrentPage(1 + Math.round(pos / pageWidth));
  };

  // Animation handler to call handleScroll when the view is scrolled
  const onScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: { x: new Animated.Value(0) },
        },
      }
    ], {
      useNativeDriver: false,
      listener: handleScroll
    });

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        pagingEnabled
        onScroll={onScroll}
        scrollEventThrottle={16}
      >

        {bookPages.map((bookArray: Book[], index: number) => (
          <View key={`page${index}`} style={styles.container}>

            <View style={styles.grid}>

              {bookArray.map((bookItem: Book, emptyIndex: number) => (
                bookItem != null ?
                  (
                    <TouchableWithoutFeedback
                      key={`bookItem${bookItem.id}`}
                      onPress={() => navigation.navigate('Book', {
                        book: bookItem,
                      })}
                    >
                      <View key={`bookID${bookItem.id}`} style={styles.bookCard}>
                        <BookCard book={bookItem} size={0.28 * width}/>
                      </View>
                    </TouchableWithoutFeedback>
                  )
                  :
                  (
                    <View key={`empty${emptyIndex}`} style={styles.bookCard}>
                      <View style={styles.emptyBook}/>
                    </View>
                  )
              ))}

            </View>

          </View>
        ))}

      </ScrollView>

      <View style={styles.text}>
        <Text style={TextStyles.heading3}>{i18n.t('pageMofN', { m: currentPage, n: bookPages.length })}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    width: width - 34,
    marginHorizontal: 17,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignContent: 'space-around',
  },
  bookCard: {
    marginBottom: 12,
  },
  emptyBook: {
    width: 0.28 * width,
    height: 0.28 * width,
  },
  text: {
    alignItems: 'center',
    marginBottom: 5,
  },
});
