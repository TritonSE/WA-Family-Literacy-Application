import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Colors } from '../styles/Colors';
import { TextStyles } from '../styles/TextStyles';
import { Languages } from '../models/Languages';

// button labels and callback function for passing key of active button to parent
type LanguageButtonsProps = { langs: string[], defaultActive: string, onBtnChange };

/**
 * Renders buttons on language selector
 */
export const LanguageButtons: React.FC<LanguageButtonsProps> = ({ langs, defaultActive, onBtnChange }) => {
  const [activeButton, setActiveButton] = useState(defaultActive);

  return (
    <View style={styles.container}>
      {langs.map((res, idx) => {
        return (
          <View key={res} style={{ width: '33.33%' }}>
            <TouchableOpacity
              style={[styles.button,
                activeButton === res ? styles.buttonActive : styles.buttonInactive,
                (idx % 3) === 0 && styles.leftBtn,
                (idx === langs.length - 1 || (idx % 3 === 2)) && styles.rightBtn,
              ]}
              onPress={() => {
                setActiveButton(res);
                onBtnChange(res);
              }}
            >
              <Text style={[activeButton === res ? styles.buttonTextActive : styles.buttonTextInactive, TextStyles.caption2]}>
                {Languages[res]}
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
    color: 'white',
    textAlign: 'center',
  },

  buttonInactive: {
    backgroundColor: '#FFFFFF',
  },

  buttonTextInactive: {
    color: Colors.orange,
    textAlign: 'center',
  },
});
