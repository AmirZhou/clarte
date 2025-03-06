import { SVGIcon } from '@/components/icons';
import { ipaVowels } from '@/utils';

export default function Vowels() {
  return (
    <>
      <h2>Vowels</h2>
      <div>
        <h3>Oral-Vowels</h3>
        <div className="flex">
          {ipaVowels.oral.map((vowel) => (
            <SVGIcon key={vowel.name} name={vowel.name} path={vowel.path} />
          ))}
        </div>
      </div>
      <div>
        <h3>Nasal</h3>
        <div className="flex">
          {ipaVowels.nasal.map((vowel) => (
            <SVGIcon key={vowel.name} name={vowel.name} path={vowel.path} />
          ))}
        </div>
      </div>
      <div>
        <h3>Semi</h3>
        <div className="flex">
          {ipaVowels.semi.map((vowel) => (
            <SVGIcon key={vowel.name} name={vowel.name} path={vowel.path} />
          ))}
        </div>
      </div>
    </>
  );
}
