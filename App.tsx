import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import React from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import { NavigationContainer } from '@react-navigation/native';

import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import { AuthProvider } from './src/hooks/auth';

import { AppRoutes } from './src/routes/app.routes';
import { SignIn } from './src/screens/SignIn';

import theme from './src/global/styles/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  if(!fontsLoaded) {
    return <AppLoading />
  };

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <AuthProvider>
          <SignIn />
        </AuthProvider>
        {/* <AppRoutes /> */}
      </NavigationContainer>
    </ThemeProvider>
  );
};
