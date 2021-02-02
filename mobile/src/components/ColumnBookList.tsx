import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Book } from '../models/Book';
import { BookCard } from './BookCard';

type ColumnBookListProps = { books: Book[] };

export const ColumnBookList: React.FC<ColumnBookListProps> = ({ books }) => {
  return (
    <FlatList
      data={books}
      renderItem={({ item }) => (
        <View style={styles.bookCard}>
          <BookCard book={item} size={120} />
        </View>
      )}
      numColumns={3}
      scrollEnabled={false}
      keyExtractor={book => book.id}
      columnWrapperStyle={styles.spaceColumns}
    />
  );
};

const styles = StyleSheet.create({
  spaceColumns: {
    justifyContent: 'space-between',
  },
  bookCard: {
    marginBottom: 12,
  },
});
