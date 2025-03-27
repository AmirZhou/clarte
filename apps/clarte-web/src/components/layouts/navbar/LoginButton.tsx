import { Button } from '@/components/shared/button';
import { type ComponentProps } from 'react';

interface LoginButtonProps extends ComponentProps<typeof Button> {}

export function LoginButton({ children, ...props }: LoginButtonProps) {
  return (
    <Button asChild type="submit" variant={'login'} className="h-7 " {...props}>
      {children}
    </Button>
  );
}
