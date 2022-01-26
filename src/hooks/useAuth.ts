import { Query } from '@type/query';
import { useQuery } from 'react-query';
import { supabase } from '@lib/supabase';
import { Session } from '@supabase/supabase-js';

export function useAuth() {
  return useQuery<Session | null, Error>([Query.SESSION], async () => {
    return supabase.auth.session();
  });
}
