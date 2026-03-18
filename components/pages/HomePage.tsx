"use client";

import { useState } from "react";
import TranslatorStart from "@/components/pages/TranslatorStart";
import TranslatorApp from "@/components/pages/TranslatorApp";

/**
 * Client-side home page: toggles between start screen and translator.
 * All interactivity lives here (CSR); app/page.tsx is SSR shell only.
 */
export default function HomePage() {
  const [showTranslatorApp, setShowTranslatorApp] = useState(false);

  return (
    <div className="w-full h-screen bg-gradient-to-l from-[#b6f492] to-[#338b93] flex justify-center items-center">
      <div className="w-[90%] max-w-lg max-[392px]:h-[90%] sm:h-auto bg-[#2d2d2d] rounded-xl shadow-2xl shadow-gray-800 flex flex-col">
        {showTranslatorApp ? (
          <TranslatorApp onClose={() => setShowTranslatorApp(false)} />
        ) : (
          <TranslatorStart onStart={() => setShowTranslatorApp(true)} />
        )}
      </div>
    </div>
  );
}
