import type { languages } from "@/data/languages";

/** Language code keys from the supported languages map */
export type LanguageCode = keyof typeof languages;

/** MyMemory API response shape for get request */
export interface MyMemoryTranslationResponse {
  responseData: {
    translatedText: string;
    match: number;
  };
  responseDetails: string;
  responseStatus: number;
  responderId: string;
  matches: Array<{
    id: string;
    segment: string;
    translation: string;
    quality: string;
    reference?: string;
    match: number;
  }>;
}

/** Props for the start screen */
export interface TranslatorStartProps {
  onStart: () => void;
}

/** Props for the translator app (main translation UI) */
export interface TranslatorAppProps {
  onClose: () => void;
}

/** Current language selector target: "from" or "to" */
export type LanguageSelectionType = "from" | "to";
