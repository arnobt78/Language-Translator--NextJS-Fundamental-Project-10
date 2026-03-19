import { useEffect, type RefObject } from "react";

/**
 * Runs a callback when a click happens outside the given ref element.
 * Used for closing dropdowns when clicking elsewhere.
 *
 * @param ref - Ref to the element (e.g. dropdown container)
 * @param handler - Called when a mousedown occurs outside ref.current
 * @param enabled - When false, listener is not attached (e.g. dropdown closed)
 * Note: Uses mousedown so it fires before focus moves; TranslatorApp uses inline logic to also ignore clicks on trigger elements.
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
  enabled: boolean
): void {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, handler, enabled]);
}
