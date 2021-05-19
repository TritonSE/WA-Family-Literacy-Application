import React from 'react';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { APIProvider } from './src/context/APIContext';
import { BookProvider } from './src/context/BookContext';
import { I18nProvider } from './src/context/I18nContext';
import { TopNavigator } from './src/navigation/TopNavigator';
import { AuthProvider } from './src/context/AuthContext';

const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    'Gotham-Bold': require('./assets/fonts/gotham-rounded/GothamRounded-Bold.otf'),
    'Gotham-Medium': require('./assets/fonts/gotham-rounded/GothamRounded-Medium.otf'),
    'Gotham-Light': require('./assets/fonts/gotham-rounded/GothamRounded-Light.otf'),
    'Gotham-Italic': require('./assets/fonts/gotham-rounded/GothamRounded-Italic.otf'),
  });

  if (!fontsLoaded) {
    return <AppLoading/>;
  }

  return (
    <SafeAreaProvider>
      <I18nProvider>
        <APIProvider>
          <AuthProvider>
            <BookProvider>
              <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
                <NavigationContainer>
                  <StatusBar translucent backgroundColor="transparent"/>
                  <TopNavigator />
                </NavigationContainer>
              </SafeAreaView>
            </BookProvider>
          </AuthProvider>
        </APIProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
};

// eslint-disable-next-line import/no-default-export
export default App;
