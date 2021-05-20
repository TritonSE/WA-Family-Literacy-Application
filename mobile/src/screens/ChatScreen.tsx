import React, { useContext } from 'react';
import { Linking, Text, View, StyleSheet } from 'react-native';
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
      <Text style={TextStyles.heading1}>{i18nCtx.t('liveChat')}</Text>
      <Text style={TextStyles.heading2}>{i18nCtx.t('untilThen')}</Text>

      {/*Use empty <Text/>s to add double vertical space where necessary*/}
      <Text/>

      <Text style={TextStyles.heading1}>{i18nCtx.t('letsTalk')}</Text>

      <Text/>

      <Text style={TextStyles.heading2}>
        {i18nCtx.t('tel')}: <Text style={[styles.body, styles.link]} onPress={() => Linking.openURL('tel:+18582749673')}>+1 858.274.9673</Text>
      </Text>
      <Text style={TextStyles.heading2}>
        {i18nCtx.t('fax')}: <Text style={styles.body}>+1 858.274.9673</Text>
      </Text>
      <Text style={TextStyles.heading2}>
        {i18nCtx.t('days')}: <Text style={styles.body}>{i18nCtx.t('hours')}</Text>
      </Text>

      <Text/>

      <Text style={TextStyles.heading2}>
        {i18nCtx.t('emailUs')}: <Text style={[styles.body, styles.link]} onPress={() => Linking.openURL('mailto:info@wordsalive.org')}>info@wordsalive.org</Text>
      </Text>

      <Text/>

      <Text style={TextStyles.heading2}>
        {i18nCtx.t('address')}:
      </Text>

      {/*We would use separate <Text> tags instead of \n's here, but we want the entire address to be selectable as one element so it can be copied or opened in Maps*/}
      <Text style={styles.body} selectable={true}>5111 Santa Fe Street Suite 219{'\n'}San Diego, California, 92081{'\n'}United States</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  link: {
    color: Colors.link,
    textDecorationLine: 'underline',
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
  body: {
    fontSize: 18,
    fontFamily: 'Gotham-Light',
  },
});
