import React, { useContext, useState } from 'react';
import { Image, Text, TextInput, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../../styles/Colors';
import { TextStyles } from '../../styles/TextStyles';
import { Checkbox } from '../../components/Checkbox';
import { LargeButton } from '../../components/LargeButton';
import { I18nContext } from '../../context/I18nContext';
import { AuthContext } from '../../context/AuthContext';
import { useErrorAlert } from '../../hooks/useErrorAlert';

export const SignUpScreen: React.FC = () => {
  const i18n = useContext(I18nContext);
  const auth = useContext(AuthContext);
  useErrorAlert(auth.error);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inSanDiego, setInSanDiego] = useState(false);

  const ok = name !== '' && email !== '' && password === confirmPassword;

  const signup = (): void => {
    auth.signup(name, email, password, inSanDiego);
  };

  return (
    <View style={styles.background}>
      <View style={styles.logoContainer}>
        <Image source={require('../../../assets/images/logo-white.png')} style={styles.logo} />
      </View>
      <View style={styles.container}>
        <Text style={[TextStyles.caption2, styles.caption]}>{i18n.t('volunteersViewThis')}*</Text>
        <TextInput style={[styles.input, TextStyles.caption3]} value={name} onChangeText={setName} placeholder={i18n.t('preferredName')}/>
        <TextInput style={[styles.input, TextStyles.caption3]} value={email} onChangeText={setEmail} placeholder={i18n.t('email')} textContentType="emailAddress" />
        <TextInput style={[styles.input, TextStyles.caption3]} value={password} onChangeText={setPassword} placeholder={i18n.t('password')} secureTextEntry />
        <TextInput style={[styles.input, TextStyles.caption3]} value={confirmPassword} onChangeText={setConfirmPassword} placeholder={i18n.t('confirmPassword')} secureTextEntry />
        {confirmPassword !== '' && password !== confirmPassword && <Text style={[TextStyles.caption2, styles.caption]}>{i18n.t('passwordsDontMatch')}</Text>}
        <TouchableOpacity style={styles.inSanDiegoContainer} onPress={() => setInSanDiego(!inSanDiego)}>
          <Checkbox value={inSanDiego} onChange={setInSanDiego} inverted />
          <Text style={TextStyles.caption2}>{i18n.t('inSanDiego')}</Text>
        </TouchableOpacity>
        <LargeButton text={i18n.t('signUp')} onPress={signup} disabled={!ok} />
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
  caption: {
    width: '100%',
    color: Colors.white,
  },
  inSanDiegoContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start'
  }
});
