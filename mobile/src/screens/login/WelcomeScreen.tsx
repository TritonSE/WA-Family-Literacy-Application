import React, { useContext } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Colors } from '../../styles/Colors';
import { LargeButton } from '../../components/LargeButton';
import { I18nContext } from '../../context/I18nContext';
import { TextStyles } from '../../styles/TextStyles';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { useErrorAlert } from '../../hooks/useErrorAlert';

export const WelcomeScreen: React.FC = () => {
  const auth = useContext(AuthContext);
  const i18n = useContext(I18nContext);
  const navigation = useNavigation();
  useErrorAlert(auth.error);

  return (
    <View style={styles.background}>
      <View style={styles.logoContainer}>
        <Image source={require('../../../assets/images/logo-white.png')} style={styles.logo} />
      </View>
      <View style={styles.container}>
        <LargeButton text={i18n.t('signIn')} onPress={() => navigation.navigate('Login')} underline />
        <Text style={[TextStyles.caption2]}>{i18n.t('or').toUpperCase()}</Text>
        <LargeButton text={i18n.t('signUp')} onPress={() => navigation.navigate('SignUp')} underline />
        <LargeButton text={i18n.t('continueAsGuest')} onPress={() => auth.continueAsGuest()} underline />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.orange,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 150,
  },
  logo: {
    width: 250,
    height: 250,
  },
});
