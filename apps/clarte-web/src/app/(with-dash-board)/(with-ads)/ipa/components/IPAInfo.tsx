import { IpaWithExamplesDto } from '@clarte/dto';

interface IPAInfoProp {
  selectedSymbol: IpaWithExamplesDto | null;
}

export default function IPAInfo({ selectedSymbol }: IPAInfoProp) {
  if (!selectedSymbol) {
    return (
      <div className="w-1/2 p-4 border border-gray-700 rounded-md">
        {/* Adjust width/styling */}
        <p className="text-gray-400">Click an IPA symbol to see details.</p>
      </div>
    );
  }
  return (
    <div className="w-1/2 p-4 border border-gray-700 rounded-md">
      <h3 className="text-3xl font-ipa mb-4">{selectedSymbol.symbol}</h3>
      <p className="text-lg mb-2">
        {selectedSymbol.description || 'No description available.'}
      </p>
      <h4 className="text-md font-semibold mt-4 mb-2">Examples:</h4>
      {selectedSymbol.dictionaryEntries &&
      selectedSymbol.dictionaryEntries.length > 0 ? (
        <ul className="list-disc list-inside">
          {selectedSymbol.dictionaryEntries.map((entry, index) => (
            <li key={index}>
              <span className="font-semibold">{entry.frenchEntry}</span>:
              {entry.ipaNotation}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No examples available.</p>
      )}
    </div>
  );
}
