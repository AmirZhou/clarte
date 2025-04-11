// route:/ipa
import { Consonants, Vowels } from './components';
import { IPAProvider } from './context/IPAContext';
import IPAInfo from './components/IPAInfo';

export default function Page() {
  return (
    <IPAProvider>
      <div className="flex gap-16 w-full justify-center">
        <div className=" w-80 flex flex-col gap-4">
          <h2 className="text-2xl">French IPA Chart</h2>
          {/* i need a api call, return me the entire api data I needed to populate this page */}
          {/* then I map the returned DTO, seperate them with vowels and consonants, then populate teh following two components */}
          <Vowels />
          <Consonants />
        </div>
        <IPAInfo />
      </div>
    </IPAProvider>
  );
}
