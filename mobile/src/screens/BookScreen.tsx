import React, { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { MarkdownView } from 'react-native-markdown-view';
import YoutubePlayer from 'react-native-youtube-iframe';
import { BookScreenRouteProps } from '../navigation/HomeStackNavigator';
import { LoadingCircle } from '../components/LoadingCircle';
import { APIContext } from '../context/APIContext';
import { I18nContext } from '../context/I18nContext';
import { TextStyles } from '../styles/TextStyles';
import { ButtonGroup } from '../components/ButtonGroup';
import { LanguageButtons } from '../components/LanguageButtons';
import { Colors } from '../styles/Colors';

/**
 * Individual book view displaying book details
 */
export const BookScreen: React.FC = () => {
  // get book id and langs from route params
  const route = useRoute<BookScreenRouteProps>();
  const { book } = route.params;
  const langs = book.languages;

  const client = useContext(APIContext);
  const i18nCtx = useContext(I18nContext);

  const locale = i18nCtx.locale.substring(0, 2);
  const defaultLang = langs.includes(locale) ? locale : langs.includes('en') ? 'en' : langs[0];

  const videoIdRegEx = '^(?:https?:)?//[^/]*(?:youtube(?:-nocookie)?.com|youtu.be).*[=/]([-\\w]{11})(?:\\?|=|&|$)';

  // book screen states
  const [loading, setLoading] = useState(true);
  const [bookDetails, setBookDetails] = useState(null);
  const [language, setLanguage] = useState(defaultLang);
  const [activeButton, setActiveButton] = useState('read');

  const markdownStyles = {
    heading: TextStyles.mdRegular,
    paragraph: TextStyles.mdRegular,
    strong: TextStyles.mdStrong,
    listItemNumber: TextStyles.mdRegular,
    listItemOrderedContent: TextStyles.mdRegular,
    listItemUnorderedContent: TextStyles.mdRegular,
    tableHeaderCellContent: TextStyles.mdRegular,
    em: TextStyles.mdEm,
  };

  // fetches book details on language change
  useEffect(
    () => {
      (async () => {
        setLoading(true);
        const res = await client.getBook(book.id, language);
        setBookDetails(res);
        setLoading(false);
      })();
    },
    [language],
  );

  return (
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
          <Image source={{ uri: book.image }} style={styles.image} />
        </View>
        <Text style={[TextStyles.h1, styles.title]}>{book.title}</Text>
        <Text style={[TextStyles.body1, styles.author]}>By {book.author}</Text>
        <ButtonGroup
          btn1={['read', 'Read']}
          btn2={['explore', 'Explore']}
          btn3={['learn', 'Learn']}
          onBtnChange={(btn) => {
            setActiveButton(btn);
          }}
        />
        {loading ? <View style={styles.loadingCircle}><LoadingCircle /></View> : (
          <View style={styles.tabContentContainer}>
            {bookDetails[activeButton].video && (
              <View style={styles.video}>
                <YoutubePlayer
                  height={180}
                  width={320}
                  videoId={bookDetails[activeButton].video.match(videoIdRegEx)[1]}
                />
              </View>
            )}
            <MarkdownView styles={markdownStyles}>
              {bookDetails[activeButton].body}
            </MarkdownView>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
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
    shadowColor: Colors.shadowColor,
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
