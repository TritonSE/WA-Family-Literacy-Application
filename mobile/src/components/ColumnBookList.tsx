import React from 'react';
import { Dimensions, FlatList, StyleSheet, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Book } from '../models/Book';
import { BookCard } from './BookCard';

type ColumnBookListProps = { books: Book[] };

const { width } = Dimensions.get('window');

/**
 * Renders a vertical list of books with 3 books per row.
 */
export const ColumnBookList: React.FC<ColumnBookListProps> = ({ books }) => {
  const navigation = useNavigation();

  const bookCards = books.map(book =>
    <Pressable key={book.id} onPress={() => navigation.navigate('Book', { book })}>
      <View style={styles.bookCard}>
        <BookCard book={book} size={0.28 * width} />
      </View>
    </Pressable>
  );

  return (
    <View style={styles.list}>
      {bookCards}
    </View>
  );
};

const styles = StyleSheet.create({
  bookCard: {
    marginBottom: 12,
    margin: 0.026 * width
  },
  list: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
});
