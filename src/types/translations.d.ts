export interface Translations {
  NotFound: {
    title: string;
    description: string;
  };
  Home: {
    title: string;
    description: string;
    variable: string;
    success: string;
    error: string;
  };
}

export type TranslationKeys<T> = keyof T;
