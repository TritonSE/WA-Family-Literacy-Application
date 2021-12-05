import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { BookScreen } from '../screens/BookScreen';
import { Book } from '../models/Book';
import { ProfileScreen } from '../screens/ProfileScreen';

export type ProfileStackParams = {
  Profile: undefined;
  Book: { book: Book };
};

const Stack = createStackNavigator<ProfileStackParams>();

/**
 * Home tab navigator
 */
export const ProfileNavigator: React.FC = () => {
    
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName="Profile"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: 'white' },
        }}
      >
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Book" component={BookScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </View>
  );
};
