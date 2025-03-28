export default function IPASpellingExample({ spell }: { spell: string }) {
  return (
    <div className="w-full">
      <span className="text-emerald-800">Example: </span> <span>{spell}</span>
      <div className="pl-4">icon, example 1: audio 1</div>
      <div className="pl-4">icon, example 2: audio 1</div>
      <div className="pl-4">icon, example 3: audio 1</div>
    </div>
  );
}
