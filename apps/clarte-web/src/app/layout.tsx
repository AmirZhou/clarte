import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layouts/sidebar';
import { AdsPlaceHolder } from '@/components/layouts/ads';

const poppins = Poppins({
  weight: ['400', '700'], // Regular and Bold
  style: ['normal', 'italic'], // Normal and Italic
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Clarte',
  description: 'Clarte is a French learning app.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // This is the recommended way to use the font, but what's the difference
    <html className={poppins.className} lang="en">
      <body className="flex">
        <Sidebar />
        <div className="flex-1 border flex items-center p-8 justify-start gap-8 overflow-x-hidden ">
          {/* the following two ad div should be disabled on screen small */}
          <div className="ad-side border h-96 hidden 2xl:block rounded-md ">
            <AdsPlaceHolder />
          </div>
          <div className="self-start w-full lg:w-9/12 ">{children}</div>
          <div className="ad-side border h-96 hidden lg:block rounded-md">
            <AdsPlaceHolder />
          </div>
        </div>
      </body>
    </html>
  );
}
