import React, { useState, useContext } from 'react';
import { Text, StyleSheet, View, Pressable } from 'react-native';
import { Colors } from '../styles/Colors';
import { TextStyles } from '../styles/TextStyles';
import { I18nContext } from '../context/I18nContext';

// button labels and callback function for passing key of active button to parent
type ButtonGroupProps = { btn1: string, btn2: string, btn3: string, onBtnChange: (key: string) => void };

/**
 * Renders an inline group of three button tabs
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({ btn1, btn2, btn3, onBtnChange }) => {
  const i18nCtx = useContext(I18nContext);

  const buttons = [
    {
      key: btn1,
      label: i18nCtx.t(btn1),
    },
    {
      key: btn2,
      label: i18nCtx.t(btn2),
    },
    {
      key: btn3,
      label: i18nCtx.t(btn3),
    },
  ];

  const [activeButton, setActiveButton] = useState(buttons[0].key);

  return (
    <View style={{ flexDirection: 'row' }}>
      {buttons.map(res => {
        return (
          <View key={res.key}>
            <Pressable
              style={[styles.button, activeButton === res.key ? styles.buttonActive : styles.buttonInactive]}
              onPress={() => {
                setActiveButton(res.key);
                onBtnChange(res.key);
              }}
            >
              <Text style={[activeButton === res.key ? styles.buttonTextActive : styles.buttonTextInactive, TextStyles.caption2]}>
                {res.label}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    width: 74,
    height: 26,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.orange,
    shadowColor: Colors.shadowColor,
    shadowOpacity: 0.16,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 35,
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
