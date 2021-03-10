import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TextStyles } from '../styles/TextStyles';

/**
 * Left tab on navbar for chatting with volunteers
 */
export const ChatScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={TextStyles.h3}>  {`\tLet's Talk\n`}</Text>
      <Text> <Text style={TextStyles.h3}> {`\t`}Tel: </Text><Text>858.274.9673{`\n`}</Text> </Text>
      <Text> <Text style={TextStyles.h3}> {`\t`}Fax: </Text><Text>858.274.9673{`\n`}</Text> </Text>
      <Text> <Text style={TextStyles.h3}> {`\t`}Mon-Fri: </Text><Text>8am-4pm{`\n`}</Text> </Text>
      <Text> <Text style={TextStyles.h3}> {`\t`}Email Us: </Text><Text>info@wordsalive.gov{`\n`}</Text> </Text>
      <Text> <Text style={TextStyles.h3}> {`\t`}Address: </Text><Text>{`5111 Santa Fe Street Suite\n\t219 San Diego, California, 92081, \n\tUnited States`}{`\n`}</Text> </Text>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: 'orange',
    width: '400pt',
    height: '400pt',
  },
});
