// route:/ipa
import { Consonants, Vowels } from './components';
import { IPAProvider } from './context/IPAContext';

export default function Page() {
  return (
    <IPAProvider>
      <div className="w-full min-w-lg flex flex-col gap-16">
        <div>
          <Vowels />
        </div>
        <div>
          <Consonants />
        </div>
      </div>
    </IPAProvider>
  );
}
