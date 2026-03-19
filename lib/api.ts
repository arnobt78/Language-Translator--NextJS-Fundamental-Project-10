import type { MyMemoryTranslationResponse } from "@/types";

/** MyMemory API base URL (free tier; no API key required). Can be overridden via env. */
const MYMEMORY_BASE = "https://api.mymemory.translated.net/get";

/**
 * Maps our locale codes (e.g. de-DE, bn-IN) to MyMemory API format.
 * Uses base language (xx) for better compatibility.
 * Example: "de-DE" → "de", "en" → "en".
 */
export function toApiLangCode(code: string): string {
  const base = code.split("-")[0];
  return base ? base.toLowerCase() : code.toLowerCase();
}

/**
 * Fetches translation from MyMemory API (GET request).
 * @param text - Source text to translate
 * @param langPair - "from|to" language codes (e.g. "en|de")
 * @returns Translated string, or "" if same-language / 403 / API error message
 */
export async function translate(
  text: string,
  langPair: string
): Promise<string> {
  const url = `${MYMEMORY_BASE}?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langPair)}`;
  const res = await fetch(url);
  const data: MyMemoryTranslationResponse = await res.json();
  const result = data.responseData?.translatedText ?? "";
  if (
    result.toLowerCase().includes("please, specify two different") ||
    data.responseStatus === 403
  ) {
    return "";
  }
  return result;
}
