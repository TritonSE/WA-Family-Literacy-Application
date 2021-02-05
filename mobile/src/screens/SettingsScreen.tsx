import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

/**
 * Right tab on navbar for settings menu
 */
export const SettingsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Settings</Text>
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
