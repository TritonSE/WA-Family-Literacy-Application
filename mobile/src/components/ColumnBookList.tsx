import React from 'react';
import { FlatList, StyleSheet, Dimensions } from 'react-native';
import { Book } from '../models/Book';
import { BookCard } from './BookCard';

type ColumnBookListProps = { books: Book[], header:any };

const { width } = Dimensions.get('window');

const VirtualizedView = (props: any) => {
  return (
    <FlatList
      data={[]}
      ListEmptyComponent={null}
      keyExtractor={() => "dummy"}
      renderItem={null}
      ListHeaderComponent={() => (
        <React.Fragment>{props.children}</React.Fragment>
      )}
    />
  );
}
export const ColumnBookList: React.FC<ColumnBookListProps> = ({ books, header }) => {
  return (
  
    <FlatList
      data={books}
      renderItem={({ item }) => (
          <BookCard book={item}/>
      )}
      numColumns={3}
      scrollEnabled={false}
      keyExtractor={book => book.id}
      columnWrapperStyle={styles.spaceColumns}
      ListHeaderComponent={header}
    />
  );
};

const styles = StyleSheet.create({
  spaceColumns: {
    flex: 1/3,
  }
});
