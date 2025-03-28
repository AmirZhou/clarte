'use client';
import { signinWithGoogleAction, signinWithGithubAction } from '@/utils/actions';
import React from 'react';

const AuthForm = () => {
  return (
    <form className="flex flex-col gap-2">
      <button className="btn" formAction={signinWithGoogleAction}>
        Sign in with Google
      </button>
      <button className="btn" formAction={signinWithGithubAction}>
        Sign in with Github
      </button>
    </form>
  );
};

export default AuthForm;
