import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Colors } from '../styles/Colors';
import { TextStyles } from '../styles/TextStyles';

// button labels and callback function for passing key of active button to parent
type LanguageButtonsProps = { langs: string[], defaultActive: string, onBtnChange };

/**
 * Renders an inline group of three button tabs
 */
export const LanguageButtons: React.FC<LanguageButtonsProps> = ({ langs, defaultActive, onBtnChange }) => {
  const [activeButton, setActiveButton] = useState(defaultActive);

  return (
    <View style={{ flexDirection: 'row' }}>
      {langs.map((res, idx) => {
        return (
          <View key={idx}>
            <TouchableOpacity
              style={[styles.button,
                activeButton === res ? styles.buttonActive : styles.buttonInactive,
                idx === 0 && styles.leftBtn,
                idx === langs.length - 1 && styles.rightBtn,
              ]}
              onPress={() => {
                setActiveButton(res);
                onBtnChange(res);
              }}
            >
              <Text style={[activeButton === res ? styles.buttonTextActive : styles.buttonTextInactive, TextStyles.caption2]}>
                {res}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    textAlign: 'center',
    justifyContent: 'center',
    width: 72,
    height: 26,
    borderWidth: 1,
    borderColor: Colors.orange,
    marginLeft: -0.5,
    marginRight: -0.5,
    marginBottom: 35,
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
  },

  buttonInactive: {
    backgroundColor: '#FFFFFF',
  },

  buttonTextInactive: {
    color: Colors.orange,
  },
});
