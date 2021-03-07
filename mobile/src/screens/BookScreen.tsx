import React, { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { MarkdownView } from 'react-native-markdown-view';
import YoutubePlayer from 'react-native-youtube-iframe';
import { LoadingCircle } from '../components/LoadingCircle';
import { APIContext } from '../context/APIContext';
import { I18nContext } from '../context/I18nContext';
import { TextStyles } from '../styles/TextStyles';
import { ButtonGroup } from '../components/ButtonGroup';
import { LanguageButtons } from '../components/LanguageButtons';

/**
 * Individual book view displaying book details
 */
export const BookScreen: React.FC = () => {
  // get book id and langs from route params
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
  const [activeButton, setActiveButton] = useState('');
  const [tabContent, setTabContent] = useState(null);

  const markdownStyles = {
    heading: { fontFamily: 'Gotham-Light' },
    paragraph: { fontFamily: 'Gotham-Light' },
    strong: { fontFamily: 'Gotham-Bold' },
    listItemNumber: { fontFamily: 'Gotham-Light' },
    listItemOrderedContent: { fontFamily: 'Gotham-Light' },
    listItemUnorderedContent: { fontFamily: 'Gotham-Light' },
    tableHeaderCellContent: { fontFamily: 'Gotham-Light' },
    em: { fontFamily: 'Gotham-Italic' },
  };

  // fetches book details on language change
  useEffect(
    () => {
      setLoading(true);
      let lang;

      if (langs.indexOf(language) > -1) {
        lang = language;
      } else if (langs.indexOf('en') > -1) {
        lang = 'en';
        setLanguage(lang);
      } else {
        const [first] = langs;
        lang = first;
        setLanguage(lang);
      }

      client.getBook(id, lang).then((res) => {
        setTitle(res.title);
        setAuthor(res.author);
        setImage(res.image);
        setActiveButton('btn-1');
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

  // sets tab content on tab button change
  useEffect(
    () => {
      if (tabContent) {
        setTabVideo(null);
        if (tabContent[activeButton].video) {
          const regEx = '^(?:https?:)?//[^/]*(?:youtube(?:-nocookie)?.com|youtu.be).*[=/]([-\\w]{11})(?:\\?|=|&|$)';
          const matches = tabContent[activeButton].video.match(regEx);
          if (matches) {
            setTabVideo(matches[1]);
          }
        }
        setTabBody(tabContent[activeButton].body);
      }
    },
    [activeButton, tabContent],
  );

  return (
    loading ? <View style={styles.loadingCircle}><LoadingCircle /></View> :
      (
        <ScrollView>
          <View style={styles.container}>
            <LanguageButtons
              langs={langs}
              defaultActive={language}
              onBtnChange={(lang) => {
                setLanguage(lang);
              }}
            />
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
            <View style={styles.tabContentContainer}>
              {tabVideo && (
              <View style={styles.video}>
                <YoutubePlayer
                  height={180}
                  width={320}
                  videoId={tabVideo}
                />
              </View>
              )}
              <MarkdownView styles={markdownStyles}>
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
    paddingTop: 70,
  },
  tabContentContainer: {
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 10,
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
  video: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    paddingTop: 35,
  },
  author: {
    paddingTop: 7,
    marginBottom: 40,
  },

});
