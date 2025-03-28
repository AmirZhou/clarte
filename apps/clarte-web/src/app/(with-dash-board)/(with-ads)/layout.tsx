import { ReactNode } from 'react';
import { AdsPlaceHolder } from '@/components/layouts/ads';

interface AdsLayoutProps {
  children?: ReactNode;
}

export default function AdsLayout({ children }: AdsLayoutProps) {
  return (
    <>
      <div className="pt-36 pl-36 relative flex-1 flex items-center p-8 justify-start gap-8 ">
        <div className="ad-side border border-border h-96 hidden 2xl:block rounded-md ">
          <AdsPlaceHolder />
        </div>
        <div className="self-start w-full lg:w-9/12">{children}</div>
        <div className="ad-side border border-border overflow-hidden h-96 hidden lg:block rounded-md">
          <AdsPlaceHolder />
        </div>
      </div>
    </>
  );
}
