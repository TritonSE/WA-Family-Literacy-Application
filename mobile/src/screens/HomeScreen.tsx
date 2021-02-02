import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { ColumnBookList } from '../components/ColumnBookList';
import { BookList } from '../components/BookList';
import { BookContext } from '../context/BookContext';
import { TextStyles } from '../styles/TextStyles';

export const HomeScreen: React.FC = () => {
  const booksCtx = useContext(BookContext);
  useEffect(booksCtx.fetchBooks, []);
  const newBooks = booksCtx.books
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);
  const allBooks = booksCtx.books;

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
          <Circle cx="0.5" cy="-0.3" r="0.8" stroke="#E89228" fill="#E89228" />
        </Svg>
      </View>

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
        <ColumnBookList books={allBooks} />
      </View>

    </VirtualizedView>
  );
};

const styles = StyleSheet.create({
  text: {
    ...TextStyles.h3,
    paddingTop: 33,
    paddingBottom: 19,
    paddingLeft: 17,
  },
  heading: {
    color: '#E89228',
    height: 400,
  },
  allBooks: {
    marginLeft: 17,
    marginRight: 17,
  },

});
