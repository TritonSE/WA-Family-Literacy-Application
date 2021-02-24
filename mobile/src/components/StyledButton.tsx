import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../styles/Colors';
import { TextStyles } from '../styles/TextStyles';

export const StyledButton: React.FC = ({ title, onPress, isSelected }) => {
	const [containerStyle, textStyle] = isSelected ? 
		[styles.selectedContainer, styles.selectedText] : [styles.container, styles.text];

	return (
		<TouchableOpacity onPress={onPress} style={containerStyle} >
			<Text style={textStyle} > {title}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({ 
	container: {
		borderRadius: 5,
		paddingVertical: 5,
		paddingHorizontal: 5,
		borderColor: Colors.orange,
		borderWidth: 1,
	},
	selectedContainer: {
		borderRadius: 5,
		paddingVertical: 5,
		paddingHorizontal: 5,
		backgroundColor: Colors.orange,
		borderColor: Colors.orange,
		borderWidth: 1,
	},
	text: {
		fontSize: 14,
    fontFamily: 'Gotham-Medium',
    fontWeight: 'normal',
		color: Colors.orange,
	},
	selectedText: {
		fontSize: 14,
    fontFamily: 'Gotham-Medium',
    fontWeight: 'normal',
		color: '#FFFFFF',
	}

});
