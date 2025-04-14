'use server';

import { createClientForServer } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Provider } from '@supabase/supabase-js';
import { encodedRedirect } from '@/utils/encodedRedirect';
import { headers } from 'next/headers';

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

// why these two still functions, not promise already
const signinWithGoogleAction = signInWith('google');
const signinWithGithubAction = signInWith('github');

const signInAction = async (formData: FormData) => {
  const supabase = await createClientForServer();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect('error', '/sign-in', error.message);
  }

  return redirect('/');
};

export const signUpAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const supabase = await createClientForServer();
  const origin = (await headers()).get('origin');

  if (!email || !password) {
    return encodedRedirect(
      'error',
      '/sign-up',
      'Email and password are required'
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + ' ' + error.message);
    return encodedRedirect('error', '/sign-up', error.message);
  } else {
    return encodedRedirect(
      'success',
      '/sign-up',
      'Thanks for signing up! Please check your email for a verification link.'
    );
  }
};

const signOutAction = async () => {
  const supabase = await createClientForServer();
  await supabase.auth.signOut();
};

export {
  signInAction,
  signInWith,
  signinWithGoogleAction,
  signinWithGithubAction,
  signOutAction,
};
