export interface LanguageData {
  [word: string]: string;
}

export interface LanguageJson {
  [locale: string]: LanguageData;
}
