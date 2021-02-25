import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { BookScreen } from '../screens/BookScreen';

const Stack = createStackNavigator();

/**
 * Home tab navigator
 */
export const HomeStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }} />
      <Stack.Screen
        name="Book"
        component={BookScreen}
        options={{
          headerTransparent: true,
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <Image style={styles.backButton} source={require('../../assets/images/Arrow_left.png')} />
          ),
          headerTitle: '',
        }} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({

  backButton: {
    width: 25,
    height: 25,
    marginLeft: 25,
  },

});
