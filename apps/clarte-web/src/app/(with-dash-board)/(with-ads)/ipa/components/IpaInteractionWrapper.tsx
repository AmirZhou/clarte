// IpaInteractionWrapper.tsx
'use client';

import { IpaWithoutExamplesDto } from '@clarte/dto';
import { useState, useEffect, useMemo } from 'react'; // Import useMemo
import { SymbolDetailsCard } from './symbol-details/SymbolDetailsCard'; // Assuming this path

export interface FetchedExample {
  id: number;
  frenchEntry: string;
  ipaNotation: string;
  s3AudioKeyExample?: string;
}

interface IpaInteractionWrapperProps {
  symbolsData: IpaWithoutExamplesDto[];
}

export default function IpaInteractionWrapper({
  symbolsData,
}: IpaInteractionWrapperProps) {
  const [selectedSymbol, setSelectedSymbol] =
    useState<IpaWithoutExamplesDto | null>(null);
  // This state holds the raw fetched examples
  const [rawExamples, setRawExamples] = useState<FetchedExample[]>([]);
  const [isLoadingExamples, setIsLoadingExamples] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Memoize the examples array to ensure its reference is stable
  // unless rawExamples actually changes.
  const examples = useMemo(() => rawExamples, [rawExamples]);

  const handleSymbolClick = async (symbol: IpaWithoutExamplesDto) => {
    if (selectedSymbol?.id === symbol.id) {
      setSelectedSymbol(null);
      setRawExamples([]); // Reset raw examples
      return;
    }

    setSelectedSymbol(symbol);
    setIsLoadingExamples(true);
    setErrorMessage(null);
    setRawExamples([]); // Reset raw examples, which will pass an empty array down

    try {
      const proxyUrl = `/web-api/proxy/ipa-examples/${encodeURIComponent(symbol.symbol)}?limit=24`;
      console.log(`[Client Fetch] Fetching examples from: ${proxyUrl}`);
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch examples: ${response.statusText}`);
      }
      const fetchedExamplesData: FetchedExample[] = await response.json();
      console.log('Fetched Examples Data:', fetchedExamplesData);
      setRawExamples(fetchedExamplesData); // Update raw examples
    } catch (error: any) {
      console.error('[Client Fetch] Error fetching examples:', error);
      setErrorMessage(error.message || 'Failed to load examples.');
    } finally {
      setIsLoadingExamples(false);
    }
  };

  return (
    <div className="flex gap-8 mt-32">
      <div className="flex flex-col flex-1 gap-4">
        <h2>IPA Symbols</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {symbolsData.map((symbol) => (
            <button
              key={symbol.id}
              onClick={() => handleSymbolClick(symbol)}
              style={{
                padding: '10px',
                border:
                  selectedSymbol?.id === symbol.id
                    ? '2px solid blue'
                    : '1px solid grey',
                cursor: 'pointer',
              }}
            >
              {symbol.symbol}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex justify-center">
        {selectedSymbol && (
          <SymbolDetailsCard
            symbolData={selectedSymbol}
            examples={examples} // Pass the memoized examples
            isLoadingExamples={isLoadingExamples}
            errorMessage={errorMessage}
          />
        )}
      </div>
    </div>
  );
}
