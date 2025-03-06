import { SVGIcon } from '@/components/icons';
import { ipaConsonants } from '@/utils';

export default function Consonants() {
  return (
    <>
      <h2>Consonants</h2>
      <div>
        <h3>Voiced</h3>
        <div className="flex">
          {ipaConsonants.voiced.map((consonant) => (
            <SVGIcon
              key={consonant.name}
              name={consonant.name}
              path={consonant.path}
            />
          ))}
        </div>
      </div>
      <div>
        <h3>Unvoiced</h3>
        <div className="flex">
          {ipaConsonants.voiceless.map((consonant) => (
            <SVGIcon
              key={consonant.name}
              name={consonant.name}
              path={consonant.path}
            />
          ))}
        </div>
      </div>
    </>
  );
}
