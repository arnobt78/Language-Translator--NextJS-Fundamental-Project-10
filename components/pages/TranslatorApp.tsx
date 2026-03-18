"use client";

import { useState, useRef } from "react";
import { languages } from "@/data/languages";
import { useClickOutside } from "@/hooks/useClickOutside";
import { translate } from "@/lib/api";
import { RippleButton } from "@/components/ui/RippleButton";
import type { TranslatorAppProps, LanguageCode } from "@/types";

const TEXTAREA_CLASS =
  "w-full h-48 max-[392px]:h-44 max-[392px]:text-sm resize-none bg-[#151515] shadow-md shadow-black rounded-lg px-4 py-2 font-righteous font-light leading-5";

const MAX_CHARS = 200;

/**
 * Main translator UI: language selection, input, translate action, output.
 * All state and event handlers live here (CSR).
 */
export default function TranslatorApp({ onClose }: TranslatorAppProps) {
  const [selectedLanguageFrom, setSelectedLanguageFrom] =
    useState<LanguageCode>("en");
  const [selectedLanguageTo, setSelectedLanguageTo] =
    useState<LanguageCode>("en");
  const [showLanguages, setShowLanguages] = useState(false);
  const [currentLanguageSelection, setCurrentLanguageSelection] = useState<
    "from" | "to" | null
  >(null);
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [charCount, setCharCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setShowLanguages(false), showLanguages);

  const handleLanguageClick = (type: "from" | "to") => {
    setCurrentLanguageSelection(type);
    setShowLanguages(true);
  };

  const handleLanguagesSelect = (languageCode: LanguageCode) => {
    if (currentLanguageSelection === "from") {
      setSelectedLanguageFrom(languageCode);
    } else {
      setSelectedLanguageTo(languageCode);
    }
    setShowLanguages(false);
  };

  const handleSwapLanguages = () => {
    setSelectedLanguageFrom(selectedLanguageTo);
    setSelectedLanguageTo(selectedLanguageFrom);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setInputText(value);
      setCharCount(value.length);
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setTranslatedText("");
      return;
    }
    const result = await translate(
      inputText,
      `${selectedLanguageFrom}|${selectedLanguageTo}`
    );
    setTranslatedText(result);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void handleTranslate();
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-4 justify-center items-center px-6 sm:px-8 pt-12 pb-6 relative">
      <RippleButton
        className="absolute top-4 right-4"
        onClick={onClose}
        aria-label="Close"
      >
        <i className="fa-solid fa-xmark text-xl text-gray-300" />
      </RippleButton>
      <div className="w-full min-h-20 flex justify-center items-center px-4 bg-gradient-to-r from-[#b6f492] to-[#338b93] text-gray-700 rounded-lg">
        <div
          role="button"
          tabIndex={0}
          className="text-sm sm:text-lg text-right uppercase cursor-pointer"
          onClick={() => handleLanguageClick("from")}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && handleLanguageClick("from")
          }
        >
          {languages[selectedLanguageFrom] ?? "English"}
        </div>
        <RippleButton
          className="mx-8 cursor-pointer"
          onClick={handleSwapLanguages}
          aria-label="Swap languages"
        >
          <i className="fa-solid fa-arrows-rotate text-2xl" />
        </RippleButton>
        <div
          role="button"
          tabIndex={0}
          className="text-sm sm:text-lg text-right uppercase cursor-pointer"
          onClick={() => handleLanguageClick("to")}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && handleLanguageClick("to")
          }
        >
          {languages[selectedLanguageTo] ?? "English"}
        </div>
      </div>
      {showLanguages && (
        <div
          className="w-[calc(100%-4rem)] h-[calc(100%-9rem)] bg-gradient-to-r from-[#b6f492] to-[#338b93] absolute top-32 left-8 z-10 rounded shadow-lg p-4 overflow-y-scroll scrollbar-hide"
          ref={dropdownRef}
        >
          <ul>
            {(Object.entries(languages) as [LanguageCode, string][]).map(
              ([code, name]) => (
                <li
                  key={code}
                  role="button"
                  tabIndex={0}
                  className="cursor-pointer hover:bg-[#10646b] transition duration-200 p-2 rounded"
                  onClick={() => handleLanguagesSelect(code)}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    handleLanguagesSelect(code)
                  }
                >
                  {name}
                </li>
              )
            )}
          </ul>
        </div>
      )}
      <div className="w-full relative">
        <textarea
          className={`${TEXTAREA_CLASS} text-gray-200`}
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter text to translate"
          aria-label="Text to translate"
        />
        <div className="absolute bottom-2 right-4 text-gray-400">
          {charCount}/{MAX_CHARS}
        </div>
      </div>
      <RippleButton
        className="w-12 h-12 bg-gradient-to-r from-[#b6f492] to-[#338b93] rounded-full text-2xl text-gray-600 flex justify-center items-center active:translate-y-[1px]"
        onClick={() => void handleTranslate()}
        aria-label="Translate"
      >
        <i className="fa-solid fa-chevron-down" />
      </RippleButton>
      <div className="w-full">
        <textarea
          className={`${TEXTAREA_CLASS} text-[#b6f492]`}
          value={translatedText}
          readOnly
          aria-label="Translation result"
        />
      </div>
    </div>
  );
}
