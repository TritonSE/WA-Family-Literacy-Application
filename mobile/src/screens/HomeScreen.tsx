import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

/**
 * Middle tab on navbar for homescreen displaying books
 */
export const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
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
