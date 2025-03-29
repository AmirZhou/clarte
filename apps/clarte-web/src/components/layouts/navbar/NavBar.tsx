'use client';

import Link from 'next/link';
import { LoginButton } from './LoginButton';
import { useSupabaseSession } from '@/hooks/useAuth/useSupabaseSession';
import Image from 'next/Image';
import createClientForBrowser from '@/utils/supabase/client';

interface NavBarProps {}

// dynamic disply that button, if session, display setting.

export default function NavBar() {
  const { session, isLoading } = useSupabaseSession();
  const supabase = createClientForBrowser();
  return (
    <div className="fixed z-9 flex justify-end items-center pr-3 top-0 w-full h-11 bg-nav backdrop-blur-md">
      {!session ? (
        <form>
          <LoginButton>
            <Link href={'/sign-in'}>Login</Link>
          </LoginButton>
        </form>
      ) : (
        <>
          <span className="mr-3 text-secondary-foreground">
            {session.user.email}
          </span>

          <Image
            width={32} // Set a fixed width
            height={32}
            src={session.user.user_metadata.avatar_url}
            alt="user themselves"
            onClick={() => {
              supabase.auth.signOut();
            }}
          />
        </>
      )}
    </div>
  );
}
