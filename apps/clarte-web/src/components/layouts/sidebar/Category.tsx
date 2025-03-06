import SVGIcon from '@/components/icons/SVGIcon';

export default function Category() {
  return (
    <div className="flex gap-4">
      <SVGIcon
        path="M10 4L7 20M17 4L14 20M5 8H20M4 16H19"
        className="text-blue-500 w-4"
      />
      <span className="w-16">IPAs</span>
    </div>
  );
}
