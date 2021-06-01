import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../styles/Colors';

type CheckboxProps = {
  value: boolean;
  onChange: (value: boolean) => void,
  inverted?: boolean,
};

export const Checkbox: React.FC<CheckboxProps> = ({ value, onChange, inverted = false }) => {
  const boxStyle = inverted ? [styles.box, styles.boxInverted] : styles.box;
  const checkStyle = inverted ? [styles.check, styles.checkInverted] : styles.check;

  return (
    <TouchableOpacity onPress={() => onChange(!value)}>
      <View style={boxStyle}>
        {value && <Image style={checkStyle} source={require('../../assets/images/check-square-solid.png')}/> }
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    height: 24,
    width: 24,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: Colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxInverted: {
    borderColor: Colors.white,
  },
  check: {
    height: 22,
    width: 22,
    tintColor: Colors.orange,
  },
  checkInverted: {
    tintColor: Colors.white,
  },
});
