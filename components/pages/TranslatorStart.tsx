"use client";

import { motion } from "framer-motion";
import { Languages, Type, Sparkles } from "lucide-react";
import type { TranslatorStartProps } from "@/types";
import { RippleButton } from "@/components/ui/RippleButton";
import { Card, CardContent } from "@/components/ui/card";

/** Custom cubic-bezier for smooth ease-out; used in all Framer Motion transitions here */
const easeOut = [0.22, 1, 0.36, 1] as const;

/**
 * Start screen: greeting and CTA to open the translator.
 * Each greeting animates in from a different direction (top, left, right, bottom)
 * with staggered timing. Project summary and optional "How it works" row below.
 *
 * WALKTHROUGH:
 * - motion.div/span from Framer Motion: initial → animate with transition (duration, delay, ease).
 * - Card holds multilingual greetings (Hello, Georgian, Japanese, Hola).
 * - CTA uses RippleButton + cta-shine-wrap for shine effect (see globals.css).
 * - Bottom row: three steps (Pick languages, Type text, Get translation) with Lucide icons.
 */
export default function TranslatorStart({ onStart }: TranslatorStartProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-6 sm:p-12 gap-8">
      {/* Greeting card: fades in and scales up; then each line animates from its side */}
      <motion.div
        className="w-full"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: easeOut }}
      >
        <Card className="w-full h-64 bg-gradient-to-l from-[#b6f492] to-[#338b93] rounded-t-full rounded-bl-full flex flex-col justify-center text-gray-700 pr-6 border-0 shadow-none">
          <CardContent className="flex flex-col justify-center gap-1 py-6">
            <motion.span
              className="font-shojumaru text-5xl sm:text-6xl text-center block"
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.1, ease: easeOut }}
            >
              Hello
            </motion.span>
            <motion.span
              className="text-2xl sm:text-3xl text-left font-righteous block ml-16"
              initial={{ x: -32, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.2, ease: easeOut }}
            >
              გამარჯობა
            </motion.span>
            <motion.span
              className="font-notoSansJp text-3xl sm:text-4xl text-right block mr-32"
              initial={{ x: 32, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.3, ease: easeOut }}
            >
              こんにちは
            </motion.span>
            <motion.span
              className="text-2xl sm:text-3xl text-right font-righteous block"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.4, ease: easeOut }}
            >
              Hola
            </motion.span>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="w-full text-right max-w-2xl space-y-6 ml-auto"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, delay: 0.25, ease: easeOut }}
      >
        <h1 className="font-righteous text-4xl text-white uppercase">
          Language Translator
        </h1>

        <motion.div
          className="text-right text-white/70 text-sm sm:text-base leading-relaxed font-sans"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <p className="mb-1 font-righteous text-white/95 text-base sm:text-lg">
            One click. Any language. Instant understanding.
          </p>
          <p className="text-white/70 text-sm sm:text-base">
            A simple, fast translator that turns your text into dozens of
            languages—powered by MyMemory API. Swap languages, search the list,
            and get results in a clean, responsive UI.
          </p>
        </motion.div>

        {/* CTA: ripple on click + continuous shine overlay (cta-shine in globals.css) */}
        <div className="cta-shine-wrap">
          <RippleButton
            className="cta-shine-button px-8 py-3 bg-gradient-to-r from-[#b6f492] to-[#338b93] rounded-full font-righteous font-medium text-lg text-gray-700 tracking-widest active:translate-y-[1px]"
            onClick={onStart}
          >
            Let&apos;s Get Started!
          </RippleButton>
        </div>
      </motion.div>

      {/* “How it works”: three steps with icons; animates in last */}
      <motion.div
        className="w-full max-w-md mx-auto grid grid-cols-3 gap-4 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5, ease: easeOut }}
      >
        <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
          <Languages className="w-8 h-8 text-[#b6f492]" aria-hidden />
          <span className="font-righteous text-xs sm:text-sm text-white uppercase">
            Pick languages
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
          <Type className="w-8 h-8 text-[#b6f492]" aria-hidden />
          <span className="font-righteous text-xs sm:text-sm text-white uppercase">
            Type text
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
          <Sparkles className="w-8 h-8 text-[#b6f492]" aria-hidden />
          <span className="font-righteous text-xs sm:text-sm text-white uppercase">
            Get translation
          </span>
        </div>
      </motion.div>
    </div>
  );
}
