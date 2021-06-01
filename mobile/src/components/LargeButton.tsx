import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../styles/Colors';
import { TextStyles } from '../styles/TextStyles';

type LargeButtonProps = {text: string, onPress: () => void, underline?: boolean, border?: boolean, disabled?: boolean };

export const LargeButton: React.FC<LargeButtonProps> = ({ text, onPress, underline = false, border = false, disabled = false }) => {
  const [active, setActive] = React.useState(false);

  const buttonStyle = disabled ? styles.disabledButton
    : active ? styles.activeButton
      : border ? styles.borderButton
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
      style={[styles.button, buttonStyle]} >
      <Text style={[TextStyles.heading3, underline && styles.underline, textStyle]}>
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 43,
    width: 298,
    borderWidth: 2,
    borderRadius: 5,
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    marginLeft: 40,
    marginRight: 40,
    marginTop: 15,
    justifyContent: 'center',
  },
  activeButton: {
    borderColor: Colors.white,
    backgroundColor: Colors.white,
  },
  inactiveButton: {
    borderColor: Colors.orange,
    backgroundColor: Colors.orange,
  },
  borderButton: {
    borderColor: Colors.white,
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
  }
});
