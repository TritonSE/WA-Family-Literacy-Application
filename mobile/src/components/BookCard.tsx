import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Book } from '../models/Book';

type BookProps = { book: Book, index: number };

export const BookCard: React.FC<BookProps> = ({ book, index }) => {
  return (
    <View style={styles.container}>
      <View style={styles.shadow}>
        <Image source={{ uri: book.image }} style={(index === 0) ? styles.imageFirst : ((index === 4) ? styles.imageLast : styles.image)}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  shadow: {
    shadowColor: 'black',
    justifyContent: 'center',
    shadowRadius: 2,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 3 },
  },

});
