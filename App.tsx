import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator, RootNavigator } from '@screens/index';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAuthenticated(!authenticated);
    }, 5000);
  }, [authenticated]);

  return (
    <SafeAreaProvider>
      <StatusBar style='auto' />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          {authenticated ? <RootNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
