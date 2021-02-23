import React from 'react';
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BookProvider } from './src/context/BookContext';
import { I18nProvider } from './src/context/I18nContext';
import { MainScreen } from './src/screens/MainScreen';

const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    'Gotham-Bold': require('./assets/fonts/gotham-rounded/GothamRounded-Bold.otf'),
    'Gotham-Medium': require('./assets/fonts/gotham-rounded/GothamRounded-Medium.otf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <SafeAreaProvider>
      <I18nProvider>
        <BookProvider>
          <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
            <NavigationContainer>
              <MainScreen />
            </NavigationContainer>
          </SafeAreaView>
        </BookProvider>
      </I18nProvider>
    </SafeAreaProvider>

  );
};

// eslint-disable-next-line import/no-default-export
export default App;
