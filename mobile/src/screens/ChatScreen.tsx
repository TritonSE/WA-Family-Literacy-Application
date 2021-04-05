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
    <View style={styles.container}>
      <Text style={TextStyles.h4}> {i18nCtx.t('letsTalk')}</Text>
      <Text style={TextStyles.h4}> {i18nCtx.t('tel')} </Text>
      <Text style={TextStyles.h4}> {i18nCtx.t('fax')}</Text>
      <Text style={TextStyles.h4}> {i18nCtx.t('days')}</Text>
      <Text style={TextStyles.h4}> {i18nCtx.t('email')}</Text>
      <Text style={TextStyles.h4}> {i18nCtx.t('address')}</Text>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: '20%',
    backgroundColor: Colors.orange,
    width: '100%',
    height: '100%',
  },
});
