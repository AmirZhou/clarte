import { createClientForServer } from '@/utils/supabase/server';
import { signOutAction } from '@/utils/actions';
import Link from 'next/link';

export default async function Home() {
  // const supabase = await createClientForServer();

  // const session = await supabase.auth.getUser();

  // if (!session.data.user)
  //   return (
  //     <div className="flex flex-col items-center justify-center h-screen gap-4">
  //       <h1 className="text-4xl font-bold">Not Authenticated</h1>
  //       <Link className="btn" href="/auth">
  //         Sign in
  //       </Link>
  //     </div>
  //   );

  // const {
  //   data: {
  //     user: { user_metadata, app_metadata },
  //   },
  // } = session;

  // const { name, email, user_name, avatar_url } = user_metadata;

  // const userName = user_name ? `@${user_name}` : 'User Name Not Set';

  // console.log(session);

  return <div>Landing Page</div>;
}
