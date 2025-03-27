'use client';

import { ComponentProps, ComponentRef } from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
);

interface LabelProps
  extends VariantProps<typeof labelVariants>,
    ComponentProps<typeof LabelPrimitive.Root> {
  ref?: React.Ref<ComponentRef<typeof LabelPrimitive.Root>>;
}

const Label = ({ className, ref, ...props }: LabelProps) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
);

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
