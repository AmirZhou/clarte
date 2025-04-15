'use client';

import IPAInfo from './IPAInfo';
import { IPASymbolIcon } from '@/components/icons';
import { IpaWithExamplesDto } from '@clarte/dto';
import { useState } from 'react';

interface IpaInteractionWrapperProps {
  symbolsData: IpaWithExamplesDto[];
}

export default function IpaInteractionWrapper({
  symbolsData,
}: IpaInteractionWrapperProps) {
  const [selectedSymbolData, setSelectedSymbolData] =
    useState<IpaWithExamplesDto | null>(null);

  const handleSymbolClick = (symbonInfo: IpaWithExamplesDto) => {
    setSelectedSymbolData(symbonInfo);
  };

  return (
    <div className="flex ">
      {/* Section for the icons */}
      <div className="w-1/2 flex flex-col gap-4">
        {' '}
        {/* Or adjust layout as needed */}
        <h2 className="text-2xl">French IPA Chart</h2>
        <div className="ipa-full-chart flex flex-wrap gap-2 justify-center">
          {symbolsData.map((symbolInfo) => (
            <IPASymbolIcon
              key={symbolInfo.id}
              symbol={symbolInfo.symbol}
              onClick={() => handleSymbolClick(symbolInfo)} // Attach the click handler
              // Optionally add styling for selected state
              className={
                selectedSymbolData?.id === symbolInfo.id
                  ? 'ring-2 ring-emerald-400'
                  : ''
              }
            />
          ))}
        </div>
      </div>

      <IPAInfo selectedSymbol={selectedSymbolData} />
    </div>
  );
}
