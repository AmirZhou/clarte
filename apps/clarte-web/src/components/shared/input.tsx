import * as React from 'react';
import { cn } from '@/utils/cn';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.RefObject<HTMLInputElement>;
}

const Input = ({ className, type, ref, ...props }: InputProps) => {
  return (
    <input
      type={type}
      className={cn(
        'border-trinary-foreground bg-trinary focus-visible:border-secondary-foreground focus-visible:ring-trinary focus-visible:outline-none placeholder:text-muted-foreground focus-visible:ring-4  flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-trinary file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 ',
        className
      )}
      {...props}
    />
  );
};

Input.displayName = 'Input';

export { Input };
