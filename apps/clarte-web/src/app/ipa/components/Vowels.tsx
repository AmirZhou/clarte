import { SVGIcon } from '@/components/icons';
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
                <div
                  key={vowel.name}
                  className="flex justify-center items-center rounded-full bg-red-300 h-16 w-16"
                >
                  <SVGIcon
                    className="w-6 h-6 stroke-0 fill-emerald-700"
                    name={vowel.name}
                    path={vowel.path}
                    viewBox={vowel.viewbox}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-2xl">Semi</h3>
            <div className="flex gap-4">
              {ipaVowels.semi.map((vowel) => (
                <div
                  key={vowel.name}
                  className="flex justify-center items-center rounded-full bg-red-300 h-16 w-16"
                >
                  <SVGIcon
                    className="w-6 h-6 stroke-0 fill-emerald-700"
                    name={vowel.name}
                    path={vowel.path}
                    viewBox={vowel.viewbox}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
