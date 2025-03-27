import { FormMessage, Message } from '@/components/forms/form-message';

export default async function SignIn(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex w-96 flex-col">
      <h1 className="text-2xl font-medium">Log into your account</h1>
      <p className="text-secondary-foreground">Connect to week9 with:</p>
      


    </div>
  );
}
