import { supabase } from '@lib/supabase';

export const signIn = async (email: string, password: string): Promise<void> => {
  const authedUser = await supabase.auth.signIn({
    email,
    password,
  });

  if (authedUser.error) {
    throw new Error(authedUser.error.message);
  }
};

export const signUp = async (email: string, password: string): Promise<void> => {
  const authedUser = await supabase.auth.signUp({
    email,
    password,
  });

  if (authedUser.error) {
    throw new Error(authedUser.error.message);
  }
};

export const signOut = async (): Promise<void> => {
  const res = await supabase.auth.signOut();

  if (res.error) {
    throw new Error(res.error.message);
  }
};
