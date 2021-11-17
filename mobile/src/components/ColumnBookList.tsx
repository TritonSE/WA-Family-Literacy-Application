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
export const ColumnBookList: React.FC<ColumnBookListProps> = ({ books}) => {
  const navigation = useNavigation();
  return (
    <FlatList
      data={books}
      renderItem={({ item }) => (
        <Pressable onPress={() => navigation.navigate('Book', {
          book: item,
        })}
        >
          <View style={styles.bookCard}>
            <BookCard book={item} size={0.28 * width} />
          </View>
        </Pressable>
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
