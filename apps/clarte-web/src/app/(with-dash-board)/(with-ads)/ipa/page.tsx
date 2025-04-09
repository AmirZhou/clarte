// route:/ipa
import { Consonants, Vowels } from './components';
import { IPAProvider } from './context/IPAContext';
import IPAInfo from './components/IPAInfo';

export default function Page() {
  return (
    <IPAProvider>
      <div className="border flex gap-16 w-full justify-center">
        <div className=" w-80 flex flex-col gap-4">
          <h2>French IPA Symbols</h2>
          <Vowels />
          <Consonants />
        </div>
        <IPAInfo />
      </div>
    </IPAProvider>
  );
}
