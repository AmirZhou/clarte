'use client';
import { useSupabaseSession } from '@/hooks/useAuth/useSupabaseSession';
import createClientForBrowser from '@/utils/supabase/client';
import { Button } from '@/components/shared/button';

export default function TestSession() {
  const supabase = createClientForBrowser();
  const session = useSupabaseSession();
  if (!session.session)
    return (
      <div className="ml-64 mt-32">
        <h1>not authenticated</h1>
        <div className="h-32 w-32 bg-chart-2"></div>
      </div>
    );
  return (
    <div className="ml-64 mt-32">
      <h1> Welcome, {session.session.user.email}</h1>
      <div className="h-32 w-32 bg-chart-2"></div>
      <Button variant={'outline'} onClick={() => supabase.auth.signOut()}>
        Sign Out
      </Button>
    </div>
  );
}
