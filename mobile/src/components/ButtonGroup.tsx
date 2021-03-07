import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Colors } from '../styles/Colors';
import { TextStyles } from '../styles/TextStyles';

// button labels and callback function for passing key of active button to parent
type ButtonGroupProps = { btn1: string, btn2: string, btn3: string, onBtnChange };

/**
 * Renders an inline group of three button tabs
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({ btn1, btn2, btn3, onBtnChange }) => {
  const [activeButton, setActiveButton] = useState('btn-1');
  const buttons = [
    {
      key: 'btn-1',
      label: btn1,
    },
    {
      key: 'btn-2',
      label: btn2,
    },
    {
      key: 'btn-3',
      label: btn3,
    },
  ];

  return (
    <View style={{ flexDirection: 'row' }}>
      {buttons.map(res => {
        return (
          <View key={res.key}>
            <TouchableOpacity
              style={[styles.button, activeButton === res.key ? styles.buttonActive : styles.buttonInactive]}
              onPress={() => {
                setActiveButton(res.key);
                onBtnChange(res.key);
              }}
            >
              <Text style={[activeButton === res.key ? styles.buttonTextActive : styles.buttonTextInactive, TextStyles.caption2]}>
                {res.label}
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
    justifyContent: 'center',
    width: 74,
    height: 26,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.orange,
    shadowColor: 'black',
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
