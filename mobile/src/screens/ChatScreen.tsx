import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

/**
 * Left tab on navbar for chatting with volunteers
 */
export const ChatScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Chat</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
