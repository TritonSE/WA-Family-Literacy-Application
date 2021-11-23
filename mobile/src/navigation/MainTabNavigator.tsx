import React, { useContext } from 'react';
import { StyleSheet, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { HomeStackNavigator } from './HomeStackNavigator';
import { Colors } from '../styles/Colors';
import { AuthContext } from '../context/AuthContext';


const Tab = createBottomTabNavigator();

/**
 * Main bottom tab navigator
 */
export const MainTabNavigator: React.FC = () => {
  const { isGuest } = useContext(AuthContext);
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          switch (route.name) {
            case 'Home':
              return <Image style={[styles.homeIcon, { tintColor: color }]} source={require('../../assets/images/Home.png')} />;
            case 'Chat':
              return <Image style={[styles.chatIcon, { tintColor: color }]} source={require('../../assets/images/Chat_bubble.png')} />;
            case 'Profile':
              return <Image style={[styles.profileIcon, { tintColor: color }]} source={require('../../assets/images/user-solid.png')} />;
            default:
              return null;
          }
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
      {!isGuest ? <Tab.Screen name="Chat" component={ChatScreen} /> : null }
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({

  navbarContainer: {
    height: 60,
    padding: 4.5,
    paddingLeft: 47,
    paddingRight: 47,
    backgroundColor: Colors.white,
    shadowColor: Colors.shadowColor,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: {
      height: -10,
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

  profileIcon: {
    width: 22.5,
    height: 26,
  },

});
