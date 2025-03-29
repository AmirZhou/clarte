import SVGIcon from '@/components/icons/SVGIcon';

interface CategoryProps {
  categoryName: string;
}

export default function Category({ categoryName }: CategoryProps) {
  return (
    <div className="flex gap-4">
      <SVGIcon
        path="M10 4L7 20M17 4L14 20M5 8H20M4 16H19"
        className="text-blue-500 w-4"
      />
      <span className="w-16">{categoryName}</span>
    </div>
  );
}
