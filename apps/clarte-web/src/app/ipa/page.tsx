// route:/ipa
import { Consonants, Vowels } from './components';

export default function Page() {
  return (
    <div className="w-full min-w-lg flex flex-col gap-16">
      <div>
        <Vowels />
      </div>
      <div>
        <Consonants />
      </div>
    </div>
  );
}
