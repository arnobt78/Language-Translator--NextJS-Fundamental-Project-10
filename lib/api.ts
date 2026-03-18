import type { MyMemoryTranslationResponse } from "@/types";

const MYMEMORY_BASE = "https://api.mymemory.translated.net/get";

/**
 * Fetches translation from MyMemory API.
 * @param text - Source text to translate
 * @param langPair - "from|to" language codes (e.g. "en|es-ES")
 */
export async function translate(
  text: string,
  langPair: string
): Promise<string> {
  const url = `${MYMEMORY_BASE}?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langPair)}`;
  const res = await fetch(url);
  const data: MyMemoryTranslationResponse = await res.json();
  return data.responseData?.translatedText ?? "";
}
