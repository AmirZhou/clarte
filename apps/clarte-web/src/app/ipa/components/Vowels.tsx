import { ipaVowels } from '@/utils';
import IPAIcon from './IPAIcon';

export default function Vowels() {
  return (
    <>
      <div className="flex flex-col gap-6">
        <h2 className="font-bold text-4xl text-emerald-700">Vowels</h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-2xl">Oral-Vowels</h3>
            <div className="flex gap-4 flex-wrap">
              {ipaVowels.oral.map((vowel) => (
                <IPAIcon key={vowel.name} ipa={vowel} />
              ))}
            </div>
            <div className="text-center w-full h-16 border rounded-md">
              placeholder for IPA explanation
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-2xl">Nasal</h3>
            <div className="flex gap-4 flex-wrap">
              {ipaVowels.nasal.map((vowel) => (
                <IPAIcon key={vowel.name} ipa={vowel} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-2xl">Semi</h3>
            <div className="flex gap-4 flex-wrap">
              {ipaVowels.semi.map((vowel) => (
                <IPAIcon key={vowel.name} ipa={vowel} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
