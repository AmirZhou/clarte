'use client';

import { IPA } from '@/types';
import IPASpellingExample from './IPASpellingExample';

interface IPADetailsProps {
  activeIPA: IPA | null;
  categoryIPAs: IPA[]; // if activeIPA not found in categoryIPAs, the component will not render
}

export default function IPADetails({
  activeIPA,
  categoryIPAs,
}: IPADetailsProps) {
  if (!activeIPA || !categoryIPAs.some((ipa) => ipa === activeIPA)) {
    return null;
  } // Don't render if no active IPA

  return (
    <div className="text-center w-full h-48 overflow-y-auto border rounded-md">
      <div className="flex flex-col gap-2 p-2 text-left">
        <h3 className="font-semibold text-gray-500 capitalize">
          {activeIPA.name}
        </h3>
        <p>Usually spell as 'xx' 'yy' 'zz'</p>
        <IPASpellingExample spell={'xx'} />
        <IPASpellingExample spell={'yy'} />
        <IPASpellingExample spell={'zz'} />
      </div>
    </div>
  );
}
