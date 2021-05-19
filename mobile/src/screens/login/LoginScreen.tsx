import React, { useContext, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Colors } from '../../styles/Colors';
import { I18nContext } from '../../context/I18nContext';
import { TextStyles } from '../../styles/TextStyles';
import { Checkbox } from '../../components/Checkbox';
import { LargeButton } from '../../components/LargeButton';
import { AuthContext } from '../../context/AuthContext';
import { useErrorAlert } from '../../hooks/useErrorAlert';

export const LoginScreen: React.FC = () => {
  const i18n = useContext(I18nContext);
  const auth = useContext(AuthContext);
  useErrorAlert(auth.error);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);


  const login = (): void => {
    auth.login(email, password, rememberMe);
  };

  return (
    <View style={styles.background}>
      <View style={styles.logoContainer}>
        <Image source={require('../../../assets/images/logo-white.png')} style={styles.logo} />
      </View>
      <View style={styles.container}>
        <TextInput style={[styles.input, TextStyles.caption3]} value={email} onChangeText={setEmail} placeholder={i18n.t('email')} textContentType="emailAddress" />
        <TextInput style={[styles.input, TextStyles.caption3]} value={password} onChangeText={setPassword} placeholder={i18n.t('password')} secureTextEntry />
        <TouchableOpacity style={styles.rememberMeContainer} onPress={() => setRememberMe(!rememberMe)}>
          <Checkbox value={rememberMe} onChange={setRememberMe} inverted />
          <Text style={TextStyles.caption2}>{i18n.t('rememberMe')}</Text>
        </TouchableOpacity>
        <LargeButton text={i18n.t('signIn')} onPress={login} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: Colors.orange,
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
  container: {
    width: '80%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 5,
    padding: 8,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start'
  }
});
