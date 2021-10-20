import React, { ReactElement, useEffect, useContext } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { TextStyles } from "../styles/TextStyles";
import { Colors } from "../styles/Colors";
import NetInfo from "@react-native-community/netinfo";
import { I18nContext } from "../context/I18nContext";

type OfflineIndicatorProps = {
  variant?: 'orange' | 'white';
  children: ReactElement;
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
}) => {
  const { t } = useContext(I18nContext);
  const [isConnected, setIsConnected] = React.useState(false);

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
    <TouchableOpacity style={styles.reconnectContainer} onPress={checkIfConnected}>
      <Text style={[styles.reconnectText, {color: Colors[variant]}]}>{t("pleaseReconnect")}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  reconnectContainer: {
    alignSelf:'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 300
  },
  reconnectText: {
    ...TextStyles.heading3,
    textAlign:'center',
  },
});
