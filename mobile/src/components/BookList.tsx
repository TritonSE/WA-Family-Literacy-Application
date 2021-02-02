import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { Book } from '../models/Book';
import { BookCard } from './BookCard';

type BookListProps = { books: Book[] };

export const BookList: React.FC<BookListProps> = ({ books }) => {
  return (
    <FlatList
      data={books}
      renderItem={({ item, index }) => (
        <View
          style={(index === 0) ? styles.imageFirst :
            ((index === 4) ? styles.imageLast :
              styles.image)}
        >
          <BookCard book={item} />
        </View>
      )}
      horizontal
      ItemSeparatorComponent={
        () => <View style={{ width: 13 }} />
      }
      keyExtractor={book => book.id}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    marginBottom: 5,
    borderRadius: 5,
  },
  imageFirst: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginLeft: 17,
  },
  imageLast: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 17,
  },
});
