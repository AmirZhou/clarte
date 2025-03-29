import SVGIcon from '@/components/icons/SVGIcon';
import Category from '@/components/layouts/sidebar/Category';
import { logoPath } from '@/utils/logoPath';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="fixed left-0 top-0 bg-background z-9 h-full flex flex-col items-start pl-1 pr-4 pt-2 border-r border-border ">
      <Link href={'/'} className="mb-1">
        <div className="flex gap-4">
          <SVGIcon
            path={logoPath.path}
            className="stroke-3 stroke-emerald-600"
            viewBox="0 0 84 62"
          />
          <span>Clarte.dev</span>
        </div>
      </Link>
      <Link href={'/ipa'}>
        <Category categoryName="IPAs" />
      </Link>
      <Link href={'/testSession'}>
        <Category categoryName="TestAuth" />
      </Link>
    </div>
  );
}
