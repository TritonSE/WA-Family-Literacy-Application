import React, { useState, useContext, useEffect } from 'react';
import { Image, Text, View, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MarkdownView } from 'react-native-markdown-view';
import * as WebBrowser from 'expo-web-browser';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CachedImage from 'react-native-expo-cached-image';
import { useIsFocused } from '@react-navigation/native';

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
import { YoutubeVideo } from '../components/YoutubeVideo';
import { OfflineIndicator } from '../components/OfflineIndicator';
import { AuthContext } from '../context/AuthContext';

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
  const i18n = useContext(I18nContext);
  const insets = useSafeAreaInsets();
  const auth = useContext(AuthContext);

  const locale = i18n.locale;
  const defaultLang = langs.includes(locale) ? locale : langs.includes('en') ? 'en' : langs[0];

  // book screen states
  const [loading, setLoading] = useState(true);
  const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);
  const [language, setLanguage] = useState<Language>(defaultLang);
  const [activeButton, setActiveButton] = useState<Tab>('read');

  // bookmark favorited states
  const [favorited, setFavorited] = useState<boolean | undefined>(undefined);

  // determines if the book screen is unfocused/focused
  const isFocused = useIsFocused();

  const tabContentWidth = 0.83 * width;

  const markdownStyles = {
    heading: TextStyles.mdHeading,
    paragraph: TextStyles.mdRegular,
    strong: TextStyles.mdStrong,
    listItemNumber: TextStyles.listItem,
    listItemBullet: TextStyles.listItem,
    listItemOrderedContent: TextStyles.mdRegular,
    listItemUnorderedContent: TextStyles.mdRegular,
    em: TextStyles.mdEm,
    imageWrapper: { width: tabContentWidth },
    tableHeaderCellContent: { fontWeight: 'normal' },
    del: {},
  };

  // Rerender screen and get updated favorited field for book whenever
  // favorited state or isFocused changes
  // (Ensure that Profile AND Book Screens have synchronised favorites info)
  useEffect(
    () => {
      (async () => {
        try {
          if (auth.user !== null) {
            const res = await client.getBookFavorite(book.id);
            setFavorited(res.favorite);
          }
        } catch (e) {
          console.log(e.message);
        }
      })();
    }, [favorited, isFocused]
  );

  // if book is unfavorited, favorite it
  const favoriteBook = (bookID: string): void => {
    (async () => {
      await client.favoriteBook(bookID);
      setFavorited(true);
    })();
  };

  // if book is favorited, unfavorite it
  const unfavoriteBook = (bookID: string): void => {
    (async () => {
      await client.unfavoriteBook(bookID);
      setFavorited(false);
    })();
  };
  // increments click on book analytics
  // Check in profile screen if data collection is allowed
  useEffect(() => {
    (async () => {
      const allow = await AsyncStorage.getItem("allowAnalytics");
      if (allow) {
        try {
          await client.incrementClicks(book.id);
        } catch (error) {
        }
      }
    })();
  }, []);

  // fetches book details on language change
  useEffect(
    () => {
      (async () => {
        setLoading(true);
        const tuple = `${book.id} ${language}`;
        await client.getBook(book.id, language).then( async (res) => {
          setBookDetails(res);
          await AsyncStorage.setItem(tuple, JSON.stringify(res));
        }).catch(async (err) => {
          const result = await AsyncStorage.getItem(tuple);
          if (result != null) {
            setBookDetails(JSON.parse(result));
          } else {
            console.log(err);
          }
        });
        setLoading(false);
      })();
    },
    [language],
  );


  // Get the tab content (video and body) for the selected tab
  const tabContent = bookDetails !== null && bookDetails[activeButton];

  const tabContentView = tabContent ? (
    <View style={styles.tabContentContainer}>
      {tabContent.video ? (
        <OfflineIndicator>
          <YoutubeVideo
            url={tabContent.video}
            width={tabContentWidth}
            height={(9 / 16) * tabContentWidth}
          />
        </OfflineIndicator>
      ) : null}
      <MarkdownView
        styles={markdownStyles}
        onLinkPress={(url: string) => WebBrowser.openBrowserAsync(url)}
      >
        {tabContent.body}
      </MarkdownView>
    </View>
  ) : null;

  const tabButtons = {
    read: i18n.t('read'),
    explore: i18n.t('explore'),
    learn: i18n.t('learn'),
  };

  // whether the books is favorited or not (solid vs empty bookmark)
  const favoriteIconView =  favorited ? (

    <TouchableOpacity style={styles.bookmarkContainer} onPress={() => {unfavoriteBook(book.id);}}>
      <Image style={styles.bookmarkButton} source={require('../../assets/images/bookmark-solid.png')} />
    </TouchableOpacity>
  )
    :
    (
      <TouchableOpacity style={styles.bookmarkContainer} onPress={() => {favoriteBook(book.id);}}>
        <Image style={styles.bookmarkButton} source={require('../../assets/images/bookmark-regular.png')} />
      </TouchableOpacity>
    );

  return (
    <ScrollView>
      <Pressable style={{ marginTop: insets.top }} onPress={() => navigation.goBack()}><Image style={styles.backButton} source={require('../../assets/images/Arrow_left.png')} /></Pressable>
      <View style={styles.container}>
        <LanguageButtons
          langs={langs}
          defaultActive={language}
          onBtnChange={(lang) => {
            setLanguage(lang);
          }}
        />
        <View style={styles.imgContainer}>
          <CachedImage source={{ uri: book.image }} style={styles.image} />
        </View>

        <View style={styles.titleBookmarkContainer}>

          <View style={favorited !== undefined ? styles.offsetContainer : null} />
          <View style={styles.titleContainer}>
            <Text style={[TextStyles.heading1, styles.title]}>{book.title}</Text>
            <Text style={[TextStyles.body1, styles.author]}>By {book.author}</Text>
          </View>

          { favorited !== undefined ? favoriteIconView : null }

        </View>


        <ButtonGroup
          buttons={tabButtons}
          onButtonChange={(btn) => {
            setActiveButton(btn as Tab);
          }}
        />
        {loading ? <View style={styles.loadingCircle}><LoadingCircle /></View> : tabContentView}
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
  titleBookmarkContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  offsetContainer: {
    height: 35,
    width: 25,
    marginRight: 25,
  },
  bookmarkContainer: {
    marginLeft: 25,
    justifyContent: 'flex-end',
  },
  bookmarkButton: {
    height: 32,
    width: 24,
    tintColor: Colors.orange,
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
