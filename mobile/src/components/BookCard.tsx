import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Book } from '../models/Book';
import { useNavigation } from '@react-navigation/native';

type BookCardProps = { book: Book, size?: number };

/**
 * Renders the image of a book in a rounded square. Size is both width and height.
 */
export const BookCard: React.FC<BookCardProps> = ({ book, size = 100 }) => {
  const imageSize = { width: size, height: size };
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Book', {
        id: book.id
      })}>
        <Image source={{ uri: book.image }} style={[styles.image, imageSize]} />
      </TouchableOpacity>
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
