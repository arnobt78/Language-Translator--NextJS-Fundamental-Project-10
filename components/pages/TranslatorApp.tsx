"use client";

import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { languages } from "@/data/languages";
import { translate, toApiLangCode } from "@/lib/api";
import { RippleButton } from "@/components/ui/RippleButton";
import { Input } from "@/components/ui/input";
import type { TranslatorAppProps, LanguageCode } from "@/types";

/** Shared textarea styles for input and consistent look */
const TEXTAREA_CLASS =
  "w-full h-48 max-[392px]:h-44 max-[392px]:text-sm resize-none bg-[#0d0d0d]/70 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 font-righteous font-light leading-6 transition-colors focus:outline-none focus:border-[#b6f492]/50 focus:ring-1 focus:ring-[#b6f492]/30";

/** Input length cap; keeps requests within API limits and shows count to user */
const MAX_CHARS = 200;

/** Output area base - same for skeleton and content to prevent layout flash when switching */
const OUTPUT_BASE_CLASS =
  "w-full h-48 max-[392px]:h-44 rounded-xl bg-[#0d0d0d]/70 backdrop-blur-sm border border-white/10 overflow-hidden";

/** Substrings that indicate an error/warning message so we style output in amber */
const ERROR_PHRASES = [
  "please select two different",
  "translation unavailable",
  "translation failed",
];

/** Delay between revealing each character for the “streaming” effect (ms) */
const STREAM_DELAY_MS = 25;

/**
 * Main translator UI: language selection, input, translate action, output.
 * Uses Input, RippleButton, and search filter.
 *
 * WALKTHROUGH – State:
 * - selectedLanguageFrom / To: current language codes from data/languages.
 * - showLanguages + currentLanguageSelection: which dropdown is open (from/to).
 * - inputText, translatedText, displayedText: input, full result, and streamed display.
 * - isStreaming, isTranslating: for loading/streaming UI.
 * - Refs: dropdownRef for click-outside, fromTriggerRef/toTriggerRef so clicking trigger doesn’t close.
 */
export default function TranslatorApp({ onClose }: TranslatorAppProps) {
  const [selectedLanguageFrom, setSelectedLanguageFrom] =
    useState<LanguageCode>("en");
  const [selectedLanguageTo, setSelectedLanguageTo] =
    useState<LanguageCode>("de-DE");
  const [showLanguages, setShowLanguages] = useState(false);
  const [currentLanguageSelection, setCurrentLanguageSelection] = useState<
    "from" | "to" | null
  >(null);
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isTranslating, setIsTranslating] = useState(false);
  const [languageSearch, setLanguageSearch] = useState("");
  const [copiedInput, setCopiedInput] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [swapRotation, setSwapRotation] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fromTriggerRef = useRef<HTMLDivElement>(null);
  const toTriggerRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  /** Close dropdown when user clicks outside dropdown and outside both triggers */
  useEffect(() => {
    if (!showLanguages) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const inDropdown = dropdownRef.current?.contains(target);
      const onFromTrigger = fromTriggerRef.current?.contains(target);
      const onToTrigger = toTriggerRef.current?.contains(target);
      if (!inDropdown && !onFromTrigger && !onToTrigger)
        setShowLanguages(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLanguages]);

  /** Sets a boolean to true, then back to false after 1.5s (e.g. “Copied!” feedback) */
  const showCopyFeedback = useCallback((setter: (v: boolean) => void) => {
    setter(true);
    const t = setTimeout(() => setter(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const handleCopyInput = useCallback(() => {
    if (!inputText) return;
    void navigator.clipboard.writeText(inputText).then(() => {
      showCopyFeedback(setCopiedInput);
    });
  }, [inputText, showCopyFeedback]);

  const handleCopyOutput = useCallback(() => {
    const toCopy = translatedText || displayedText;
    if (!toCopy) return;
    void navigator.clipboard.writeText(toCopy).then(() => {
      showCopyFeedback(setCopiedOutput);
    });
  }, [translatedText, displayedText, showCopyFeedback]);

  /** Reset input, output, and streaming state */
  const handleClear = useCallback(() => {
    setInputText("");
    setCharCount(0);
    setTranslatedText("");
    setDisplayedText("");
    setIsStreaming(false);
  }, []);

  /** When translatedText changes: reveal it character-by-character (streaming effect) and auto-scroll */
  useEffect(() => {
    if (!translatedText) {
      setDisplayedText("");
      setIsStreaming(false);
      return;
    }
    setIsStreaming(true);
    setDisplayedText("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setDisplayedText(translatedText.slice(0, i));
      outputRef.current?.scrollTo({
        top: outputRef.current.scrollHeight,
        behavior: "smooth",
      });
      if (i >= translatedText.length) {
        clearInterval(id);
        setIsStreaming(false);
      }
    }, STREAM_DELAY_MS);
    return () => clearInterval(id);
  }, [translatedText]);

  /** True if the message is an error/warning so we can style it (e.g. amber) */
  const isErrorOrWarning = (text: string) =>
    ERROR_PHRASES.some((p) => text.toLowerCase().includes(p));

  /** Normalize and compare: used to detect when API returns unchanged text (same language / no translation) */
  const isSameAsInput = useCallback((result: string, input: string) => {
    const norm = (s: string) =>
      s
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, "")
        .replace(/\s+/g, " ")
        .trim();
    return norm(result) === norm(input);
  }, []);

  /** Language list for dropdown: when no search, show en + de-DE first, then rest; else filter by search */
  const filteredLanguages = useMemo(() => {
    const all = Object.entries(languages) as [LanguageCode, string][];
    const search = languageSearch.trim().toLowerCase();
    if (!search) {
      const featured: LanguageCode[] = ["en", "de-DE"];
      const rest = all.filter(([code]) => !featured.includes(code));
      return [
        ...featured.map((c) => [c, languages[c]] as [LanguageCode, string]),
        ...rest,
      ];
    }
    return all.filter(
      ([code, name]) =>
        name.toLowerCase().includes(search) ||
        code.toLowerCase().includes(search),
    );
  }, [languageSearch]);

  /** Open dropdown for “from” or “to”; if same trigger clicked again, close it */
  const handleLanguageClick = (type: "from" | "to") => {
    if (showLanguages && currentLanguageSelection === type) {
      setShowLanguages(false);
      return;
    }
    setCurrentLanguageSelection(type);
    setLanguageSearch("");
    setShowLanguages(true);
  };

  /** Apply selected language to current “from” or “to” and close dropdown */
  const handleLanguagesSelect = (languageCode: LanguageCode) => {
    if (currentLanguageSelection === "from") {
      setSelectedLanguageFrom(languageCode);
    } else {
      setSelectedLanguageTo(languageCode);
    }
    setShowLanguages(false);
  };

  /** Swap From and To languages; rotation drives the swap icon animation */
  const handleSwapLanguages = () => {
    setSwapRotation((prev) => prev + 360);
    setSelectedLanguageFrom(selectedLanguageTo);
    setSelectedLanguageTo(selectedLanguageFrom);
  };

  /** Enforce MAX_CHARS and update input + character count */
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setInputText(value);
      setCharCount(value.length);
    }
  };

  /** Call MyMemory API via lib/api; handle same-language, empty result, and errors with user messages */
  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setTranslatedText("");
      return;
    }
    if (selectedLanguageFrom === selectedLanguageTo) {
      setTranslatedText("Please select two different languages.");
      return;
    }
    setIsTranslating(true);
    setTranslatedText("");
    try {
      const from = toApiLangCode(selectedLanguageFrom);
      const to = toApiLangCode(selectedLanguageTo);
      const result = await translate(inputText, `${from}|${to}`);
      const final = !result
        ? "Translation unavailable. Try another language pair."
        : isSameAsInput(result, inputText)
          ? "Could not translate this phrase. The API returned the same text. Try rephrasing or a longer sentence."
          : result;
      setTranslatedText(final);
    } catch {
      setTranslatedText("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  /** Submit translation on Enter (without newline) */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void handleTranslate();
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-5 justify-center items-center px-6 sm:px-8 pt-6 pb-6 relative overflow-visible">
      {/* Header: title + close */}
      <motion.div
        className="w-full flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white/60 tracking-wide uppercase">
            Translator
          </span>
          <span className="text-white/40">·</span>
          <span className="text-xs text-white/50">
            {languages[selectedLanguageFrom]} → {languages[selectedLanguageTo]}
          </span>
        </div>
        <RippleButton
          className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          <i className="fa-solid fa-xmark text-sm text-white/70" />
        </RippleButton>
      </motion.div>

      {/* Language selector */}
      <motion.div
        className="w-full relative z-[200]"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full flex flex-row items-start justify-center gap-3 sm:gap-5 px-4 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
          <div className="flex flex-col items-center gap-1.5 min-w-0 flex-1">
            <span className="text-[10px] sm:text-xs font-medium text-white/50 uppercase tracking-wider">
              From
            </span>
            <div className="relative inline-flex flex-col items-center">
              <div
                ref={fromTriggerRef}
                role="button"
                tabIndex={0}
                aria-haspopup="listbox"
                aria-expanded={
                  showLanguages && currentLanguageSelection === "from"
                }
                title="Select source language"
                className="w-full max-w-[140px] px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 cursor-pointer transition-all flex items-center justify-between gap-2"
                onClick={() => handleLanguageClick("from")}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  handleLanguageClick("from")
                }
              >
                <span className="text-sm sm:text-base font-semibold text-white truncate">
                  {languages[selectedLanguageFrom] ?? "English"}
                </span>
                <i
                  className={`fa-solid fa-chevron-down text-[10px] text-white/70 shrink-0 transition-transform ${showLanguages && currentLanguageSelection === "from" ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </div>
              <AnimatePresence>
                {showLanguages && currentLanguageSelection === "from" && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-56 min-w-[200px] max-h-[min(320px,calc(100dvh-10rem))] bg-[#0f1419] backdrop-blur-xl border border-white/20 z-[100] rounded-2xl shadow-2xl p-4 flex flex-col"
                    ref={dropdownRef}
                  >
                    <div className="shrink-0 mb-2">
                      <Input
                        placeholder="Search languages..."
                        value={languageSearch}
                        onChange={(e) => setLanguageSearch(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 [&::placeholder]:!text-white/50"
                      />
                    </div>
                    <ul className="overflow-y-auto flex-1 min-h-0 text-white [&>*]:!text-white">
                      {filteredLanguages.map(([code, name], index) => (
                        <motion.li
                          key={code}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02, duration: 0.2 }}
                          role="button"
                          tabIndex={0}
                          className="cursor-pointer hover:bg-white/15 transition duration-200 p-2 rounded !text-white"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleLanguagesSelect(code);
                          }}
                          onKeyDown={(e) =>
                            (e.key === "Enter" || e.key === " ") &&
                            handleLanguagesSelect(code)
                          }
                        >
                          {name}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <span className="text-[10px] sm:text-xs font-medium text-white/50 uppercase tracking-wider opacity-0 sm:opacity-100">
              Swap
            </span>
            <motion.div
              animate={{ rotate: swapRotation }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <RippleButton
                className="h-11 w-11 rounded-full bg-gradient-to-br from-[#b6f492] to-[#338b93] flex items-center justify-center shadow-lg shadow-[#338b93]/30 hover:shadow-[#338b93]/50 hover:scale-105 active:scale-95 transition-all"
                onClick={handleSwapLanguages}
                aria-label="Swap languages"
              >
                <i className="fa-solid fa-arrows-rotate text-lg text-white drop-shadow-sm" />
              </RippleButton>
            </motion.div>
          </div>
          <div className="flex flex-col items-center gap-1.5 min-w-0 flex-1">
            <span className="text-[10px] sm:text-xs font-medium text-white/50 uppercase tracking-wider">
              To
            </span>
            <div className="relative inline-flex flex-col items-end">
              <div
                ref={toTriggerRef}
                role="button"
                tabIndex={0}
                aria-haspopup="listbox"
                aria-expanded={
                  showLanguages && currentLanguageSelection === "to"
                }
                title="Select target language"
                className="w-full max-w-[140px] px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 cursor-pointer transition-all flex items-center justify-between gap-2"
                onClick={() => handleLanguageClick("to")}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  handleLanguageClick("to")
                }
              >
                <span className="text-sm sm:text-base font-semibold text-white truncate">
                  {languages[selectedLanguageTo] ?? "English"}
                </span>
                <i
                  className={`fa-solid fa-chevron-down text-[10px] text-white/70 shrink-0 transition-transform ${showLanguages && currentLanguageSelection === "to" ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </div>
              <AnimatePresence>
                {showLanguages && currentLanguageSelection === "to" && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-56 min-w-[200px] max-h-[min(320px,calc(100dvh-10rem))] bg-[#0f1419] backdrop-blur-xl border border-white/20 z-[100] rounded-2xl shadow-2xl p-4 flex flex-col"
                    ref={dropdownRef}
                  >
                    <div className="shrink-0 mb-2">
                      <Input
                        placeholder="Search languages..."
                        value={languageSearch}
                        onChange={(e) => setLanguageSearch(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 [&::placeholder]:!text-white/50"
                      />
                    </div>
                    <ul className="overflow-y-auto flex-1 min-h-0 text-white [&>*]:!text-white">
                      {filteredLanguages.map(([code, name], index) => (
                        <motion.li
                          key={code}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02, duration: 0.2 }}
                          role="button"
                          tabIndex={0}
                          className="cursor-pointer hover:bg-white/15 transition duration-200 p-2 rounded !text-white"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleLanguagesSelect(code);
                          }}
                          onKeyDown={(e) =>
                            (e.key === "Enter" || e.key === " ") &&
                            handleLanguagesSelect(code)
                          }
                        >
                          {name}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="w-full relative group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <span className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
          Your text
        </span>
        <div className="absolute top-10 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <RippleButton
            className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 flex items-center justify-center"
            onClick={handleCopyInput}
            disabled={!inputText}
            aria-label="Copy input"
          >
            <i
              className={`fa-solid ${copiedInput ? "fa-check" : "fa-copy"} text-sm`}
            />
          </RippleButton>
          <RippleButton
            className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 flex items-center justify-center"
            onClick={handleClear}
            disabled={!inputText && !translatedText}
            aria-label="Clear"
          >
            <i className="fa-solid fa-eraser text-sm" />
          </RippleButton>
        </div>
        <textarea
          className={`${TEXTAREA_CLASS} text-gray-200 placeholder:text-gray-500`}
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter text to translate..."
          aria-label="Text to translate"
        />
        <div className="absolute bottom-2 right-4 flex items-center gap-2">
          <span className="text-gray-500 text-xs font-mono">
            {charCount}/{MAX_CHARS}
          </span>
        </div>
      </motion.div>

      <motion.div
        className="w-full flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="cta-shine-wrap rounded-full">
            <RippleButton
              className="cta-shine-button w-14 h-14 bg-gradient-to-br from-[#b6f492] to-[#338b93] rounded-full text-2xl text-white flex justify-center items-center shadow-lg shadow-[#338b93]/30 hover:shadow-[#338b93]/50 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              onClick={() => void handleTranslate()}
              disabled={isTranslating || !inputText.trim()}
              aria-label="Translate"
            >
              <i className="fa-solid fa-language text-2xl drop-shadow-sm" />
            </RippleButton>
          </div>
          <span className="text-[10px] text-white/40 uppercase tracking-wider">
            Translate
          </span>
        </div>

        <div className="w-full min-h-[12rem] max-[392px]:min-h-[11rem] relative group">
          <span className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
            Translation
          </span>
          <div className={`relative ${OUTPUT_BASE_CLASS} px-4 py-3`}>
            {isTranslating ? (
              <div className="absolute inset-0 flex flex-col gap-3 px-4 py-3">
                {[0.9, 1, 0.75, 0.6, 0.85, 0.7].map((w, i) => (
                  <div
                    key={i}
                    className="h-3 rounded bg-white/10 animate-pulse"
                    style={{ width: `${w * 100}%` }}
                  />
                ))}
              </div>
            ) : (
              <>
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <RippleButton
                    className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 flex items-center justify-center disabled:opacity-50"
                    onClick={handleCopyOutput}
                    disabled={!translatedText && !displayedText}
                    aria-label="Copy translation"
                  >
                    <i
                      className={`fa-solid ${copiedOutput ? "fa-check" : "fa-copy"} text-sm`}
                    />
                  </RippleButton>
                </div>
                <div
                  ref={outputRef}
                  className={`w-full h-full overflow-y-auto flex flex-col font-righteous font-light leading-6 ${
                    isErrorOrWarning(translatedText || displayedText)
                      ? "text-amber-400/90"
                      : "text-[#b6f492]"
                  }`}
                  aria-label="Translation result"
                >
                  <span className="whitespace-pre-wrap break-words">
                    {displayedText}
                    {isStreaming && (
                      <span
                        className={`stream-cursor inline-block w-0.5 h-4 ml-0.5 align-middle ${
                          isErrorOrWarning(translatedText)
                            ? "bg-amber-400"
                            : "bg-[#b6f492]"
                        }`}
                        aria-hidden
                      />
                    )}
                  </span>
                  {!displayedText && !isTranslating && (
                    <span className="text-gray-500">
                      Translation will appear here...
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
