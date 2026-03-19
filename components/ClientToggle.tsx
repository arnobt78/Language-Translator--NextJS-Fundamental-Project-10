"use client";

import { useState } from "react";
import TranslatorStart from "@/components/pages/TranslatorStart";
import TranslatorApp from "@/components/pages/TranslatorApp";

/**
 * Client-only: toggles between start screen and translator.
 * Minimal client boundary to reduce hydration flash.
 *
 * WALKTHROUGH:
 * - Single boolean state: false = show TranslatorStart (landing), true = show TranslatorApp.
 * - "Let's Get Started!" in TranslatorStart calls onStart() → set true.
 * - Close (X) in TranslatorApp calls onClose() → set false.
 * - No router: both views are mounted/unmounted in place.
 */
export default function ClientToggle() {
  const [showTranslatorApp, setShowTranslatorApp] = useState(false);

  return showTranslatorApp ? (
    <TranslatorApp onClose={() => setShowTranslatorApp(false)} />
  ) : (
    <TranslatorStart onStart={() => setShowTranslatorApp(true)} />
  );
}
