import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { WelcomeScreen } from '../screens/login/WelcomeScreen';
import { LoginScreen } from '../screens/login/LoginScreen';
import { SignUpScreen } from '../screens/login/SignUpScreen';
import { View } from 'react-native';
import { Colors } from '../styles/Colors';

const Stack = createStackNavigator();

export const AuthNavigator: React.FC = () => {
  return (
    <View style={{
      flex: 1,
      backgroundColor: Colors.orange,
    }}>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen}/>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="SignUp" component={SignUpScreen}/>
      </Stack.Navigator>
    </View>
  );
};
