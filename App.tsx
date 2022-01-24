import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator, RootNavigator } from '@screens/index';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { IconComponent } from '@components/icons';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

export default function App() {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(true);

  const startApp = useCallback(async () => {
    await SplashScreen.preventAutoHideAsync();

    const fonts = [IconComponent.font];
    const fontAssets = fonts.map((font) => Font.loadAsync(font));
    await Promise.all([...fontAssets]);

    setReady(true);
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    startApp();
  }, [startApp]);

  return (
    <SafeAreaProvider>
      <StatusBar style='auto' />
      <GestureHandlerRootView style={{ flex: 1 }}>
        {ready ? (
          <NavigationContainer>
            {authenticated ? <RootNavigator /> : <AuthNavigator />}
          </NavigationContainer>
        ) : null}
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
