'use client';

import { ipaVowels } from '@/utils';
import IPAIcon from './IPAIcon';
import { useIPA } from '../context/IPAContext';
import IPADetails from './IPADetails';

export default function Vowels() {
  const { activeIPA, setActiveIPA } = useIPA();
  return (
    <>
      <div className="flex flex-col gap-6">
        <h2 className="font-bold text-4xl text-emerald-700">Vowels</h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-2xl">Oral-Vowels</h3>
            <div className="flex gap-4 flex-wrap">
              {ipaVowels.oral.map((vowel) => (
                <IPAIcon
                  key={vowel.name}
                  ipa={vowel}
                  onSelect={setActiveIPA}
                  isActive={activeIPA === vowel}
                />
              ))}
            </div>
            <IPADetails activeIPA={activeIPA} categoryIPAs={ipaVowels.oral} />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-2xl">Nasal</h3>
            <div className="flex gap-4 flex-wrap">
              {ipaVowels.nasal.map((vowel) => (
                <IPAIcon
                  key={vowel.name}
                  ipa={vowel}
                  onSelect={setActiveIPA}
                  isActive={activeIPA === vowel}
                />
              ))}
            </div>
            <IPADetails activeIPA={activeIPA} categoryIPAs={ipaVowels.nasal} />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-2xl">Semi</h3>
            <div className="flex gap-4 flex-wrap">
              {ipaVowels.semi.map((vowel) => (
                <IPAIcon
                  key={vowel.name}
                  ipa={vowel}
                  onSelect={setActiveIPA}
                  isActive={activeIPA === vowel}
                />
              ))}
            </div>
            <IPADetails activeIPA={activeIPA} categoryIPAs={ipaVowels.semi} />
          </div>
        </div>
      </div>
    </>
  );
}
