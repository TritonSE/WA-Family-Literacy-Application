import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Colors } from '../styles/Colors';
import { TextStyles } from '../styles/TextStyles';
import { Language, Languages } from '../models/Languages';

// button labels and callback function for passing key of active button to parent
type LanguageButtonsProps = { langs: Language[], defaultActive: Language, onBtnChange };

const LANGS_PER_ROW = 3;

/**
 * Renders buttons on language selector
 */
export const LanguageButtons: React.FC<LanguageButtonsProps> = ({ langs, defaultActive, onBtnChange }) => {
  const [activeButton, setActiveButton] = useState(defaultActive);
  return (
    <View style={styles.container}>
      {langs.map((lang, idx) => {
        const btnStyle = [
          styles.button,
          activeButton === lang ? styles.buttonActive : styles.buttonInactive,
          (idx % LANGS_PER_ROW) === 0 && styles.leftBtn,
          (idx === langs.length - 1 || (idx % LANGS_PER_ROW === 2)) && styles.rightBtn,
        ];
        const labelStyle = [
          activeButton === lang ? styles.buttonTextActive : styles.buttonTextInactive,
          TextStyles.caption2,
        ];
        return (
          <View key={lang} style={{ width: '33.33%' }}>
            <TouchableOpacity
              style={btnStyle}
              onPress={() => {
                setActiveButton(lang);
                onBtnChange(lang);
              }}
            >
              <Text style={labelStyle}>
                {Languages[lang]}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 252,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    marginBottom: 35,
  },

  button: {
    textAlign: 'center',
    justifyContent: 'center',
    height: 26,
    borderWidth: 1,
    borderColor: Colors.orange,
    marginLeft: -0.5,
    marginRight: -0.5,
    marginBottom: -0.5,
    marginTop: -0.5,
  },

  leftBtn: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },

  rightBtn: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },

  buttonActive: {
    backgroundColor: Colors.orange,
  },

  buttonTextActive: {
    color: Colors.white,
    textAlign: 'center',
  },

  buttonInactive: {
    backgroundColor: Colors.white,
  },

  buttonTextInactive: {
    color: Colors.orange,
    textAlign: 'center',
  },
});
