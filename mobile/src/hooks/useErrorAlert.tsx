import { useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { I18nContext } from '../context/I18nContext';

export function useErrorAlert(error: Error | null): void {
  const i18n = useContext(I18nContext);

  useEffect(() => {
    if (error !== null) {
      Alert.alert(i18n.t('errorOccurred'), error.message);
    }
  }, [error]);
}
