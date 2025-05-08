import { ReactNode } from 'react';
import { AdsPlaceHolder } from '@/components/layouts/ads';

interface AdsLayoutProps {
  children?: ReactNode;
}

export default function AdsLayout({ children }: AdsLayoutProps) {
  return (
    <>
      <div className="flex-1 flex justify-center gap-8 h-full">
        <div className="w-9/12">{children}</div>
        {/* <div className="ad-side border border-border overflow-hidden h-96 hidden lg:block rounded-md">
          <AdsPlaceHolder />
        </div> */}
      </div>
    </>
  );
}
