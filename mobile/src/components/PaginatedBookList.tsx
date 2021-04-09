import React from 'react';
import { Dimensions, StyleSheet, View, Text, ScrollView } from 'react-native';

import { Book } from '../models/Book';
import { TextStyles } from '../styles/TextStyles';
import { BookCard } from './BookCard';
import { useNavigation } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

type PaginatedBookListProps = { books: Book[], booksPerPage: number };

/**
* Renders a "paginated" list of books where books are grouped into grids and displayed on multiple pages.
*/
export const PaginatedBookList: React.FC<PaginatedBookListProps> = ({ books, booksPerPage }) => {
  // "chunks" the books into groups of size <booksPerPage> and fills any empty spots
  const bookPages: Book[][] = [];
  const empty = Array(booksPerPage).fill(null);

  for (let i = 0; i < books.length; i += booksPerPage) {
    const emptyCount = i + booksPerPage > books.length ? (i + booksPerPage) - books.length : 0;
    bookPages.push(books.slice(i, i + booksPerPage).concat(empty.slice(0, emptyCount)));
  }

  const navigation = useNavigation();

  return (

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator
      pagingEnabled
    >

      { bookPages.map((bookArray: Book[], index: number) => (
        <View key={`page${index}`} style={styles.container}>

          <View style={styles.grid}>

            { bookArray.map((bookItem: Book, emptyIndex: number) => (
              bookItem != null ?
                (
                  <TouchableWithoutFeedback 
                    key={`bookItem${bookItem.id}`}
                    onPress={() => navigation.navigate('Book', {
                      book: bookItem,
                    })}
                  >
                    <View key={`bookID${bookItem.id}`} style={styles.bookCard}>
                      <BookCard book={bookItem} size={0.28 * width} />
                    </View>
                  </TouchableWithoutFeedback>
                )
                :
                (
                  <View key={`empty${emptyIndex}`} style={styles.bookCard}>
                    <View style={styles.emptyBook} />
                  </View>
                )
            ))}

          </View>

          <View style={styles.text}>
            <Text style={TextStyles.heading3}> {'<'} {index + 1} {'>'} </Text>
          </View>

        </View>
      ))}

    </ScrollView>

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
