'use client';

import Link from 'next/link';
import { LoginButton } from './LoginButton';

interface NavBarProps {}

export default function NavBar() {
  return (
    <div className="fixed z-9 flex justify-end items-center pr-3 top-0 w-full h-10 bg-nav backdrop-blur-md">
      <form>
        <LoginButton>
          <Link href={'/sign-in'}>Login</Link>
        </LoginButton>
      </form>
    </div>
  );
}
