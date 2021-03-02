import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../styles/Colors';
import { TextStyles } from '../styles/TextStyles';

export const LargeButton: React.FC = ({ text, onPress}) => {
	const [active, setActive] = React.useState(false);

	return (
		<Pressable 
			onPressIn={() => setActive(true)} 
			onPressOut={
				() => {
				onPress();
				setActive(false);
				}
			} 
			style={[styles.button, active ? styles.activeButton : styles.inactiveButton]} >
			<Text style={[TextStyles.h3, active ? styles.activeText : styles.inactiveText]}>
				{text}
			</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		height: 43,
		width: 298,
		borderWidth: 2,
		borderRadius: 5,
		shadowColor: 'black',
    	shadowOpacity: 0.16,
    	shadowRadius: 6,
    	shadowOffset: { width: 0, height: 3 },
		marginLeft: 40,
    	marginRight: 40,
    	marginTop: 15,
		paddingVertical: 10,
	},
	activeButton: {
		borderColor: 'white',
		backgroundColor: 'white',
	},
	inactiveButton: {
		borderColor: Colors.orange,
		backgroundColor: Colors.orange,
	},
	activeText: {
		textAlign: 'center',
		color: Colors.orange,
	},
	inactiveText: {
		textAlign: 'center',
		color: 'white',
	},
});
