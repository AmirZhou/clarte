import { FetchedExample } from '../IpaInteractionWrapper';

interface ExampleItemProp {
  example: FetchedExample;
  isActive: boolean;
}

export default function ExampleItem({ example, isActive }: ExampleItemProp) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 text-white">
      <p className="text-xl font-semibold mb-2">{example.frenchEntry}</p>
      <p className="text-lg italic">{example.ipaNotation}</p>

      {example.s3AudioKeyExample && (
        <button
          className="mt-3 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-full flex items-center"
          onClick={() => {
            // Audio playback logic could be added here
            console.log(`Play audio for: ${example.s3AudioKeyExample}`);
          }}
        >
          <span className="mr-1">▶</span> Listen
        </button>
      )}
    </div>
  );
}
