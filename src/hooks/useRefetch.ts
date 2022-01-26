import { useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAppState } from '@hooks/useAppState';

export const useRefetchOnRouteFocus = (refetch: () => void) => {
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );
};

export const useRefetchOnAppFocus = (refetch: () => void) => {
  const { appStateVisible } = useAppState();

  useEffect(() => {
    if (appStateVisible === 'active') {
      refetch();
    }
  }, [appStateVisible]);
};
