import React, { useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { I18nContext } from '../context/I18nContext';
import { TextStyles } from '../styles/TextStyles';
import { Colors } from '../styles/Colors';

/**
 * Left tab on navbar for chatting with volunteers
 */
export const ChatScreen: React.FC = () => {
  const i18nCtx = useContext(I18nContext);
  return (
    <>
      <View style={styles.title}>
        <Text style={TextStyles.h2}>Chat is coming soon, until then:</Text>
      </View>
      <View style={styles.container}>
        <Text style={TextStyles.h1}> {i18nCtx.t('letsTalk')}</Text> 
    
        <Text></Text>
        <Text style={TextStyles.h2}> 
          {i18nCtx.t('tel')}: <Text style={TextStyles.body1}>858.274.9673</Text>
        </Text>
        <Text style={TextStyles.h2}> 
          {i18nCtx.t('fax')}: <Text style={TextStyles.body1}>858.274.9673</Text>
        </Text>  
        <Text style={TextStyles.h2}> 
          {i18nCtx.t('days')}: <Text style={TextStyles.body1}>{i18nCtx.t('hours')}</Text>
        </Text>
        <Text></Text>
        <Text style={TextStyles.h2}> 
          {i18nCtx.t('emailUs')}: <Text style={TextStyles.body1}>info@wordsalive.org</Text>
        </Text>
        <Text></Text>
        <Text style={TextStyles.h2}> 
          {i18nCtx.t('address')}: <Text style={TextStyles.body1}>5111 Santa Fe Street Suite 219 San Diego, California, 92081, United States</Text>
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    flex: 0,
    justifyContent: 'center',
    backgroundColor: Colors.orange,
    paddingLeft: 24,
    paddingTop: '30%',
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: Colors.orange,
    width: '100%',
    height: '100%',
    paddingLeft: 24,
    paddingRight: 24,
  },
});
