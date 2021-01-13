import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return(
    <View>
      <Text>Home</Text>
    </View>
  );
}

function ChatScreen({ navigation }) {
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
    // <View style={styles.navbarContainer}>
      <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"

        tabBarOptions={{
          activeTintColor: '#B8B8B8',
          activeBackgroundColor: '#E89228',
          // tabStyle: styles.navbarContainer,
          style: styles.navbarContainer,
          // activeTintColor: styles.activeColor
        }}
      >
        <Tab.Screen name="Chat" component={ChatScreen}/>
        <Tab.Screen name="Home" component={HomeScreen}/>
        <Tab.Screen name="Settings" component={Settings}/>
      </Tab.Navigator>
    </NavigationContainer>
    // </View>
  );
};

const styles = StyleSheet.create({
  activeColor: {
    backgroundColor: '#E89228',
    opacity: 0.2,
    cornerRadius: 5, 
    // width: '50%',
    textAlign: 'center'
  }, 

  navbarContainer : {
    width: '75%',
    alignContent: 'center',
    marginLeft: 0,
    marginRight: 0,
  }

  ,container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// eslint-disable-next-line import/no-default-export
export default App;
