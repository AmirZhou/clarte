'use client';

import { IpaWithoutExamplesDto } from '@clarte/dto';
import { useState, useMemo } from 'react';
import { SymbolDetailsCard } from './symbol-details/SymbolDetailsCard';

interface IpaInteractionWrapperProps {
  symbolsData: IpaWithoutExamplesDto[];
}

export interface FetchedExample {
  id: number;
  frenchEntry: string;
  ipaNotation: string;
  s3AudioKeyExample?: string;
}

export default function IpaInteractionWrapper({
  symbolsData,
}: IpaInteractionWrapperProps) {
  const [selectedSymbol, setSelectedSymbol] =
    useState<IpaWithoutExamplesDto | null>(null);
  const [examples, setExamples] = useState<FetchedExample[]>([]);
  const [isLoadingExamples, setIsLoadingExamples] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSymbolClick = async (symbol: IpaWithoutExamplesDto) => {
    if (selectedSymbol?.id === symbol.id) {
      // Deselect the symbol
      setSelectedSymbol(null);
      // Only clear examples if it’s not already empty
      if (examples.length > 0) {
        setExamples([]);
      }
      return;
    }

    // Select a new symbol
    setSelectedSymbol(symbol);
    setIsLoadingExamples(true);
    setErrorMessage(null);
    setExamples([]); // Clear examples to indicate loading

    try {
      const proxyUrl = `/web-api/proxy/ipa-examples/${encodeURIComponent(symbol.symbol)}?limit=24`;
      console.log(`[Client Fetch] Fetching examples from: ${proxyUrl}`);
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch examples: ${response.statusText}`);
      }
      const fetchedExamples: FetchedExample[] = await response.json();
      console.log('Fetched Examples:', fetchedExamples);
      setExamples(fetchedExamples);
      console.log(
        'Set examples to:',
        fetchedExamples,
        'Reference:',
        fetchedExamples
      );
    } catch (error: any) {
      console.error('[Client Fetch] Error fetching examples:', error);
      setErrorMessage(error.message || 'Failed to load examples.');
    } finally {
      setIsLoadingExamples(false);
    }
  };

  // Memoize examples to stabilize the prop passed to SymbolDetailsCard
  const stableExamples = useMemo(() => examples, [examples]);

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
        {/* Display details for the selected symbol */}
        {selectedSymbol && (
          <SymbolDetailsCard
            symbolData={selectedSymbol}
            examples={stableExamples} // Pass the memoized examples
            isLoadingExamples={isLoadingExamples}
            errorMessage={errorMessage}
          />
        )}
      </div>
    </div>
  );
}
