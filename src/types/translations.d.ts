export interface Translations {
  NotFound: {
    title: string;
    description: string;
  };
  Home: {
    title: string;
    description: string;
  };
}

export type TranslationKeys<T> = keyof T;
