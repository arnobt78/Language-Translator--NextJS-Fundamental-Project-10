import type { languages } from "@/data/languages";

/** Shared types for the translator app (no `any`). */

/** Language code keys from the supported languages map (e.g. "en", "de-DE", "ja-JP") */
export type LanguageCode = keyof typeof languages;

/** MyMemory API response shape for GET .../get?q=...&langpair=... */
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

/** Props for the start screen: onStart is called when user clicks "Let's Get Started!" */
export interface TranslatorStartProps {
  onStart: () => void;
}

/** Props for the translator app: onClose is called when user clicks the X (back to start) */
export interface TranslatorAppProps {
  onClose: () => void;
}

/** Which language slot the dropdown is changing: "from" (source) or "to" (target) */
export type LanguageSelectionType = "from" | "to";
