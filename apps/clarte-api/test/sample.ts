function parseIpa(ipa: string): string[] {
  return [...ipa.replace(/^\/|\/$/g, '')];
}

const result = parseIpa('/kɔ̃stityʁɛ/');

console.log(result);

// Import the JSON data.
// Thanks to resolveJsonModule and esModuleInterop, TypeScript treats this
// as the default export of the JSON module.
import * as jsonDataUntyped from './fr_FR.json';

type PhoneticMap = Record<string, string>;

interface LanguageData {
  [locale: string]: PhoneticMap;
}
const jsonData = jsonDataUntyped as LanguageData;

const frenchPhonetics: PhoneticMap | undefined = jsonData.fr_FR;

if (frenchPhonetics) {
  console.log('French Phonetic Map:', frenchPhonetics);
  console.log("Phonetic for 'à ce point':", frenchPhonetics['à ce point']); // Example access
  console.log(
    "Phonetic for 'à aucun moment':",
    frenchPhonetics['à aucun moment'],
  );
} else {
  console.error('Could not find fr_FR data in the JSON.');
}
