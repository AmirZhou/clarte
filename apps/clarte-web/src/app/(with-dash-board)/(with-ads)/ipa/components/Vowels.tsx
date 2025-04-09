'use client';

import { ipaVowels } from '@/utils';
import IPAIcon from './IPAIcon';
import { useIPA } from '../context/IPAContext';

export default function Vowels() {
  const { activeIPA, setActiveIPA } = useIPA();
  return (
    <>
      <div className="flex gap-4 flex-wrap">
        {[...ipaVowels.oral, ...ipaVowels.nasal, ...ipaVowels.semi].map(
          (vowel) => (
            <IPAIcon
              key={vowel.name}
              ipa={vowel}
              onSelect={setActiveIPA}
              isActive={activeIPA === vowel}
            />
          )
        )}
      </div>
    </>
  );
}
