import React from 'react';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { BookProvider } from './src/context/BookContext';
import { HomeScreen } from './src/screens/HomeScreen';

const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    'Gotham-Bold': require('./assets/fonts/gotham-rounded/GothamRounded-Bold.otf'),
    'Gotham-Medium': require('./assets/fonts/gotham-rounded/GothamRounded-Medium.otf'),
  });

  if (!fontsLoaded) {
    return <AppLoading/>;
  }
  return (
    <BookProvider>
      <HomeScreen />
    </BookProvider>
  );
};

// eslint-disable-next-line import/no-default-export
export default App;
