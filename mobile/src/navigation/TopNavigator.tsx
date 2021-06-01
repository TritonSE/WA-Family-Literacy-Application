import React, { useContext } from 'react';

import { AuthContext } from '../context/AuthContext';
import { MainTabNavigator } from './MainTabNavigator';
import { AuthNavigator } from './AuthNavigator';

export const TopNavigator: React.FC = () => {
  const { loggedIn } = useContext(AuthContext);
  return loggedIn ? <MainTabNavigator /> : <AuthNavigator />;
};
