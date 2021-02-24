import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Colors } from '../styles/Colors';

/**
 * A large, orange loading indicator displayed when books are being loaded
*/
export const LoadingCircle: React.FC = () => {
  return (
    <ActivityIndicator
      size="large"
      color={Colors.orange}
    />
  );
};
