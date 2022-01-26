import { useRef, useState, useEffect } from 'react';
import { AppState } from 'react-native';

export const useAppState = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      // @ts-ignore
      subscription?.remove();
    };
  }, []);

  return { appStateVisible };
};
