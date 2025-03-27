import { Button } from '@/components/shared/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full items-center">
      {/* left */}
      <div className="flex h-full flex-col items-center justify-center gap-8 md:w-32 lg:w-[576px]">
        <h1 className="font-poppins text-2xl font-semibold text-green-700">
          Week 9
        </h1>
      </div>
      {/* right */}
      <div className="relative flex h-full flex-1 flex-col items-center justify-center border-l ">
        <Button
          asChild
          size="sm"
          variant="outline"
          className="absolute left-4 top-4 w-20"
        >
          <Link href="/week-9" className="flex items-center gap-1">
            <ArrowLeft size={16} />
            <span>Back</span>
          </Link>
        </Button>
        {children}
      </div>
    </div>
  );
}
