import React from 'react';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from './src/screens/HomeScreen';
import { BookProvider } from './src/context/BookContext';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { ChatScreen } from './src/screens/ChatScreen';

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    'Gotham-Bold': require('./assets/fonts/gotham-rounded/GothamRounded-Bold.otf'),
    'Gotham-Medium': require('./assets/fonts/gotham-rounded/GothamRounded-Medium.otf'),
  });

  if (!fontsLoaded) {
    return <AppLoading/>;
  }
  return (
    <BookProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color }) => {
              const TabIcons = {
                Home: <Image style={[styles.homeIcon, { tintColor: color }]} source={require('./assets/images/Home.png')} />,
                Chat: <Image style={[styles.chatIcon, { tintColor: color }]} source={require('./assets/images/Chat_bubble.png')} />,
                Settings: <Image style={[styles.settingsIcon, { tintColor: color }]} source={require('./assets/images/Cog.png')} />,
              };

              return TabIcons[route.name];
            },
          })}
          tabBarOptions={{
            showLabel: false,
            activeBackgroundColor: '#F9EAD3',
            activeTintColor: '#E89228',
            inactiveTintColor: '#B8B8B8',
            style: styles.navbarContainer,
            tabStyle: styles.tab,
          }}
        >
          <Tab.Screen name="Chat" component={ChatScreen} />
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </BookProvider>
  );
};

const styles = StyleSheet.create({

  navbarContainer: {
    height: 60,
    padding: 4.5,
    paddingLeft: 47,
    paddingRight: 47,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.16,
    shadowRadius: 6,
    shadowOffset: {
      height: 2,
      width: 0,
    },
  },

  tab: {
    height: 51,
    borderRadius: 5,
  },

  homeIcon: {
    width: 29,
    height: 23.5,
  },

  chatIcon: {
    width: 22,
    height: 22,
  },

  settingsIcon: {
    width: 26,
    height: 26,
  },

});
// eslint-disable-next-line import/no-default-export
export default App;
