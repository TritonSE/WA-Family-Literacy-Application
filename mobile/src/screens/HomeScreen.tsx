import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { ColumnBookList } from '../components/ColumnBookList';
import { HorizontalBookList } from '../components/HorizontalBookList';
import { BookContext } from '../context/BookContext';
import { TextStyles } from '../styles/TextStyles';
import { Colors } from '../styles/Colors';

/**
 * Renders the homescreen for the app. Currently displays heading, new books, all books.
 */
export const HomeScreen: React.FC = () => {
  // get books from backend
  const booksCtx = useContext(BookContext);
  useEffect(booksCtx.fetchBooks, []);
  const newBooks = booksCtx.books
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  const allBooks = booksCtx.books;

  // fix to make the flatlist for AllBooks not be inside a scrollview but maintain scrolling
  const VirtualizedView: React.FC = (props) => {
    return (
      <FlatList
        data={[]}
        ListEmptyComponent={null}
        keyExtractor={() => 'dummy'}
        renderItem={null}
        ListHeaderComponent={() => (
          <>{props.children}</>
        )}
      />
    );
  };

  return (
    <VirtualizedView>

      <View style={styles.heading}>
        <Svg height="100%" width="100%" viewBox="0 0 1 1">
          <Circle cx="0.5" cy="-0.3" r="0.8" stroke={Colors.orange} fill={Colors.orange} />
        </Svg>
      </View>

      <View style={styles.textPadding}>
        <Text style={TextStyles.h3}>New Books for You</Text>
      </View>

      <View>
        <HorizontalBookList books={newBooks} />
      </View>

      <View style={styles.textPadding}>
        <Text style={TextStyles.h3}>All Books </Text>
      </View>

      <View style={styles.allBooks}>
        <ColumnBookList books={allBooks} />
      </View>

    </VirtualizedView>
  );
};

const styles = StyleSheet.create({
  textPadding: {
    paddingTop: 33,
    paddingBottom: 19,
    paddingLeft: 17,
  },
  heading: {
    color: Colors.orange,
    height: 400,
  },
  allBooks: {
    marginLeft: 17,
    marginRight: 17,
  },
});
