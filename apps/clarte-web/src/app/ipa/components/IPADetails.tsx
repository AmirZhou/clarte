'use client';

import { IPA } from '@/types';

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
    <div className="text-center w-full h-16 border rounded-md">
      {activeIPA.name}
    </div>
  );
}
