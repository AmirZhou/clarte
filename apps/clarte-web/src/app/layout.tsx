import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  weight: ['400', '700'], // Regular and Bold
  style: ['normal', 'italic'], // Normal and Italic
  subsets: ['latin'],
  variable: '--font-poppins',
});

const doulosSIL = localFont({
  src: '../fonts/DoulosSIL-Regular.woff2',
  display: 'swap',
  variable: '--font-doulos-sil',
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
    <html
      className={`min-h-screen ${poppins.variable} ${doulosSIL.variable}`}
      lang="en"
    >
      <body className="dark font-poppins min-h-screen flex flex-col relative ">
        {children}
      </body>
    </html>
  );
}
