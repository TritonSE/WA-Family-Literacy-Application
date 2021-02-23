import React from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { MarkdownView } from 'react-native-markdown-view'
import { TextStyles } from '../styles/TextStyles';
import { BookViewBody } from '../components/BookViewBody';

/**
 * Left tab on navbar for chatting with volunteers
 */
export const BookScreen: React.FC = () => {
  const route = useRoute();
  const id = route.params.id;

  const title = 'Title';
  const author = 'Author';
  const image = 'https://placekitten.com/200/300';

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>Individual Book View</Text>
        <Text>Book Id: {id}</Text>
        <View style={styles.imgContainer}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
        <Text style={[TextStyles.h1, styles.title]}>{title}</Text>
        <Text style={styles.author}>By {author}</Text>
        <BookViewBody />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  image: {
    width: 265,
    height: 265,
    borderRadius: 5,
  },
  imgContainer: {
    shadowColor: 'black',
    shadowRadius: 7,
    shadowOpacity: 0.4,
    shadowOffset: { width: 2, height: 3 },
  },
  title: {
    paddingTop: 35,
  },
  author: {
    paddingTop: 7,
    paddingBottom: 25,
  }

});