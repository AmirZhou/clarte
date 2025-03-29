import { useEffect, useState } from 'react';
import createClientForBrowser from '@/utils/supabase/client';
import { Session } from '@supabase/supabase-js';

export function useSupabaseSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClientForBrowser();
  // get session info happens locally, is this even an effect.
  useEffect(() => {
    const handleSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setIsLoading(false);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    };

    handleSession();
  }, []);

  return { session, isLoading };
}

// Ref:
// useEffect setup: When your component is added to the DOM, React will run your setup function. After every re-render with changed dependencies, React will first run the cleanup function (if you provided it) with the old values, and then run your setup function with the new values. After your component is removed from the DOM, React will run your cleanup function.
