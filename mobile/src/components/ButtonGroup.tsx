import React, { useState } from 'react';
import { Text, StyleSheet, View, Pressable } from 'react-native';
import { Colors } from '../styles/Colors';
import { TextStyles } from '../styles/TextStyles';

// button labels and callback function for passing key of active button to parent
type ButtonGroupProps = { buttons: { [key: string]: string }, onButtonChange: (key: string) => void };

/**
 * Renders an inline group of three button tabs
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({ buttons, onButtonChange }) => {
  const [activeButton, setActiveButton] = useState(Object.keys(buttons)[0]);

  return (
    <View style={{ flexDirection: 'row' }}>
      {Object.entries(buttons).map(([key, label]) => {
        return (
          <View key={key}>
            <Pressable
              style={[styles.button, activeButton === key ? styles.buttonActive : styles.buttonInactive]}
              onPress={() => {
                setActiveButton(key);
                onButtonChange(key);
              }}
            >
              <Text style={[TextStyles.caption2, activeButton === key ? styles.buttonTextActive : styles.buttonTextInactive]}>
                {label}
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
