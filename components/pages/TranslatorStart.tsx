"use client";

import type { TranslatorStartProps } from "@/types";
import { RippleButton } from "@/components/ui/RippleButton";

/**
 * Start screen: greeting and CTA to open the translator.
 * Styled with inline Tailwind only (no global CSS classes).
 */
export default function TranslatorStart({ onStart }: TranslatorStartProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-6 sm:p-12">
      <div className="w-full h-64 bg-gradient-to-l from-[#b6f492] to-[#338b93] rounded-t-full rounded-bl-full flex flex-col justify-center text-gray-700 pr-6">
        <span className="font-shojumaru text-5xl sm:text-6xl text-center">
          Hello
        </span>
        <span className="text-2xl sm:text-3xl text-center">გამარჯობა</span>
        <span className="font-notoSansJp text-3xl sm:text-4xl text-right">
          こんにちは
        </span>
        <span className="text-2xl sm:text-3xl text-right">Hola</span>
      </div>
      <div className="w-full text-right space-y-5 mt-20 mb-36">
        <h1 className="font-righteous text-4xl text-white uppercase">
          Translator App
        </h1>
        <RippleButton
          className="w-32 h-10 bg-gradient-to-r from-[#b6f492] to-[#338b93] rounded-full font-righteous font-bold text-lg uppercase text-gray-700 tracking-widest active:translate-y-[1px]"
          onClick={onStart}
        >
          Start
        </RippleButton>
      </div>
    </div>
  );
}
