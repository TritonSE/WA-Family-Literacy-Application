import React from 'react';
import { Svg, Circle } from 'react-native-svg';
import { Text, View, StyleSheet } from 'react-native';
import { Colors } from '../styles/Colors';
import { StyledButton } from '../components/StyledButton';

const SavedTab: React.FC = () => {
	return <Text> Saved </Text>;
};

const SettingsTab: React.FC = () => {
	return <Text> Settings </Text>;
};

const MoreInfoTab: React.FC = () => {
	return <Text> More Info </Text>;
};

enum Tabs {
	saved,
	settings,
	moreInfo,
};

const TabScreens: { [key: Tabs]: React.FC } = {
	[Tabs.saved]: <SavedTab/>,
	[Tabs.settings]: <SettingsTab/>,
	[Tabs.moreInfo]: <MoreInfoTab/>,
};

/**
 * Right tab on navbar for profile menu
 */
export const ProfileScreen: React.FC = () => {
	const [selectedTab, selectTab] = React.useState(Tabs.saved);
	
  return (
		<View>
      <View style={styles.heading}>
        <Svg height="100%" width="100%" viewBox="0 0 1 1">
          <Circle cx="0.5" cy="-0.5" r="0.8" stroke={Colors.orange} fill={Colors.orange} />
        </Svg>
      </View>
			<View style={styles.buttonList}>
				<StyledButton title="Saved" onPress={() => selectTab(Tabs.saved)} 
					isSelected={selectedTab===Tabs.saved}/>
				<StyledButton title="Settings" onPress={() => selectTab(Tabs.settings)} 
					isSelected={selectedTab===Tabs.settings}/>
				<StyledButton title="More Info" onPress={() => selectTab(Tabs.moreInfo)} 
					isSelected={selectedTab===Tabs.moreInfo}/>
			</View>
			{ TabScreens[selectedTab] }
		</View>
  );
};

const styles = StyleSheet.create({
	heading: {
    color: Colors.orange,
    height: 400,
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
