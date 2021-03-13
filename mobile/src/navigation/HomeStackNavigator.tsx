import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { BookScreen } from '../screens/BookScreen';
import { Book } from '../models/Book';

export type HomeStackParams = {
  Home: undefined;
  Book: { book: Book };
};

const Stack = createStackNavigator<HomeStackParams>();

/**
 * Home tab navigator
 */
export const HomeStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Book"
        component={BookScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
