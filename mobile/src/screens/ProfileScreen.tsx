import React from 'react';
import { Svg, Circle } from 'react-native-svg';
import { Text, Image, View, ScrollView, StyleSheet, TextInput } from 'react-native';
import { Colors } from '../styles/Colors';
import { TextStyles } from '../styles/TextStyles';
import { ButtonGroup } from '../components/ButtonGroup';
import { LargeButton } from '../components/LargeButton';

const SavedTab: React.FC = () => {
	return <Text> Saved </Text>;
};

const SettingsTab: React.FC = () => {
	return <Text> Settings </Text>;
};

const MoreInfoTab: React.FC = () => {
	const [value, onChangeText] = React.useState('');

	return (
		<View style={{ alignSelf: 'center', width: 298, alignItems: 'center'}}>
			<Text style={[TextStyles.h3, {marginBottom: 20}]} >Social Media</Text>
			<View style={styles.socialRow}>
				<Image style={styles.socialPic} source={require('../../assets/images/twitter.png')}/>
				<Image style={[styles.socialPic, styles.notLeftPic]} source={require('../../assets/images/instagram.png')}/>
				<Image style={[styles.socialPic, styles.notLeftPic]} source={require('../../assets/images/facebook.png')}/>
				<Image style={[styles.socialPic, styles.notLeftPic]} source={require('../../assets/images/tiktok.png')}/>
			</View>
			<LargeButton text="Donate" onPress={() => alert("This button does nothing, for now")}/>
			<LargeButton text="Become a Volunteer" onPress={() => alert("This button does nothing, for now")}/>
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
			<LargeButton text="Send" onPress={() => alert("This button does nothing, for now")} />
		</View>
	);
};

const TabScreens = {
	'btn-1': <SavedTab/>,
	'btn-2': <SettingsTab/>,
	'btn-3': <MoreInfoTab/>,
};

/**
 * Right tab on navbar for profile menu
 */
export const ProfileScreen: React.FC = () => {
	const [selectedTab, selectTab] = React.useState('btn-1');
	
 	return (
		<ScrollView>
     	<View style={styles.heading}>
        <Svg height="100%" width="100%" viewBox="0 0 1 1">
        	<Circle cx="0.5" cy="-0.5" r="0.8" stroke={Colors.orange} fill={Colors.orange} />
        </Svg>
    	</View>
			<ButtonGroup btn1="Saved" btn2="Settings" btn3="More Info" onBtnChange={(btn) => {selectTab(btn)}} />
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
		marginLeft: 10,
	},
	textBox: {
		height: 400,
		width: 280,
		borderWidth: 1,
		borderColor: Colors.orange,
		padding: 10,
		marginTop: 10,
	},
});
