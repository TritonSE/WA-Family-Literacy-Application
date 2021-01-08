import React from 'react';
import { FlatList, View } from 'react-native';
import { Book } from '../models/Book';
import { BookCard } from './BookCard';

type BookListProps = {books: Book[] };

export const BookList: React.FC<BookListProps> = ({ books }) => {
  return (
    <FlatList
      data={books}
      renderItem={({ item, index }) => <BookCard book={item} index={index} />}
      horizontal
      ItemSeparatorComponent={
                    () => <View style={{ width: 13 }}/>
                }
      keyExtractor={book => book.id}
    />
  );
};
