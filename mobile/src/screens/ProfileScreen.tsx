import React, { useContext } from 'react';
import { Image, KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Circle, Svg } from 'react-native-svg';

import { Colors } from '../styles/Colors';
import { TextStyles } from '../styles/TextStyles';
import { ButtonGroup } from '../components/ButtonGroup';
import { SmallButton } from '../components/SmallButton';
import { LargeButton } from '../components/LargeButton';
import { Checkbox } from '../components/Checkbox';
import { I18nContext } from '../context/I18nContext';
import { Language, Languages } from '../models/Languages';
import { AuthContext } from '../context/AuthContext';
import { APIContext } from '../context/APIContext';

const SavedTab: React.FC = () => {
  return (
    <View>
      <Text>
        Saved
      </Text>
      <View style={{ height: 300 }} />
    </View>
  );
};

/**
 * Settings Tab to set app locale (language)
 */
const SettingsTab: React.FC = () => {
  const i18n = useContext(I18nContext);
  const api = useContext(APIContext);
  const auth = useContext(AuthContext);

  const languages = Object.keys(i18n.i18n.translations) as Language[];

  const setInSanDiego = (inSanDiego: boolean): void => {
    (async () => {
      if (auth.user === null) {
        return;
      }

      await api.updateUser(auth.user.id, { in_san_diego: inSanDiego });
      auth.fetchUser();
    })();
  };

  return (
    <View>
      {auth.user === null ? (
        <View style={styles.login}>
          <LargeButton text={i18n.t('signUp')} onPress={() => auth.logout()} underline />
        </View>
      ) : (
        <View style={styles.profileInfo}>
          <View style={styles.emailContainer}>
            <Text style={TextStyles.caption2}>{auth.user.email}</Text>
            <SmallButton text={i18n.t('signOut')} onPress={() => auth.logout()} underline />
          </View>
          <View style={styles.inSDContainer}>
            <Checkbox value={auth.user.in_san_diego} onChange={setInSanDiego} />
            {/* Not sure why this `auth.user &&` hack is necessary, this entire block is gated with auth.user !== null*/}
            <Text style={[TextStyles.caption2, styles.inSDLabel]} onPress={() => auth.user && setInSanDiego(!auth.user.in_san_diego)}>{i18n.t('inSanDiego')}</Text>
          </View>
        </View>
      )}

      <View style={styles.langSelector}>
        <View style={styles.languageText}>
          <Text style={TextStyles.heading3}>{i18n.t('language')}</Text>
        </View>

        {languages.map((lang: Language) => (
          <View key={`lang${lang}`} style={styles.langElem}>

            <Text style={TextStyles.body1}>{Languages[lang]}</Text>

            <Pressable
              onPress={() => i18n.setLocale(lang)}
              style={styles.box}
            >
              {lang === i18n.locale && <Image style={styles.boxChecked} source={require('../../assets/images/check-square-solid.png')} />}
            </Pressable>

          </View>
        ))}

      </View>

      <View style={{ height: 300 }} />

    </View>

  );

};

const MoreInfoTab: React.FC = () => {
  const i18nCtx = useContext(I18nContext);
  const { t } = i18nCtx;

  const [value, onChangeText] = React.useState('');

  return (
    <View style={{ alignSelf: 'center', width: 298, alignItems: 'center' }}>
      <Text style={[TextStyles.heading3, { marginBottom: 20 }]}>{t('socialMedia')}</Text>
      <View style={styles.socialRow}>
        <TouchableOpacity onPress={async () => await Linking.openURL('https://twitter.com/WordsAliveSD')}>
          <Image style={styles.socialPic} source={require('../../assets/images/twitter.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={async () => await Linking.openURL('https://instagram.com/wordsalivesd')}>
          <Image style={[styles.socialPic, styles.notLeftPic]} source={require('../../assets/images/instagram.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={async () => await Linking.openURL('https://www.facebook.com/WordsAliveSD')}>
          <Image style={[styles.socialPic, styles.notLeftPic]} source={require('../../assets/images/facebook.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={async () => await Linking.openURL('https://www.tiktok.com/@wordsalivesd')}>
          <Image style={[styles.socialPic, styles.notLeftPic]} source={require('../../assets/images/tiktok.png')} />
        </TouchableOpacity>
      </View>
      <LargeButton text={t('donate')} onPress={async () => await Linking.openURL('https://www.wordsalive.org/donate')} />
      <LargeButton text={t('volunteer')} onPress={async () => await Linking.openURL('https://www.wordsalive.org/becomeavolunteer')} />
      <Text style={[TextStyles.heading3, { textAlign: 'center', marginTop: 20 }]}>
        {t('tagline')}
      </Text>
      <Text style={[TextStyles.caption3, { textAlign: 'center', marginTop: 20, marginBottom: 10 }]}>
        {t('contactUs')}
      </Text>
      <TextInput
        style={styles.textBox}
        multiline
        textAlignVertical={'top'}
        textAlign={'left'}
        onChangeText={text => onChangeText(text)}
        value={value}
      />
      <View style={{ paddingBottom: 15 }}>
        <LargeButton text={t('send')} onPress={async () => await Linking.openURL(`mailto:amanda@wordsalive.org?subject=Family Literacy App Contact Form&body=${value}`)} />
      </View>
    </View>
  );
};

const TabScreens: { [index: string]: JSX.Element } = {
  saved: <SavedTab />,
  settings: <SettingsTab />,
  moreInfo: <MoreInfoTab />,
};

/**
 * Right tab on navbar for profile menu
 */
export const ProfileScreen: React.FC = () => {
  const i18n = useContext(I18nContext);

  const [selectedTab, selectTab] = React.useState('settings');
  const tabButtons = {
    settings: i18n.t('settings'),
    moreInfo: i18n.t('moreInfo'),
  };

  return (
    <KeyboardAvoidingView style={styles.background} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView>
        {/* Orange box above the screen, in case the user scrolls past the top of the screen */}
        <View style={styles.top} />
        {/* Starts at the top of the screen, containing the Words Alive logo and orange rounded background */}
        <View style={styles.heading}>
          <SafeAreaView edges={['top']} style={styles.logoContainer}>
            <Image source={require('../../assets/images/logo-white.png')} style={styles.logo} />
          </SafeAreaView>
          <Svg height="100%" width="100%" viewBox="0 0 1 1" style={styles.circle}>
            <Circle cx="0.5" cy="-0.3" r="0.8" stroke={Colors.orange} fill={Colors.orange} />
          </Svg>
        </View>
        <View style={styles.buttonGroup}>
          <ButtonGroup buttons={tabButtons} onButtonChange={(btn) => {
            selectTab(btn);
          }} />
        </View>
        {TabScreens[selectedTab]}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.white,
  },
  top: {
    marginTop: -500,
    height: 500,
    backgroundColor: Colors.orange,
  },
  heading: {
    color: Colors.orange,
    height: 400,
  },
  logoContainer: {
    paddingTop: 100,
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 150,
  },
  circle: {
    marginTop: -200,
    zIndex: -1, // needed to render behind the logo
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  socialPic: {
    height: 32,
    width: 32,
  },
  notLeftPic: {
    marginLeft: 20,
  },
  textBox: {
    height: 170,
    width: 298,
    borderWidth: 1,
    borderColor: Colors.orange,
    padding: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  buttonGroup: {
    paddingTop: 33,
    alignItems: 'center',
  },
  login: {
    alignSelf: 'center',
    alignItems: 'center',
    width: 298,
  },
  langSelector: {
    marginTop: 30,
    alignSelf: 'center',
    width: 298,
  },
  languageText: {
    marginBottom: 10,
  },
  langElem: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  box: {
    height: 24,
    width: 24,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: Colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxChecked: {
    height: 22,
    width: 22,
    tintColor: Colors.orange,
  },
  profileInfo: {
    width: 298,
    alignSelf: 'center',
  },
  emailContainer: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inSDContainer: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inSDLabel: {
    marginLeft: 8,
  },
});
