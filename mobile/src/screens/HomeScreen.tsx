import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { ColumnBookList } from '../components/ColumnBookList';
import { BookList } from '../components/BookList';
import { BookContext } from '../context/BookContext';
import { Heading } from '../components/Heading';
import { TextStyles } from '../styles/TextStyles';
import { Svg, Circle } from 'react-native-svg';

export const HomeScreen: React.FC = () => {
  const booksCtx = useContext(BookContext);
  useEffect(booksCtx.fetchBooks, []);
  const newBooks = booksCtx.books
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);
  const allBooks = booksCtx.books;



  const header = ( 
    <View style={{backgroundColor:"red"}}>
      
      <View style={styles.heading}>
        <Svg height="100%" width="100%" viewBox='1 1 1 1'>
          <Circle cx="0.5" cy="-0.3" r="0.8" stroke="blue" fill="blue" />
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
    </View>
  );

  return (
      <ScrollView removeClippedSubviews={false}>
        <ColumnBookList books={allBooks} header={header}/>
      </ScrollView>
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
    //color: '#E89228',
    height: '20%',
    color:"blue"
  }

});
