'use server';

import { createClientForServer } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Provider } from '@supabase/supabase-js';

const signInWith = (provider: Provider) => async () => {
  const supabase = await createClientForServer();

  const auth_callback_url = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: auth_callback_url,
    },
  });

  if (error) {
    console.log(error);
  }

  if (data.url) {
    redirect(data.url);
  } else {
    console.log('URL is null, skipping...');
  }
};

const signinWithGoogle = signInWith('google');
const signinWithGithub = signInWith('github');
const signOut = async () => {
  const supabase = await createClientForServer();
  await supabase.auth.signOut();
};

export { signinWithGoogle, signinWithGithub, signOut };
