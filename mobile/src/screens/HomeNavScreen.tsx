import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './HomeScreen';
import { BookScreen } from './BookScreen';

const Stack = createStackNavigator();

/**
 * Home tab navigator
 */
export const HomeNavScreen: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{
        headerShown: false,
      }} />
      <Stack.Screen name="Book" component={BookScreen} options={{
        headerTransparent: true,
        headerBackTitleVisible: false,
        headerBackImage: () => (
           <Image style={{width: 25, height: 25, marginLeft: 25}} source={require('../../assets/images/Arrow_left.png')} />
        ),
        headerTitle: "",
      }} />
    </Stack.Navigator>

  );
};

