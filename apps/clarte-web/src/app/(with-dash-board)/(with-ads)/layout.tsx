import { ReactNode } from 'react';
import { AdsPlaceHolder } from '@/components/layouts/ads';

interface AdsLayoutProps {
  children?: ReactNode;
}

export default function AdsLayout({ children }: AdsLayoutProps) {
  return (
    <>
      <div className="pt-36 pl-48 flex-1 flex items-center justify-start gap-8 relative h-full w-full border">
        <div className="z-40 self-start w-full lg:w-9/12">{children}</div>
        {/* <div className="ad-side border border-border overflow-hidden h-96 hidden lg:block rounded-md">
          <AdsPlaceHolder />
        </div> */}
      </div>
    </>
  );
}
