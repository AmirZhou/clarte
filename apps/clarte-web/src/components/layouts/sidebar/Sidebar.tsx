import SVGIcon from '@/components/icons/SVGIcon';
import Category from '@/components/layouts/sidebar/Category';
import { logoPath } from '@/utils/logoPath';

export default function Sidebar() {
  return (
    <div className="sidebar h-full flex flex-col items-center pl-1 pr-4 pt-2 border-r">
      <div className="flex gap-4">
        <SVGIcon
          path={logoPath.path}
          className="stroke-3 stroke-emerald-600"
          viewBox="0 0 84 62"
        />
        <span>Clarte.ai</span>
      </div>
      <Category />
    </div>
  );
}
