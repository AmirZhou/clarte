'use client';

import { IpaWithoutExamplesDto } from '@clarte/dto';
import { useState, useEffect } from 'react';
import { SymbolDetailsCard } from './symbol-details/SymbolDetailsCard';

interface IpaInteractionWrapperProps {
  symbolsData: IpaWithoutExamplesDto[];
}

// i got this interface here, this may be used in its nested components
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
    if (selectedSymbol?.id == symbol.id) {
      // Deselect or do nothing
      // set dedounce here
      setSelectedSymbol(null);
      setExamples([]);
      return;
    }

    setSelectedSymbol(symbol);
    setIsLoadingExamples(true);
    setErrorMessage(null);
    setExamples([]);

    try {
      // Construct the URL using the Ingress path /api/...

      const proxyUrl = `/web-api/proxy/ipa-examples/${encodeURIComponent(symbol.symbol)}?limit=24`;
      console.log(`[Client Fetch] Fetching examples from: ${proxyUrl}`);
      const response = await fetch(proxyUrl); // Fetch via Ingress
      if (!response.ok) {
        throw new Error(`Failed to fetch examples: ${response.statusText}`);
      }
      const fetchedExamples: FetchedExample[] = await response.json();
      console.log('fetched Example');
      console.log(fetchedExamples);
      setExamples(fetchedExamples);
    } catch (error: any) {
      console.error('[Client Fetch] Error fetching examples:', error);
      setErrorMessage(error.message || 'Failed to load examples.');
    } finally {
      setIsLoadingExamples(false);
    }
  };

  return (
    <div className="flex gap-8 border">
      <div className="flex flex-col gap-4">
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

      <div>
        {/* Display details for the selected symbol */}
        {selectedSymbol && (
          <SymbolDetailsCard
            symbolData={selectedSymbol}
            examples={examples}
            isLoadingExamples={isLoadingExamples}
            errorMessage={errorMessage}
          />
        )}
      </div>
    </div>
  );
}
