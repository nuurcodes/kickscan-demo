import 'react-native-reanimated';
import 'react-native-url-polyfill/auto';

import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator, RootNavigator } from '@screens/index';
import { useAuthStateListener } from '@hooks/useAuthStateListener';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { IconComponent } from '@components/icons';
import { QueryClientProvider } from 'react-query';
import { queryClient } from '@lib/reactQuery';
import { useAuth } from '@hooks/useAuth';
import { Query } from '@type/query';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

function AppContent() {
  useAuthStateListener();

  const [ready, setReady] = useState(false);
  const { data: session } = useAuth();

  const startApp = useCallback(async () => {
    await SplashScreen.preventAutoHideAsync();

    const fonts = [IconComponent.font];
    const fontAssets = fonts.map((font) => Font.loadAsync(font));
    const fetchAuth = queryClient.fetchQuery([Query.SESSION]);
    await Promise.all([...fontAssets, fetchAuth]);

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
            {session ? <RootNavigator /> : <AuthNavigator />}
          </NavigationContainer>
        ) : null}
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
