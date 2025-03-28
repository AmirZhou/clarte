import { signOutAction } from '@/utils/actions';
import { createClientForServer } from '@/utils/supabase/server';
import { Button } from '@/components/shared/button';
import Link from 'next/link';

export default async function HeaderAuth() {
  const supabase = await createClientForServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center justify-end gap-4">
      Hello, {user.email}!
      <form action={signOutAction}>
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex items-center justify-end gap-2">
      <Button asChild variant="outline" size="sm">
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild variant="default" size="sm">
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
