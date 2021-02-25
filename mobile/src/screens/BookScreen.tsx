import React, { useState, useContext } from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
// import { MarkdownView } from 'react-native-markdown-view';
import { TextStyles } from '../styles/TextStyles';
import { ButtonGroup } from '../components/ButtonGroup';
import { APIContext } from '../context/APIContext';

/**
 * Individual book view displaying book details
 */
export const BookScreen: React.FC = () => {
  const route = useRoute();
  const id = route.params.id;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState('');
  const [activeButton, setActiveButton] = useState('btn-1');

  const body = {
    'btn-1': 'READ BODY',
    'btn-2': 'EXPLORE BODY',
    'btn-3': "LEARN BODY",
  };

  const client = useContext(APIContext);
  client.getBook(id).then((res) => {
    setTitle(res.title);
    setAuthor(res.author);
    setImage(res.image);
  }).catch((err) => {
    console.log(err);
  });

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.imgContainer}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
        <Text style={[TextStyles.h1, styles.title]}>{title}</Text>
        <Text style={[TextStyles.body1, styles.author]}>By {author}</Text>
        <ButtonGroup btn1='Read' btn2='Explore' btn3='Learn' onBtnChange={(btn) => { setActiveButton(btn) }} />
        {body[activeButton]}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  image: {
    width: 253,
    height: 253,
    borderRadius: 5,
  },
  imgContainer: {
    shadowColor: 'black',
    shadowRadius: 20,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 3 },
  },
  title: {
    paddingTop: 35,
  },
  author: {
    paddingTop: 7,
    paddingBottom: 25,
  },

});
