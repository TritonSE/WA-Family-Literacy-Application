import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

import { Colors } from '../styles/Colors';
import { TextStyles } from '../styles/TextStyles';

type SmallButtonProps = { text: string, onPress: () => void, underline?: boolean, disabled?: boolean };
export const SmallButton: React.FC<SmallButtonProps> = ({ text, onPress, underline = false, disabled = false }) => {
  const [active, setActive] = React.useState(false);

  const buttonStyle = disabled ? styles.disabledButton
    : active ? styles.activeButton
      : styles.inactiveButton;
  const textStyle = disabled ? styles.disabledText
    : active ? styles.activeText
      : styles.inactiveText;

  return (
    <Pressable
      onPressIn={() => setActive(true)}
      onPressOut={
        () => {
          onPress();
          setActive(false);
        }
      }
      disabled={disabled}
      style={[styles.button, buttonStyle]}>
      <Text style={[TextStyles.caption2, underline && styles.underline, textStyle]}>
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 35,
    width: 90,
    borderWidth: 2,
    borderRadius: 5,
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    justifyContent: 'center',
  },
  activeButton: {
    borderColor: Colors.orange,
    backgroundColor: Colors.white,
  },
  inactiveButton: {
    borderColor: Colors.orange,
    backgroundColor: Colors.orange,
  },
  disabledButton: {
    borderColor: Colors.gray,
    backgroundColor: Colors.orange,
  },
  activeText: {
    textAlign: 'center',
    color: Colors.orange,
  },
  inactiveText: {
    textAlign: 'center',
    color: Colors.white,
  },
  disabledText: {
    textAlign: 'center',
    color: Colors.gray,
  },
  underline: {
    textDecorationLine: 'underline',
  },
});
