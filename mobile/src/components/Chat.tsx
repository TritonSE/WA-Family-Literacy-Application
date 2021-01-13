import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const Chat : React.FC = () => {
    return(
        <View style={styles.container}>
            <Text>Chat</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default Chat;