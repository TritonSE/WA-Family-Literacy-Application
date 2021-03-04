import React, { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { MarkdownView } from 'react-native-markdown-view';
import { TextStyles } from '../styles/TextStyles';
import { ButtonGroup } from '../components/ButtonGroup';
import { LanguageButtons } from '../components/LanguageButtons';
import { APIContext } from '../context/APIContext';
import { LoadingCircle } from '../components/LoadingCircle';
import { I18nContext } from '../context/I18nContext';

/**
 * Individual book view displaying book details
 */
export const BookScreen: React.FC = () => {
  // get book id from route params
  const route = useRoute();
  const { id } = route.params;
  const { langs } = route.params;

  const client = useContext(APIContext);
  const i18nCtx = useContext(I18nContext);

  // book screen states
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(i18nCtx.locale.substring(0, 2));
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState('');
  const [tabBody, setTabBody] = useState('');
  const [tabVideo, setTabVideo] = useState('');
  const [activeButton, setActiveButton] = useState('btn-1');
  const [tabContent, setTabContent] = useState(null);

  // fetches book details
  useEffect(
    () => {
      setLoading(true);
      let lang;

      if (langs.indexOf(language) > -1) {
        lang = language;
      } else if (langs.indexOf('en') > -1) {
        lang = 'en';
      } else {
        lang = langs[0];
      }

      client.getBook(id, lang).then((res) => {
        setTitle(res.title);
        setAuthor(res.author);
        setImage(res.image);
        setTabContent({
          'btn-1': res.read,
          'btn-2': res.explore,
          'btn-3': res.learn,
        });
        setLoading(false);
      }).catch((err) => {
        console.log(err);
      });
    },
    [language],
  );

  // sets tab content
  useEffect(
    () => {
      if (tabContent) {
        setTabBody(tabContent[activeButton].body);
        setTabVideo(tabContent[activeButton].video);
      }
    },
    [activeButton, tabContent],
  );

  return (
    loading ? <View style={styles.loadingCircle}><LoadingCircle /></View> :
      (
        <ScrollView>
          <View style={styles.container}>
            {langs.length > 1 && (
            <LanguageButtons
              langs={langs}
              defaultActive={language}
              onBtnChange={(lang) => {
                setLanguage(lang);
              }}
            />
            )}

            <View style={styles.imgContainer}>
              <Image source={{ uri: image }} style={styles.image} />
            </View>
            <Text style={[TextStyles.h1, styles.title]}>{title}</Text>
            <Text style={[TextStyles.body1, styles.author]}>By {author}</Text>
            <ButtonGroup
              btn1="Read"
              btn2="Explore"
              btn3="Learn"
              onBtnChange={(btn) => {
                setActiveButton(btn);
              }}
            />
            <View style={{ marginLeft: 30, marginRight: 30, marginBottom: 10 }}>
              <Text>{tabVideo}</Text>
              <MarkdownView styles={{ text: { fontFamily: 'Gotham-Light' } }}>
                {tabBody}
              </MarkdownView>
            </View>
          </View>
        </ScrollView>
      )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  loadingCircle: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 253,
    height: 223,
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
    marginBottom: 40,
  },

});
