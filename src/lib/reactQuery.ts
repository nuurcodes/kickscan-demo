import { QueryClient } from 'react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /*
         refetchOnWindowFocus is handled in useRefetch
         refetchOnMount is handled in useRefetch
      */
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: false,
    },
  },
});
