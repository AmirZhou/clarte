import { ipaConsonants } from '@/utils';
import IPAIcon from './IPAIcon';

export default function Consonants() {
  return (
    <>
      <div className="flex flex-col gap-6">
        <h2 className="font-bold text-8xl">Consonants</h2>

        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-semibold text-2xl">Voiced</h3>
            <div className="flex gap-4">
              {ipaConsonants.voiced.map((voiced) => (
                <IPAIcon key={voiced.name} ipa={voiced} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-2xl">Voiceless</h3>
            <div className="flex gap-4">
              {ipaConsonants.voiceless.map((voiceless) => (
                <IPAIcon key={voiceless.name} ipa={voiceless} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
