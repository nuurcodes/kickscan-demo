import { useEffect } from 'react';
import { supabase } from '@lib/supabase';
import { queryClient } from '@lib/reactQuery';
import { Query } from '@type/query';

export function useAuthStateListener() {
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      switch (event) {
        case 'SIGNED_IN':
          return queryClient.setQueryData([Query.SESSION], session);
        case 'SIGNED_OUT':
          return queryClient.setQueryData([Query.SESSION], session);
        case 'USER_UPDATED':
          return queryClient.setQueryData([Query.SESSION], session);
        case 'USER_DELETED':
          return queryClient.setQueryData([Query.SESSION], session);
        case 'PASSWORD_RECOVERY':
          // TODO: handle password recovery
          return console.log('password recovery');
        default:
          return undefined;
      }
    });
  }, []);
}
