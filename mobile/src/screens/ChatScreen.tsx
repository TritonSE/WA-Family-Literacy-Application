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

      <Text style={[TextStyles.h2, styles.title]}> {i18nCtx.t('letsTalk')}</Text> 
 
      <Text style={[TextStyles.h2, styles.title]}> 
      {i18nCtx.t('tel')} <Text style={TextStyles.h3}>{i18nCtx.t('num')}</Text>
      </Text>
      <Text style={[TextStyles.h2, styles.title]}> 
      {i18nCtx.t('fax')} <Text style={TextStyles.h3}>{i18nCtx.t('num')}</Text>
      </Text>  
      <Text style={[TextStyles.h2, styles.title]}> 
      {i18nCtx.t('days')} <Text style={TextStyles.h3}>{i18nCtx.t('hours')}</Text>
      </Text>
      <Text style={[TextStyles.h2, styles.title]}> 
      {i18nCtx.t('emailUs')} <Text style={TextStyles.h3}>{i18nCtx.t('emailAddress')}</Text>
      </Text>
      <Text style={[TextStyles.h2, styles.title]}> 
      {i18nCtx.t('addressTitle')} <Text style={TextStyles.h3}>{i18nCtx.t('actualAddress')}</Text>
      </Text>
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
  title: {
    marginLeft: '6%',
    padding: '2%',
    width: '88%',
  },
});
