'use client';

import { IpaWithoutExamplesDto } from '@clarte/dto';
import { useState, useEffect } from 'react';

interface IpaInteractionWrapperProps {
  symbolsData: IpaWithoutExamplesDto[];
}

interface FetchedExample {
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
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
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
      setError(error.message || 'Failed to load examples.');
    } finally {
      setIsLoadingExamples(false);
    }
  };

  return (
    <div>
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

      <hr style={{ margin: '20px 0' }} />

      {/* Display details for the selected symbol */}
      {selectedSymbol && (
        <div>
          <h3>Details for: {selectedSymbol.symbol}</h3>

          <h4>Examples:</h4>
          {isLoadingExamples && <p>Loading examples...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          {!isLoadingExamples && !error && examples.length === 0 && (
            <p>No examples found or loaded.</p>
          )}
          {!isLoadingExamples && !error && examples.length > 0 && (
            <ul>
              {examples.map((example) => (
                <li key={example.id}>
                  {example.frenchEntry}
                  {example.ipaNotation}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
