import React, { ReactElement, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ViewStyle,
} from 'react-native';
import { TextStyles } from '../styles/TextStyles';
import { Colors } from '../styles/Colors';
import NetInfo from '@react-native-community/netinfo';
import { I18nContext } from '../context/I18nContext';

type OfflineIndicatorProps = {
  children: ReactElement;
  variant?: 'orange' | 'white';
  style?: ViewStyle;
};

/**
 * Offline Indicator Component:
 *  - Displays children if connected to the internet
 *  - Listens for changes in network connection
 *  - Manually tapping on me will also initiate a connection check
 */
export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  variant = 'orange',
  children,
  style,
}) => {
  const { t } = useContext(I18nContext);
  const [isConnected, setIsConnected] = React.useState<boolean | null>(false);

  const checkIfConnected = (): void => {
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected);
    });
  };

  useEffect(() => {
    // Subscribe to network connection changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    // Unsubscribe on unmount
    return unsubscribe;
  }, []);

  if (isConnected) return children;
  return (
    <TouchableOpacity
      style={[styles.reconnectContainer, style]}
      onPress={checkIfConnected}
    >
      <Image
        style={[styles.reconnectIcon, { tintColor: Colors[variant] }]}
        source={require('../../assets/images/redo-alt-solid.png')}
      />
      <Text style={[styles.reconnectText, { color: Colors[variant] }]}>
        {t('pleaseReconnect')}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  reconnectIcon: {
    width: 25,
    height: 25,
    marginBottom: 18,
  },
  reconnectContainer: {
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 160,
    marginVertical: 60,
  },
  reconnectText: {
    ...TextStyles.heading3,
    textAlign: 'center',
  },
});
