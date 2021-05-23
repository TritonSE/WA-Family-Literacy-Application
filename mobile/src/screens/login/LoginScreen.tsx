import React, { useContext, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Pressable} from 'react-native';

import { Colors } from '../../styles/Colors';
import { I18nContext } from '../../context/I18nContext';
import { TextStyles } from '../../styles/TextStyles';
import { Checkbox } from '../../components/Checkbox';
import { LargeButton } from '../../components/LargeButton';
import { AuthContext } from '../../context/AuthContext';
import { useErrorAlert } from '../../hooks/useErrorAlert';

import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.background}>

      <Pressable
        style={[{marginTop: insets.top}, styles.backButtonContainer]}
        onPress={() => navigation.goBack()}
      >
        <Image style={styles.backButton} source={require('../../../assets/images/Arrow_left.png')}/>
      </Pressable>

      <View style={styles.logoContainer}>
        <Image source={require('../../../assets/images/logo-white.png')} style={styles.logo} />
      </View>

      <View style={styles.container}>
        <TextInput style={[styles.input, TextStyles.caption3]} value={email} onChangeText={setEmail} placeholder={i18n.t('email')} textContentType="emailAddress" />
        <TextInput style={[styles.input, TextStyles.caption3]} value={password} onChangeText={setPassword} placeholder={i18n.t('password')} secureTextEntry />
        
        <TouchableOpacity style={styles.rememberMeContainer} onPress={() => setRememberMe(!rememberMe)}>
          <Checkbox value={rememberMe} onChange={setRememberMe} inverted />
          <Text style={styles.rememberMeText}>{i18n.t('rememberMe')}</Text>
        </TouchableOpacity>
       
        <View style={styles.signInContainer}>
          <LargeButton text={i18n.t('signIn')} onPress={login} />
        </View>
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
  backButtonContainer: { 
    position: 'absolute', 
    left: 0,
  },
  backButton: {
    width: 25,
    height: 25,
    marginLeft: 25,
    marginTop: 10,
    tintColor: Colors.white,
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 50,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  container: {
    width: '80%',
    flex: 1,
    alignItems: 'center',
    marginTop: 25,
  },
  input: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 5,
    padding: 8,
    marginBottom: 20,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start',
  },
  rememberMeText: {
    marginLeft: 10,
    ...TextStyles.caption2,
    color: Colors.white,
    alignSelf: 'center',
  },
  signInContainer: {
    marginTop: 60,
  }
});
