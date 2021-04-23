import React, { useContext, useEffect, useState } from 'react';

import { Svg, Circle } from 'react-native-svg';

import { Text, Image, View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Linking, Pressable } from 'react-native';
import { Colors } from '../styles/Colors';
import { TextStyles } from '../styles/TextStyles';
import { ButtonGroup } from '../components/ButtonGroup';
import { LargeButton } from '../components/LargeButton';
import { I18nContext } from '../context/I18nContext';
import { Language, Languages } from '../models/Languages';

import AsyncStorage from '@react-native-async-storage/async-storage';

const SavedTab: React.FC = () => {
  return <Text> Saved </Text>;
};

// const STORAGE_KEY = '@locale';
const SettingsTab: React.FC = () => {

	const i18nCtx = useContext(I18nContext);

	const i18n = i18nCtx.i18n;
	const t = i18n.t;
	const languages = Object.keys(i18n.translations);
	
	const [locale, setLocale] = useState(i18n.locale);

	i18nCtx.getData();

	// const getData = async () => {
	// 	try {
	// 	  const value = await AsyncStorage.getItem(STORAGE_KEY);
	// 	  if(value !== null) {
	// 		setLocale(value);
	// 		i18nCtx.setLocale(value);
	// 		//console.log("LOCALE CHANGE to", i18n.locale, value);
	// 	  }
	// 	} catch(e) {
	// 	  console.log(e);
	// 	}
	// }

	// getData();
	//console.log("locale", locale)
	//console.log("i18n locale", i18n.locale);
	  
	// const storeData = async (value: Language) => {
	// 	try {
	// 	  await AsyncStorage.setItem(STORAGE_KEY, value);
	// 	} catch (e) {
	// 	  console.log(e);
	// 	}
	// }

	const changeLocale = (locale: Language) => {
		setLocale(locale);
		i18nCtx.setLocale(locale)
		i18nCtx.storeData(locale);
		// storeData(locale);
	}

	//console.log(i18n.locale)

	// useEffect(() => {
	// 	// getData();
	// }, [])
	

	return (
		<View>
		
			<View style={{alignSelf: 'center', alignItems: 'center', width: 298}}>
				<LargeButton text="Sign In" onPress={() => null} underline={true}/>
				<LargeButton text="Sign Up" onPress={() => null} underline={true}/>
			</View>

			<View style={{marginTop: 30, alignSelf: 'center', width: 298}}>
				<Text style={[TextStyles.h3, {marginBottom: 10}]}>Language</Text>
				
				{languages.map((lang: Language) => (
					<View key={`lang${lang}`} style={{marginTop: 20, flexDirection: 'row', justifyContent: 'space-between'}}>
						<Text style={TextStyles.body1}>{Languages[lang]}</Text>
						
						<Pressable style={ lang === locale ? {backgroundColor: Colors.orange, height: 20, width: 20} : {backgroundColor: 'grey', height: 20, width: 20}}
							onPress={() => changeLocale(lang)}
						/>

					</View>
				))}

			</View>

			<View style={{marginTop: 30}}>
				<Text style={[TextStyles.h3, {textAlign: 'center'}]}>Locale: {i18nCtx.i18n.locale}</Text>
				<Text style={{textAlign: 'center'}}>{t('newBooks')}</Text>
				<Text style={{textAlign: 'center'}}>{t('allBooks')}</Text>
			</View>

			<View style={{height: 400}}></View>

		</View>
	
	
	);

};

const MoreInfoTab: React.FC = () => {
  const [value, onChangeText] = React.useState('');

  return (
    <View style={{ alignSelf: 'center', width: 298, alignItems: 'center'}}>
      <Text style={[TextStyles.h3, {marginBottom: 20}]} >Social Media</Text>
      <View style={styles.socialRow}>
        <TouchableOpacity onPress={async () => await Linking.openURL("https://twitter.com/WordsAliveSD")}>
          <Image style={styles.socialPic} source={require('../../assets/images/twitter.png')}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={async () => await Linking.openURL("https://instagram.com/wordsalivesd")}>
          <Image style={[styles.socialPic, styles.notLeftPic]} source={require('../../assets/images/instagram.png')}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={async () => await Linking.openURL("https://www.facebook.com/WordsAliveSD")}>
          <Image style={[styles.socialPic, styles.notLeftPic]} source={require('../../assets/images/facebook.png')}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={async () => await Linking.openURL("https://www.tiktok.com/@wordsalivesd")}>
          <Image style={[styles.socialPic, styles.notLeftPic]} source={require('../../assets/images/tiktok.png')}/>
        </TouchableOpacity>
      </View>
      <LargeButton text="Donate" onPress={async () => await Linking.openURL("https://www.wordsalive.org/donate")}/>
      <LargeButton text="Become a Volunteer" onPress={async () => await Linking.openURL("https://www.wordsalive.org/becomeavolunteer")}/>
      <Text style={[TextStyles.h1, {textAlign: 'center', marginTop: 20}]}>
        Interested in our Program?
      </Text>
      <Text style={[TextStyles.caption3, {textAlign: 'center', marginTop: 10}]}>
        Please send us a message!
      </Text>
      <TextInput
        style={styles.textBox}
        multiline
        onChangeText={text => onChangeText(text)}
        value={value}
      />
      <LargeButton text="Send" onPress={async () => await Linking.openURL(`mailto:amanda@wordsalive.org?subject=Family Literacy App Contact Form&body=${value}`)} />
    </View>
  );
};

const TabScreens: { [index: string]: any } = {
  'saved': <SavedTab/>,
  'settings': <SettingsTab/>,
  'moreInfo': <MoreInfoTab/>,
};

/**
 * Right tab on navbar for profile menu
 */
export const ProfileScreen: React.FC = () => {
  const [selectedTab, selectTab] = React.useState('saved');
  
  return (
    <ScrollView>
      <View style={styles.heading}>
        <Svg height="100%" width="100%" viewBox="0 0 1 1">
          <Circle cx="0.5" cy="-0.5" r="0.8" stroke={Colors.orange} fill={Colors.orange} />
        </Svg>
      </View>
      <View style={styles.buttonGroup}>
        <ButtonGroup btn1="saved" btn2="settings" btn3="moreInfo" onBtnChange={(btn) => {selectTab(btn);}} />
      </View>
      { TabScreens[selectedTab] }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: Colors.orange,
    height: 350,
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
    height: 300,
    width: 280,
    borderWidth: 1,
    borderColor: Colors.orange,
    padding: 10,
    marginTop: 10,
  },
  buttonGroup: {
    alignItems: 'center',
  },
});
