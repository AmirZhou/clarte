'use client';
import { ipaConsonants } from '@/utils';
import IPAIcon from './IPAIcon';
import { useIPA } from '../context/IPAContext';

export default function Consonants() {
  const { activeIPA, setActiveIPA } = useIPA();
  return (
    <>
      <div className="flex gap-4 flex-wrap">
        {[...ipaConsonants.voiced, ...ipaConsonants.voiceless].map((c) => (
          <IPAIcon
            key={c.name}
            ipa={c}
            onSelect={setActiveIPA}
            isActive={activeIPA === c}
          />
        ))}
      </div>
    </>
  );
}
