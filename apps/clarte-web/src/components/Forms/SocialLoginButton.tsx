import { SubmitButton } from './SubmitButton';
import { type Provider } from '@supabase/supabase-js';
import { signInWith } from '@/utils/actions';
import { ReactNode } from 'react';

interface SocialLoginButtonProps {
  children?: ReactNode;
  className?: string;
  provider: Provider;
  variant?: 'default' | 'outline' | 'destructive' | 'ghost' | 'link';
}

export default function SocialLoginButton({
  className,
  provider,
  variant,
  children,
  ...props
}: SocialLoginButtonProps) {
  return (
    <form className="w-full">
      <SubmitButton
        className={className}
        formAction={signInWith(provider)}
        variant={variant}
        pendingText={`Signing in...`}
        {...props}
      >
        {children}
        <span className="ml-1">{provider}</span>
      </SubmitButton>
    </form>
  );
}
