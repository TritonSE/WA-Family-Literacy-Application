import React from 'react';
import { FlatList, View, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Book } from '../models/Book';
import { BookCard } from './BookCard';

type HorizontalBookListProps = { books: Book[] };

/**
 * Renders a scrollable horizontal list of 5 books
 */
export const HorizontalBookList: React.FC<HorizontalBookListProps> = ({ books }) => {
  const navigation = useNavigation();
  return (
    <FlatList
      data={books}
      renderItem={({ item, index }) => (
        // this ensures that the first and last book have the correct spacing
        <Pressable onPress={() => navigation.navigate('Book', {
          book: item,
        })}
        >
          <View
            style={(index === 0) ? styles.imageFirst :
              ((index === 4) ? styles.imageLast :
                styles.image)}
          >
            <BookCard book={item} />
          </View>
        </Pressable>
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
