import React from 'react';
import { FlatList, View, StyleSheet, Dimensions } from 'react-native';
import { Book } from '../models/Book';
import { BookCard } from './BookCard';

type AllBooksProp = { books: Book[] };

const { width } = Dimensions.get('window');

export const AllBooks: React.FC<AllBooksProp> = ({ books }) => {
  return (
    <FlatList
      data={books}
      renderItem={({ item, index }) => (
        <View style={(((index + 1 % 3) === 0) ? styles.rightMostBook : styles.normalBook)}>
          <BookCard book={item} index={1}/>
        </View>
      )}
      numColumns={3}
      scrollEnabled={false}
      keyExtractor={book => book.id}
    />
  );
};

const styles = StyleSheet.create({
  rightMostBook: {
    marginRight: 0,
    paddingBottom: 15,
  },
  normalBook: {
    marginRight: (width - 34 - 300) / 2,
    paddingBottom: 15,
  },
});
