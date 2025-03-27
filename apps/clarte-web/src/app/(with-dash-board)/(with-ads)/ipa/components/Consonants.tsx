'use client';
import { ipaConsonants } from '@/utils';
import IPAIcon from './IPAIcon';
import { useIPA } from '../context/IPAContext';
import IPADetails from './IPADetails';

export default function Consonants() {
  const { activeIPA, setActiveIPA } = useIPA();
  return (
    <>
      <div className="flex flex-col gap-6">
        <h2 className="font-bold text-4xl text-emerald-600">Consonants</h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-2xl">Voiced</h3>
            <div className="flex gap-4 flex-wrap">
              {ipaConsonants.voiced.map((voiced) => (
                <IPAIcon
                  key={voiced.name}
                  ipa={voiced}
                  onSelect={setActiveIPA}
                  isActive={activeIPA === voiced}
                />
              ))}
            </div>
            <IPADetails
              activeIPA={activeIPA}
              categoryIPAs={ipaConsonants.voiced}
            />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-2xl">Voiceless</h3>
            <div className="flex gap-4 flex-wrap">
              {ipaConsonants.voiceless.map((voiceless) => (
                <IPAIcon
                  key={voiceless.name}
                  ipa={voiceless}
                  onSelect={setActiveIPA}
                  isActive={activeIPA === voiceless}
                />
              ))}
            </div>
            <IPADetails
              activeIPA={activeIPA}
              categoryIPAs={ipaConsonants.voiceless}
            />
          </div>
        </div>
      </div>
    </>
  );
}
