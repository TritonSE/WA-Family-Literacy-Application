import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Book } from '../models/Book';
import CachedImage from 'react-native-expo-cached-image';

type BookCardProps = { book: Book, size?: number };

/**
 * Renders the image of a book in a rounded square. Size is both width and height.
 */
export const BookCard: React.FC<BookCardProps> = ({ book, size = 100 }) => {
  const imageSize = { width: size, height: size };
  return (
    <View style={styles.container}>
      <CachedImage source={{ uri: book.image }} style={[styles.image, imageSize]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: 'black',
    shadowRadius: 2,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 3 },
  },
  image: {
    borderRadius: 5,
  },
});
