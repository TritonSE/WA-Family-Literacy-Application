import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Keyboard, Dimensions, Image, Pressable, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Language, Languages } from '../models/Languages';
import { TextStyles } from '../styles/TextStyles';
import { Colors } from '../styles/Colors';

const { width } = Dimensions.get('window');

// ISO 639-1 2-letter language codes (from the Languages file) and the number of languages
const languages = Object.keys(Languages) as Language[];

type BookFilterProps = { onFilter: (text: string, langs: Language[]) => void };

/**
 * Component that renders a search bar for the user to find books by title or author.
 */
export const BookFilter: React.FC<BookFilterProps> = ({ onFilter }) => {
  // the search term, the language dropdown's visibility, and the set of selected languages
  const [search, setSearch] = useState('');
  const [dropdownVisible, setDropDownVisible] = useState(false);
  const [langs, setLangs] = useState(new Set<Language>(['en']));

  // toggles the languages in the language dropdown and re-filters the books
  const toggleLang = (lang: Language): void => {
    const newLangs = new Set<Language>(langs);
    if (langs.has(lang)) {
      newLangs.delete(lang);
    } else {
      newLangs.add(lang);
    }

    setLangs(newLangs);
    onFilter(search, Array.from(newLangs));
  };

  // re-filters the books when the search term is changed
  const searchBooks = (text: string): void => {
    setSearch(text);
    onFilter(text, Array.from(langs));
  };

  // the language dropdown component
  const dropdown = (

    <View style={styles.dropdown}>

      {languages.map((lang: Language) => (
        <TouchableOpacity
          key={lang}
          onPress={() => toggleLang(lang)}
        >

          <View style={styles.nameBoxContainer}>

            <Text style={{ ...TextStyles.caption4, alignSelf: 'center' }}>{Languages[lang]}</Text>

            <View style={styles.box}>
              {langs.has(lang) ?
                <Image style={styles.boxChecked} source={require('../../assets/images/check-square-solid.png')}/>
                :
                null}
            </View>

          </View>

        </TouchableOpacity>
      ))}

    </View>

  );

  return (

    <View style={styles.filters}>

      <TouchableOpacity
        onPress={() => setDropDownVisible(!dropdownVisible)}
        style={styles.button}
      >
        <View style={styles.iconContainer}>
          <Image style={styles.hamburgerIcon} source={require('../../assets/images/bars-solid.png')}/>
        </View>
      </TouchableOpacity>

      {dropdownVisible && dropdown}

      <View style={styles.searchBarContainer}>

        <TextInput
          value={search}
          onChangeText={text => searchBooks(text)}
          placeholder="Search for a title or author"
          onBlur={Keyboard.dismiss}
          clearButtonMode="always"
          style={styles.searchBar}
        />

        <View style={styles.imageContainer}>
          <Image style={styles.image} source={require('../../assets/images/search-solid.png')}/>
        </View>

      </View>

    </View>

  );
};

const styles = StyleSheet.create({
  filters: {
    zIndex: 1,
    marginHorizontal: 17,
    flexDirection: 'row',
  },
  button: {
    height: 40,
    width: 40,
    marginRight: 10,
  },
  iconContainer: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburgerIcon: {
    height: 30,
    width: 30,
    tintColor: Colors.orange,
  },
  dropdown: {
    position: 'absolute',
    marginTop: 44,
    paddingTop: 8,
    paddingBottom: 6,
    paddingHorizontal: 5,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 5,
    borderColor: Colors.orange,
    shadowColor: 'black',
    shadowRadius: 2,
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 3 },
  },
  nameBoxContainer: {
    flexDirection: 'row',
    marginBottom: 2,
    justifyContent: 'space-between',
  },
  box: {
    height: 24,
    width: 24,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: Colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxChecked: {
    height: 22,
    width: 22,
    tintColor: Colors.orange,
  },
  searchBarContainer: {
    flexDirection: 'row',
    width: width - 84,
    borderColor: Colors.orange,
    height: 40,
    borderWidth: 2,
    borderRadius: 5,
    shadowColor: Colors.shadowColor,
    shadowRadius: 2,
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 3 },
  },
  searchBar: {
    height: 36,
    width: width - 134,
    paddingLeft: 10,
    ...TextStyles.caption3,
  },
  imageContainer: {
    backgroundColor: Colors.orange,
    height: 36,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.orange,
    borderWidth: 2,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
  },
  image: {
    height: 20,
    width: 20,
    tintColor: Colors.white,
  },
});
