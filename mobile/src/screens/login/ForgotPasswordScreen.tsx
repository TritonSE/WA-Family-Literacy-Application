import React, { useContext, useState } from 'react';
import { Image, StyleSheet, TextInput, View, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '../../styles/Colors';
import { I18nContext } from '../../context/I18nContext';
import { TextStyles } from '../../styles/TextStyles';
import { LargeButton } from '../../components/LargeButton';
import { AuthContext } from '../../context/AuthContext';
import { useErrorAlert } from '../../hooks/useErrorAlert';

import { PopUpModal } from '../../components/PopUpModal';


export const ForgotPasswordScreen: React.FC = () => {
  const i18n = useContext(I18nContext);
  const auth = useContext(AuthContext);
  useErrorAlert(auth.error, auth.clearError);

  const [email, setEmail] = useState('');  
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError]  = useState(null);

  
  const resetPassword = (): void => {
    
    try {      
      // sendPasswordResetEmail throws error if no email or if email is
      // not linked to an account
      auth.sendPasswordResetEmail(email);
      // setModalVisible(true);
      setEmail('');
    }
    catch (e) {
      console.log(e);
      setError(new Error("An error occured!"));
    }
    // setEmail('');
    // navigation.goBack();
  };

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={styles.background} keyboardShouldPersistTaps='handled' contentContainerStyle={styles.backgroundChildren}>
      <Pressable
        style={[{marginTop: insets.top}, styles.backButtonContainer]}
        onPress={() => navigation.goBack()}
      >
        <Image style={styles.backButton} source={require('../../../assets/images/Arrow_left.png')}/>
      </Pressable>

      <View style={styles.logoContainer}>
        <Image source={require('../../../assets/images/logo-white.png')} style={styles.logo} />
      </View>

      <PopUpModal text={"Valid email!"} setModalVisible={setModalVisible} modalVisible={modalVisible} />

      <View style={styles.container}>
        <TextInput style={[styles.input, TextStyles.caption3]} value={email} onChangeText={setEmail} placeholder={i18n.t('email')} placeholderTextColor={Colors.gray} textContentType="emailAddress" />

        <LargeButton text={i18n.t('sendPasswordResetEmail')} onPress={resetPassword} border />

      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: Colors.orange,
  },
  backgroundChildren: {
    alignItems: 'center',
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
    marginTop: '40%',
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
});
