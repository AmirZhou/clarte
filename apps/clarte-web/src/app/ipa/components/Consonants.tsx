import { SVGIcon } from '@/components/icons';
import { ipaConsonants } from '@/utils';

export default function Consonants() {
  return (
    <>
      <div className="flex flex-col gap-6">
        <h2 className="font-bold text-8xl">Consonants</h2>

        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-semibold text-2xl">Voiced</h3>
            <div className="flex gap-4">
              {ipaConsonants.voiced.map((vowel) => (
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
            <h3 className="font-semibold text-2xl">Voiceless</h3>
            <div className="flex gap-4">
              {ipaConsonants.voiceless.map((vowel) => (
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
