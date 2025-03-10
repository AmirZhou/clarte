import { ipaVowels } from '@/utils';
import IPAIcon from './IPAIcon';

export default function Vowels() {
  return (
    <>
      <div className="flex flex-col gap-6">
        <h2 className="font-bold text-8xl">Vowels</h2>

        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-semibold text-2xl">Oral-Vowels</h3>
            <div className="flex gap-4">
              {ipaVowels.oral.map((vowel) => (
                <IPAIcon key={vowel.name} ipa={vowel} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-2xl">Nasal</h3>
            <div className="flex gap-4">
              {ipaVowels.nasal.map((vowel) => (
                <IPAIcon key={vowel.name} ipa={vowel} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-2xl">Semi</h3>
            <div className="flex gap-4">
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
