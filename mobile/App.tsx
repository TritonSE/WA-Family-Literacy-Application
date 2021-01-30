import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

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

const App: React.FC = () => {
  return (
    <NavigationContainer>
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let icon;
          let tint = focused ? '#E89228' : '#B8B8B8';
          let width;
          let height;

          if (route.name === 'Home') {
            icon = require('./assets/images/Home.png');
            width = 29;
            height = 23.5;
          } else if (route.name === 'Settings') {
            icon = require('./assets/images/Cog.png');
            width = 26;
            height = 26;
          }
          else if (route.name === 'Chat') {
            icon = require('./assets/images/Chat_bubble.png');
            width = 22;
            height = 22;
          }

          return <Image style={{width:width, height:height, tintColor: tint}} source={icon} />;
        }
      })}
      tabBarOptions={{
        showLabel: false,
        activeBackgroundColor: '#f9ead3',
        style: styles.navbarContainer,
        tabStyle: styles.tab,
      }}
    >
      <Tab.Screen name="Chat" component={ChatScreen}/>
      <Tab.Screen name="Home" component={HomeScreen}/>
      <Tab.Screen name="Settings" component={Settings}/>
    </Tab.Navigator>
  </NavigationContainer>
  );
};

const styles = StyleSheet.create({

  navbarContainer : {
    backgroundColor: '#FFFFFF',
          height: 60,
          padding: 4.5,
          paddingLeft: 50,
          paddingRight: 50,
          shadowColor: 'black'
  },

  tab : {
    //justifyContent: 'center',
    alignItems: 'center',
    //margin: 5,
    alignContent: 'center',
    width: 89,
    height: 51,
    borderRadius: 5
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// eslint-disable-next-line import/no-default-export
export default App;
