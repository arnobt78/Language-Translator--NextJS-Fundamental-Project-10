"use client";

import { useState } from "react";
import TranslatorStart from "@/components/pages/TranslatorStart";
import TranslatorApp from "@/components/pages/TranslatorApp";

/**
 * Client-side home page: toggles between start screen and translator.
 * All interactivity lives here (CSR); app/page.tsx is SSR shell only.
 *
 * NOTE: The main app uses app/page.tsx (server-rendered card) + ClientToggle.
 * This component is an alternative that wraps everything in one client tree
 * (card + content). Kept for reference or if you prefer a single client root.
 */
export default function HomePage() {
  const [showTranslatorApp, setShowTranslatorApp] = useState(false);

  return (
    <div className="w-full max-w-9xl mx-auto h-screen flex justify-center items-center px-0 sm:px-4">
      <div className="w-full sm:w-[90%] max-[392px]:h-[90%] sm:h-auto bg-black/50 rounded-3xl shadow-2xl shadow-gray-800 flex flex-col backdrop-blur-sm border border-white/10 overflow-visible">
        {showTranslatorApp ? (
          <TranslatorApp onClose={() => setShowTranslatorApp(false)} />
        ) : (
          <TranslatorStart onStart={() => setShowTranslatorApp(true)} />
        )}
      </div>
    </div>
  );
}
