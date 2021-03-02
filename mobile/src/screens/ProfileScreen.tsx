import React from 'react';
import { Svg, Circle } from 'react-native-svg';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../styles/Colors';
import { TextStyles } from '../styles/TextStyles';
import { ButtonGroup } from '../components/ButtonGroup';

const SavedTab: React.FC = () => {
	return <Text> Saved </Text>;
};

const SettingsTab: React.FC = () => {
	return <Text> Settings </Text>;
};

const MoreInfoTab: React.FC = () => {
	return (
		<View style={{ alignSelf: 'center'}}>
			<Text style={TextStyles.h3} >Social Media</Text>
		</View>
	);
};

const TabScreens: { String : React.FC } = {
	'btn-1': <SavedTab/>,
	'btn-2': <SettingsTab/>,
	'btn-3': <MoreInfoTab/>,
};

/**
 * Right tab on navbar for profile menu
 */
export const ProfileScreen: React.FC = () => {
	const [selectedTab, selectTab] = React.useState('Saved');
	
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
	buttonList: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		justifyContent: 'space-between',
		marginLeft: 60,
		marginRight: 60,
	},
	button: {
		color: Colors.orange,
	},
});
