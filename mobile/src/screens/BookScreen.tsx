import React, { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, Image, Pressable, ScrollView, Dimensions } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MarkdownView } from 'react-native-markdown-view';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { YoutubeVideo } from '../components/YoutubeVideo';

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

  const locale = i18n.locale;
  const defaultLang = langs.includes(locale) ? locale : langs.includes('en') ? 'en' : langs[0];

  // book screen states
  const [loading, setLoading] = useState(true);
  const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);
  const [language, setLanguage] = useState<Language>(defaultLang);
  const [activeButton, setActiveButton] = useState<Tab>('read');

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

  // fetches book details on language change
  useEffect(
    () => {
      (async () => {
        setLoading(true);
        const tuple = book.id + " " + language;
        await client.getBook(book.id, language).then( async (res) => {
          setBookDetails(res);
          console.log("caching now");
          await AsyncStorage.setItem(tuple, JSON.stringify(res));
        }).catch(async (err) => {
          console.log("hello");
          const result = await AsyncStorage.getItem(tuple);
          if (result != null) {
            console.log("no internet but book in cache");
            setBookDetails(JSON.parse(result));
          } else {
            console.log("hi");
            console.log(err);
          }
        }); 
        setLoading(false);
      })();
    },
    [language],
  );

  /*
  client.getBooks().then(async (res) => {
      dispatch({ type: 'BOOKS_RETURNED', payload: res });
      // cache response in async
      await AsyncStorage.setItem('books', JSON.stringify(res));
    }).catch(async (err) => {
      const result = await AsyncStorage.getItem('books');
      if (result != null) {
        // we aren't connected but have the result cached
        // somehow return the result
        dispatch({ type: 'BOOKS_RETURNED', payload: JSON.parse(result) });
        
      } else {
        // error case 
        state.error = true;
        console.log(err);
      }
      
    */

  // Get the tab content (video and body) for the selected tab
  const tabContent = bookDetails !== null && bookDetails[activeButton];

  const tabContentView = tabContent && (
    <View style={styles.tabContentContainer}>
      {tabContent.video && <YoutubeVideo url={tabContent.video} width={tabContentWidth} height={9 / 16 * tabContentWidth}/>}
      <MarkdownView styles={markdownStyles} onLinkPress={(url: string) => WebBrowser.openBrowserAsync(url)}>
        {tabContent.body}
      </MarkdownView>
    </View>
  );

  const tabButtons = {
    read: i18n.t('read'),
    explore: i18n.t('explore'),
    learn: i18n.t('learn'),
  };

  return (
    <ScrollView>
      <Pressable style={{ marginTop: insets.top }} onPress={() => navigation.goBack()}><Image style={styles.backButton} source={require('../../assets/images/Arrow_left.png')}/></Pressable>
      <View style={styles.container}>
        <LanguageButtons
          langs={langs}
          defaultActive={language}
          onBtnChange={(lang) => {
            setLanguage(lang);
          }}
        />
        <View style={styles.imgContainer}>
          <Image source={{ uri: book.image }} style={styles.image}/>
        </View>
        <Text style={[TextStyles.heading1, styles.title]}>{book.title}</Text>
        <Text style={[TextStyles.body1, styles.author]}>By {book.author}</Text>
        <ButtonGroup
          buttons={tabButtons}
          onButtonChange={(btn) => {
            setActiveButton(btn as Tab);
          }}
        />
        {loading ? <View style={styles.loadingCircle}><LoadingCircle/></View> : tabContentView}
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
