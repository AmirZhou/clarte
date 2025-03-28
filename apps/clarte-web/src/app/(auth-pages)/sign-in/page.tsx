import { FormMessage, Message } from '@/components/forms/form-message';
import { SubmitButton } from '@/components/forms/SubmitButton';
import {
  signinWithGithubAction,
  signinWithGoogleAction,
} from '@/utils/actions';
import { Label } from '@/components/forms/Label';
import { Input } from '@/components/shared/input';
import Link from 'next/link';
import { signInAction } from '@/utils/actions';
import { LiaGithub } from 'react-icons/lia';
import { FaGithub } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';

export default async function SignIn(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className=" flex w-96 flex-col">
      {/* OAuth */}
      <h1 className="text-2xl font-medium">Log into your account</h1>
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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link className="text-xs text-link underline" href="/forgot-password">
            Forgot Password?
          </Link>
        </div>
        <Input
          type="password"
          className="border"
          name="password"
          placeholder="Your password"
          required
        />
        <SubmitButton
          pendingText="Signing In..."
          formAction={signInAction}
          variant="outline"
          className="border border-trinary-foreground bg-trinary "
        >
          Continue
        </SubmitButton>
        <FormMessage message={searchParams} />
      </form>
      <p className="mt-2 text-sm text-foreground">
        Don’t have an account?{' '}
        <Link className="font-medium text-link underline" href="/sign-up">
          Sign up
        </Link>
      </p>
    </div>
  );
}
