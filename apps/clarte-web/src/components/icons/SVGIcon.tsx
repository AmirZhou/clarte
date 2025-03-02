'use client';
import React, { useRef } from 'react';
import { cn } from '@/utils/cn';

interface SVGIconProps extends React.ComponentProps<'svg'> {
  path: string;
  viewBox?: string;
}

export default function SVGIcon({ className, ref, ...props }: SVGIconProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <svg
      ref={ref || svgRef} // use passed ref if available
      className={cn(
        'stroke-linecap-round stroke-linejoin-round h-6 w-6 stroke-current stroke-[1.5]',
        className
      )}
      viewBox={props.viewBox || '0 0 24 24'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d={props.path} />
    </svg>
  );
}

SVGIcon.displayName = 'SVGIcon';
