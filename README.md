# Language Translator - Next.js, React, TypeScript, MyMemory Translation API, TailwindCSS, Framer Motion Fundamental Project 10

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![MyMemory Translation API](https://img.shields.io/badge/MyMemory%20Translation%20API-free-green)](https://mymemory.translated.net/doc/spec.php)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-blue)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11-blue)](https://www.framer.com/motion/)

A modern, user-friendly language translator web application built with **Next.js**, **React**, and **TypeScript**. It uses the free **MyMemory Translation API** to translate text between dozens of languages. The app features a responsive UI with **TailwindCSS**, smooth animations via **Framer Motion**, and a server-rendered shell for fast first paint—ideal for learning full-stack React patterns, API integration, and deployment on **Vercel**.

- **Live Demo:** [https://langs-translator.vercel.app/](https://langs-translator.vercel.app/)

![Image 1](https://github.com/user-attachments/assets/564bc919-91db-4ef9-9de7-f6056f68487f)
![Image 2](https://github.com/user-attachments/assets/998ecad9-8e72-44db-8afd-c3f5570cd240)

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Installation & Setup](#installation--setup)
6. [Environment Variables (.env)](#environment-variables-env)
7. [How to Run & Use](#how-to-run--use)
8. [Routes & Pages](#routes--pages)
9. [API Integration & Backend](#api-integration--backend)
10. [Components & Walkthrough](#components--walkthrough)
11. [Functionalities – How It Works](#functionalities--how-it-works)
12. [Reusing Components in Other Projects](#reusing-components-in-other-projects)
13. [Libraries & Dependencies](#libraries--dependencies)
14. [Example Code Snippets](#example-code-snippets)
15. [Keywords](#keywords)
16. [Conclusion](#conclusion)
17. [License](#license)

---

## Project Overview

This application lets users **translate text between multiple languages** in the browser. There is **no custom backend**—the frontend talks directly to the [MyMemory Translation API](https://mymemory.translated.net/doc/spec.php). The app demonstrates **Next.js App Router**, **server vs. client components**, **form state**, **API calls**, and **responsive design**. It is suitable for beginners learning React/Next.js and for anyone who wants a ready-to-deploy translator UI.

---

## Features

- **Multi-language translation** – Dozens of languages (e.g. English, German, Japanese, Bengali).
- **Source & target selection** – Dropdowns with search to pick “From” and “To” languages.
- **Swap languages** – One click to reverse From/To.
- **Streaming-style output** – Translation appears character-by-character for a polished feel.
- **Copy & clear** – Copy input or output to clipboard; clear both fields.
- **Character limit** – Input capped (e.g. 200 characters) to stay within API limits.
- **Start screen** – Landing view with greetings in several languages and a CTA to open the translator.
- **Ripple button** – Click feedback on primary actions.
- **Responsive layout** – Works on mobile and desktop; card layout with backdrop blur.
- **SEO-friendly** – Metadata (title, description, Open Graph, Twitter) in the root layout.
- **Open source** – MIT license; free to use and extend.

---

## Technology Stack

| Layer         | Technology                                       |
| ------------- | ------------------------------------------------ |
| Framework     | Next.js 16 (App Router)                          |
| UI            | React 19, TypeScript 5.7                         |
| Styling       | TailwindCSS 3, tw-animate-css                    |
| Animation     | Framer Motion 11                                 |
| UI Primitives | shadcn/ui, Base UI, Lucide React                 |
| API           | MyMemory Translation API (REST, no key required) |
| Deployment    | Vercel                                           |
| Linting       | ESLint (eslint-config-next)                      |

---

## Project Structure

```bash
language-translator/
├── app/
│   ├── layout.tsx          # Root layout: fonts, metadata, body background, critical CSS
│   ├── page.tsx            # Home route: server-rendered card shell + ClientToggle
│   └── globals.css         # Tailwind base, ripple, CTA shine, stream cursor
├── components/
│   ├── ClientToggle.tsx    # Client: toggles between TranslatorStart and TranslatorApp
│   ├── pages/
│   │   ├── TranslatorStart.tsx   # Start screen: greetings, CTA, “How it works”
│   │   ├── TranslatorApp.tsx    # Main translator UI: languages, input, output, actions
│   │   └── HomePage.tsx          # Legacy client wrapper (optional; page uses ClientToggle)
│   └── ui/
│       ├── RippleButton.tsx # Button with ripple effect
│       ├── card.tsx         # Card / CardContent (shadcn)
│       ├── input.tsx        # Input (shadcn)
│       ├── button.tsx       # Button (shadcn)
│       ├── skeleton.tsx      # Skeleton (shadcn)
│       └── badge.tsx        # Badge (shadcn)
├── data/
│   └── languages.ts        # Map of language codes → display names (MyMemory-compatible)
├── hooks/
│   └── useClickOutside.ts  # Close dropdown when clicking outside
├── lib/
│   ├── api.ts              # translate(), toApiLangCode() – MyMemory API
│   └── utils.ts            # cn() – classnames merge (clsx + tailwind-merge)
├── types/
│   └── index.ts            # LanguageCode, MyMemory response, component props
├── public/
│   ├── favicon.ico
│   └── hero1.webp          # Hero background image
├── .env.example            # Optional env vars (title, API URL override)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── package.json
└── README.md
```

---

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/arnobt78/Language-Translator--ReactVite.git
   cd language-translator
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Optional: environment variables**

   Copy `.env.example` to `.env.local` if you want to override the app title or API base URL (see [Environment Variables](#environment-variables-env)). **You do not need any env vars to run the app**; it works out of the box.

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open in the browser**

   Visit [http://localhost:3000](http://localhost:3000) (Next.js default port).

---

## Environment Variables (.env)

**You do not need a `.env` file to run this project.** The app works without any environment variables. All of the following are optional.

To customize behavior:

1. Copy the example file:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` (never commit real secrets; `.env.local` is usually gitignored).

| Variable                       | Required | Description                                                                                                |
| ------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_TITLE`        | No       | Browser tab / SEO title. Default: `"Language Translator"`.                                                 |
| `NEXT_PUBLIC_MYMEMORY_API_URL` | No       | MyMemory API base URL. Only set this if you use a proxy; default is `https://api.mymemory.translated.net`. |

**How to get / set them:**

- **App title:** Set `NEXT_PUBLIC_APP_TITLE=My Translator` (or any string) in `.env.local`.
- **API URL:** Leave unset to use the public MyMemory endpoint. If you host your own proxy, set `NEXT_PUBLIC_MYMEMORY_API_URL` to that base URL (e.g. `https://your-proxy.com`).

No API key is required for the default MyMemory usage; check [MyMemory docs](https://mymemory.translated.net/doc/spec.php) for rate limits.

---

## How to Run & Use

- **Development:** `npm run dev` → [http://localhost:3000](http://localhost:3000)
- **Production build:** `npm run build` then `npm run start`
- **Lint:** `npm run lint`

**User flow:**

1. Open the app → you see the **start screen** (greetings, “Language Translator” title, “Let’s Get Started!”).
2. Click **“Let’s Get Started!”** → the **translator** view opens (language selectors, input, output).
3. Choose **From** and **To** languages (use search if needed), type or paste text, click **Translate** (or press Enter).
4. Use **Copy** / **Clear** as needed; use **Swap** to reverse languages; use the **X** button to go back to the start screen.

---

## Routes & Pages

The app uses the **Next.js App Router** with a single main route:

| Route | File           | Description                                                                                                                                      |
| ----- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`   | `app/page.tsx` | Home. Renders a server-rendered card shell; inside it, the client component `ClientToggle` switches between the start screen and the translator. |

There are no other routes. All UI is on this single page; “Start” vs “Translator” is client-side state only.

---

## API Integration & Backend

There is **no custom backend**. The frontend calls the **MyMemory Translation API** from the client.

- **Endpoint:** `GET https://api.mymemory.translated.net/get?q={text}&langpair={from}|{to}`
- **Used in:** `lib/api.ts` – `translate(text, langPair)` and `toApiLangCode(code)` (e.g. `de-DE` → `de`).

**Flow:**

1. User clicks Translate (or presses Enter).
2. `TranslatorApp` calls `translate(inputText, \`${from}|${to}\`)` with API-friendly language codes.
3. `lib/api.ts` builds the URL, `fetch`es, parses JSON, and returns `responseData.translatedText` (or handles same-language / errors).
4. The UI shows the result (with optional streaming effect).

**Important:** Same-language pairs are blocked in the UI; invalid or error responses are surfaced as user-friendly messages. No API key is required for normal use.

---

## Components & Walkthrough

| Component                                    | Role                                                                                                                            | Reusable?                                                       |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **ClientToggle**                             | Client-only. Holds `showTranslatorApp` state; renders either `TranslatorStart` or `TranslatorApp`.                              | Yes – pattern for “two views, one toggle”.                      |
| **TranslatorStart**                          | Start screen: Framer Motion greetings card, title, description, CTA button, “Pick languages / Type text / Get translation” row. | Yes – swap copy and `onStart` for your own flow.                |
| **TranslatorApp**                            | Full translator: language dropdowns (with search), textarea, Translate/Swap/Copy/Clear, streaming output, close button.         | Yes – pass `onClose` and optionally adapt language list or API. |
| **RippleButton**                             | Button that shows a ripple on click (see `RIPPLE_BUTTON_EFFECT.md`). Extends normal button props.                               | Yes – drop-in for any `<button>`.                               |
| **Card / Input / Button / Skeleton / Badge** | shadcn-style UI primitives.                                                                                                     | Yes – standard shadcn reuse.                                    |

**Data flow:**

- `app/page.tsx` (server) → card shell (inline styles for blur/background) → `ClientToggle` (client).
- `ClientToggle` → `TranslatorStart` (with `onStart`) or `TranslatorApp` (with `onClose`).
- `TranslatorApp` uses `lib/api.ts`, `data/languages.ts`, and `types` for state and API calls.

---

## Functionalities – How It Works

- **Server-rendered shell:** The outer card (blur, background, border) is rendered on the server in `app/page.tsx` so the first paint matches the final look and reduces flash.
- **Client boundary:** Only `ClientToggle` and its children (TranslatorStart, TranslatorApp) are client components; the rest of the page is server-rendered.
- **Start ↔ Translator:** One boolean in `ClientToggle`; “Let’s Get Started!” sets it to true, the X button in the translator sets it to false.
- **Language selection:** “From” and “To” triggers open a dropdown; options come from `data/languages.ts`. Search filters by name or code. Click outside (or same trigger) closes the dropdown.
- **Translation:** On Translate, `translate()` is called with current input and `from|to`; result is stored and optionally “streamed” into the output area character-by-character.
- **Copy / Clear:** Clipboard API for copy; state reset for clear.
- **Swap:** From and To state are swapped; optional rotation animation on the swap icon.
- **Character limit:** Input length is capped (e.g. 200 chars) and displayed to the user.

---

## Reusing Components in Other Projects

- **RippleButton:** Copy `components/ui/RippleButton.tsx` and the `.ripple-wave` / keyframes from `app/globals.css`. Use `<RippleButton onClick={...}>Label</RippleButton>`.
- **ClientToggle pattern:** Use a single client component with a boolean state that switches between two child views; keep the rest server-rendered.
- **TranslatorStart / TranslatorApp:** Copy the components and `data/languages.ts` + `lib/api.ts` + `types`; replace MyMemory with your own API if needed.
- **useClickOutside:** Import from `hooks/useClickOutside.ts`; call with a ref, a callback, and an `enabled` flag to close dropdowns on outside click.
- **cn():** From `lib/utils.ts` (clsx + tailwind-merge) for conditional and merged class names.

---

## Libraries & Dependencies

| Package                       | Purpose                                                            |
| ----------------------------- | ------------------------------------------------------------------ |
| **next**                      | React framework; App Router, server components, API routes, build. |
| **react / react-dom**         | UI library and DOM renderer.                                       |
| **typescript**                | Type checking and types.                                           |
| **tailwindcss**               | Utility-first CSS (layout, colors, spacing).                       |
| **framer-motion**             | Declarative animations (e.g. `motion.div`, `initial`, `animate`).  |
| **lucide-react**              | Icon set (e.g. Languages, Type, Sparkles).                         |
| **clsx** + **tailwind-merge** | Conditional class names and merging (used in `cn()`).              |
| **shadcn / Base UI**          | Accessible primitives (Card, Input, Button, etc.).                 |
| **tw-animate-css**            | Tailwind-compatible animation classes.                             |

Dev: **ESLint**, **eslint-config-next**, **@types/node**, **@types/react**, **@types/react-dom**, **autoprefixer**, **postcss**.

---

## Example Code Snippets

**Calling the translation API (`lib/api.ts`):**

```ts
import { translate, toApiLangCode } from "@/lib/api";

const from = toApiLangCode("de-DE"); // "de"
const to = toApiLangCode("en"); // "en"
const result = await translate("Hallo Welt", `${from}|${to}`);
// result: "Hello World"
```

**Using RippleButton:**

```tsx
import { RippleButton } from "@/components/ui/RippleButton";

<RippleButton
  className="px-4 py-2 bg-primary text-white rounded"
  onClick={() => console.log("Clicked")}
>
  Click me
</RippleButton>;
```

**Using the `cn()` utility:**

```tsx
import { cn } from "@/lib/utils";

<div className={cn("base-class", isActive && "active-class", className)} />;
```

---

## Keywords

`Language Translator`, `Next.js`, `React`, `TypeScript`, `TailwindCSS`, `Framer Motion`, `MyMemory API`, `Translation API`, `Multilingual`, `Open Source`, `Vercel`, `App Router`, `Server Components`, `shadcn/ui`, `REST API`, `Frontend`, `SPA`, `Educational Project`

---

## Conclusion

This project is a **full-featured language translator** built with the Next.js App Router, React 19, and TypeScript. It shows how to structure a single-page flow (start screen → translator), keep a small client boundary for performance, integrate a third-party REST API (MyMemory), and reuse UI patterns (ripple, dropdown, copy/clear). You can run it without any environment variables, customize title or API URL via `.env.local`, and reuse its components and patterns in your own apps.

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). Feel free to use, modify, and distribute the code as per the terms of the license.

---

## Happy Coding! 🎉

This is an **open-source project** — feel free to use, enhance, and extend it further!

If you have any questions or want to share your work, reach out via GitHub or my portfolio at [https://www.arnobmahmud.com](https://www.arnobmahmud.com).

**Enjoy building and learning!** 🚀

Thank you! 😊
