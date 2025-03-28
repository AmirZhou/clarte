import { useEffect } from 'react';
import createClientForBrowser from '@/utils/supabase/client';

function useAuthListener() {
  const supabase = createClientForBrowser();
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Handle auth changes
    });
    return () => subscription.unsubscribe();
  }, []);
}
