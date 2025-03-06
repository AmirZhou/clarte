import SVGIcon from '@/components/icons/SVGIcon';
import { b, d } from '@/utils/ipaPath';

export default function Home() {
  return (
    <div className="border w-7/12 min-w-lg">
      <h1 className="font-semibold">Home</h1>
      <SVGIcon path={d.path} className="text-blue-500" />
      {/* <p className="text-clarte">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis saepe,
        maiores mollitia voluptate dolores, temporibus nemo veritatis sit ipsum
        quam alias eius nobis minus. Eius nulla pariatur aspernatur quisquam
        autem.
      </p> */}
    </div>
  );
}
