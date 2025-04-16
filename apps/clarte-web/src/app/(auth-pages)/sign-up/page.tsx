import { FormMessage, Message } from '@/components/Forms/form-message';
import { SubmitButton } from '@/components/Forms/SubmitButton';
import {
  signinWithGithubAction,
  signinWithGoogleAction,
} from '@/utils/actions';
import { Label } from '@/components/Forms/Label';
import { Input } from '@/components/shared/input';
import Link from 'next/link';
import { signUpAction } from '@/utils/actions';
import { FaGithub } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';

export default async function SignUp(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex w-96 flex-col">
      {/* OAuth */}
      <h1 className="text-2xl font-medium">Create your free account</h1>
      <p className="text-secondary-foreground">Connect to Clarte with:</p>

      <form className="w-full">
        <SubmitButton
          formAction={signinWithGithubAction}
          className="mt-4 w-full"
          pendingText="Signing In..."
          variant="default"
        >
          <FaGithub className="text-xl" />
          <span className="ml-1">GitHub</span>
        </SubmitButton>
      </form>
      <form className="w-full">
        <SubmitButton
          formAction={signinWithGoogleAction}
          className="mt-3 w-full"
          pendingText="Signing In..."
          variant="default"
        >
          <FcGoogle className="text-xl" />
          <span className="ml-1">Google</span>
        </SubmitButton>
      </form>

      {/* Divider */}
      <div className="mt-4 flex items-center gap-4">
        <div className="flex-1 border-t border-secondary-foreground"></div>
        <p className="text-sm text-secondary-foreground">
          Or continue with Email
        </p>
        <div className="flex-1 border-t border-secondary-foreground"></div>
      </div>

      {/* Email */}
      <form className="mt-8 flex flex-col gap-2 [&>input]:mb-3">
        <Label htmlFor="email">Email</Label>
        <Input
          className="border border-trinary-foreground bg-trinar"
          name="email"
          placeholder="you@example.com"
          required
        />
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          className="border"
          name="password"
          placeholder="Your password"
          required
        />
        <SubmitButton
          pendingText="Signing In..."
          formAction={signUpAction}
          variant="outline"
          className="border border-trinary-foreground bg-trinary "
        >
          Continue
        </SubmitButton>
        <FormMessage message={searchParams} />
      </form>
      <p className="text-[10px] text-secondary-foreground my-1.5">
        By creating an account you agree to the{' '}
        <span className="underline">Terms of Service</span> and our{' '}
        <span className="underline">Privacy Policy</span>. We'll occasionally
        send you emails about news, products, and services; you can opt-out
        anytime.
      </p>
      <p className="mt-2 text text-sm text-foreground">
        Already have an account?{' '}
        <Link className="font-medium text-link underline" href="/sign-in">
          Sign in
        </Link>
      </p>
    </div>
  );
}
