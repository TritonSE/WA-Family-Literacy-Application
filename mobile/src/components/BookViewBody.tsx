import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Colors } from '../styles/Colors';

/**
 * Renders book view buttons (read/explore/learn) and body
 */
export const BookViewBody: React.FC = (props) => {
  const [activeButton, setActiveButton] = useState('read');
  const [body, setBody] = useState('Read Body');

  const buttons = [
    {
      key: 'read',
      label: 'Read',
      body: "Read Body",
    },
    {
      key: 'explore',
      label: 'Explore',
      body: "Explore Body",
    },
    {
      key: 'learn',
      label: 'Learn',
      body: "Learn Body",
    },
  ]

  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        {buttons.map(res => {
          return (
            <View key={res.key} >
              <TouchableOpacity
                style={[styles.button, activeButton === res.key ? styles.buttonActive : styles.buttonInactive]}
                onPress={() => {
                  setActiveButton(res.key);
                  setBody(res.body);
                }}>
                <Text style={activeButton === res.key ? styles.buttonTextActive : styles.buttonTextInactive}>
                  {res.label}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      <Text>{body}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    padding: 5,
    margin: 10,
    width: 75,
    borderRadius: 8,
    borderColor: Colors.orange,
    borderWidth: 1.5,
  },

  buttonActive: {
    backgroundColor: Colors.orange,
  },

  buttonTextActive: {
    color: 'white',
  },

  buttonInactive: {
    backgroundColor: "#FFFFFF",
  },

  buttonTextInactive: {
    color: Colors.orange,
  }
});