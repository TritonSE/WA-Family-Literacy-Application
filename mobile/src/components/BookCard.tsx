import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Book } from '../models/Book';

type BookCardProps = { book: Book };

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <View style={styles.container}>
        <Image source={{ uri: book.image }} style={styles.image}/>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    shadowColor: 'black',
    shadowRadius: 2,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 3 },
  },
  image: {
    height: 100,
    width: 100,
    marginBottom: 5,
    borderRadius: 5.
  }
});
