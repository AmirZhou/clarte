import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layouts/sidebar';

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
        <div className="flex items-center justify-center h-screen p-8">
          {children}
        </div>
      </body>
    </html>
  );
}
