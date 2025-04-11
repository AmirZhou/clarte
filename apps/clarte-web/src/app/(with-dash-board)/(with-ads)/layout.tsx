import { ReactNode } from 'react';
import { AdsPlaceHolder } from '@/components/layouts/ads';

interface AdsLayoutProps {
  children?: ReactNode;
}

export default function AdsLayout({ children }: AdsLayoutProps) {
  return (
    <>
      <div className="pt-36 pl-36  flex-1 flex items-center p-8 justify-start gap-8 relative h-full w-full ">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="z-40 self-start w-full lg:w-9/12">{children}</div>
        {/* <div className="ad-side border border-border overflow-hidden h-96 hidden lg:block rounded-md">
          <AdsPlaceHolder />
        </div> */}
      </div>
    </>
  );
}
