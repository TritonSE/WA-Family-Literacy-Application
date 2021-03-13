import React, { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MarkdownView } from 'react-native-markdown-view';
import YoutubePlayer from 'react-native-youtube-iframe';
import * as WebBrowser from 'expo-web-browser';
import { HomeStackParams } from '../navigation/HomeStackNavigator';
import { LoadingCircle } from '../components/LoadingCircle';
import { APIContext } from '../context/APIContext';
import { I18nContext } from '../context/I18nContext';
import { TextStyles } from '../styles/TextStyles';
import { ButtonGroup } from '../components/ButtonGroup';
import { LanguageButtons } from '../components/LanguageButtons';
import { Colors } from '../styles/Colors';
import { BookDetails } from '../models/Book';
import { Language } from '../models/Languages';

type BookScreenProps = StackScreenProps<HomeStackParams, 'Book'>;

type Tab = 'read' | 'explore' | 'learn';

const { width } = Dimensions.get('screen');

/**
 * Individual book view displaying book details
 */
export const BookScreen: React.FC<BookScreenProps> = ({ route, navigation }) => {
  // get book id and langs from route params
  const { book } = route.params;
  const langs = book.languages;

  const client = useContext(APIContext);
  const i18nCtx = useContext(I18nContext);
  const insets = useSafeAreaInsets();

  const locale = i18nCtx.locale.substring(0, 2);
  const defaultLang = langs.includes(locale) ? locale : langs.includes('en') ? 'en' : langs[0];

  const videoIdRegEx = '^(?:https?:)?//[^/]*(?:youtube(?:-nocookie)?.com|youtu.be).*[=/]([-\\w]{11})(?:\\?|=|&|$)';

  // book screen states
  const [loading, setLoading] = useState(true);
  const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);
  const [language, setLanguage] = useState<Language>(defaultLang);
  const [activeButton, setActiveButton] = useState<Tab>('read');

  const tabContentWidth = 0.83 * width;

  const markdownStyles = {
    heading: TextStyles.mdRegular,
    paragraph: TextStyles.mdRegular,
    strong: TextStyles.mdStrong,
    listItemNumber: TextStyles.listItem,
    listItemBullet: TextStyles.listItem,
    listItemOrderedContent: TextStyles.mdRegular,
    listItemUnorderedContent: TextStyles.mdRegular,
    tableHeaderCellContent: TextStyles.mdRegular,
    em: TextStyles.mdEm,
    imageWrapper: { width: tabContentWidth },
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

  const handleMarkdownLink = async (url: string): Promise<any> => {
    const response = await WebBrowser.openBrowserAsync(url);
    return response;
  };

  return (
    <ScrollView>
      <TouchableOpacity style={{ marginTop: insets.top }} onPress={() => navigation.goBack()}><Image style={styles.backButton} source={require('../../assets/images/Arrow_left.png')} /></TouchableOpacity>
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
          btn1="read"
          btn2="explore"
          btn3="learn"
          onBtnChange={(btn) => {
            setActiveButton(btn);
          }}
        />
        {loading ? <View style={styles.loadingCircle}><LoadingCircle /></View> : (
          <View style={styles.tabContentContainer}>
            {bookDetails[activeButton].video && (
              <View style={styles.video}>
                <YoutubePlayer
                  height={9 / 16 * tabContentWidth}
                  width={tabContentWidth}
                  videoId={bookDetails[activeButton].video.match(videoIdRegEx)[1]}
                />
              </View>
            )}
            <MarkdownView styles={markdownStyles} onLinkPress={handleMarkdownLink}>
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
    marginTop: 15,
  },
  tabContentContainer: {
    width: '100%',
    paddingLeft: 30,
    paddingRight: 30,
    marginBottom: 10,
  },
  loadingCircle: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  backButton: {
    width: 25,
    height: 25,
    marginLeft: 25,
    marginTop: 10,
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
    width: '100%',
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    paddingTop: 35,
  },
  author: {
    paddingTop: 7,
    marginBottom: 40,
  },

});
