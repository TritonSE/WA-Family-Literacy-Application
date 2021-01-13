import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen() {
  return(
    <View>
      <Text>Home</Text>
    </View>
  );
}

function ChatScreen() {
  return(
    <View>
      <Text>Chat</Text>
    </View>
  );
}

function Settings() {
  return(
    <View>
      <Text>Settings</Text>
    </View>
  );
}

const Stack = createStackNavigator();


const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Chat" component={ChatScreen}/>
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="Settings" component={Settings}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// eslint-disable-next-line import/no-default-export
export default App;
