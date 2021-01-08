import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { AllBooks } from '../components/AllBooks';
import { BookList } from '../components/BookList';
import { BookContext } from '../context/BookContext';
import { Heading } from '../components/Heading';
import { TextStyles } from '../styles/TextStyles';

export const HomeScreen: React.FC = () => {
  const booksCtx = useContext(BookContext);
  useEffect(booksCtx.fetchBooks, []);
  const newBooks = booksCtx.books
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);
  const allBooks = booksCtx.books;

  return (
    <ScrollView>
      <Heading />
      <View>
        <Text style={styles.text}>New Books for You</Text>
      </View>

      <View>
        <BookList books={newBooks} />
      </View>

      <View>
        <Text style={styles.text}>All Books </Text>
      </View>

      <View style={styles.allBooks}>
        <AllBooks books={allBooks} />
      </View>
    </ScrollView>
  );
};

export const styles = StyleSheet.create({
  text: {
    ...TextStyles.h3,
    paddingTop: 33,
    paddingBottom: 19,
    paddingLeft: 17,
  },
  allBooks: {
    paddingLeft: 17,
    paddingRight: 17,
  },
});
