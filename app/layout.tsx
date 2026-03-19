/**
 * Root layout: fonts, global metadata, favicon, and max-w-9xl wrapper.
 * All pages render inside the same layout for consistent typography and SEO.
 *
 * WALKTHROUGH:
 * - This is a Server Component (no "use client"). It runs on the server and
 *   sends HTML + metadata to the client. Good for SEO and first paint.
 * - Fonts are loaded via next/font/google and exposed as CSS variables;
 *   display: "optional" reduces layout shift when fonts load.
 * - metadata export drives <title>, <meta>, Open Graph, and Twitter cards.
 */
import type { Metadata } from "next";
import {
  Russo_One,
  Righteous,
  Noto_Sans_JP,
  Shojumaru,
  Geist,
} from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/lib/utils";

// Next.js font optimization: self-hosted, no external request at runtime
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const russoOne = Russo_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-russo-one",
  display: "optional",
});

const righteous = Righteous({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-righteous",
  display: "optional",
});

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "optional",
});

const shojumaru = Shojumaru({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-shojumaru",
  display: "optional",
});

// Used in metadata; env allows custom title without code change
const appTitle =
  process.env.NEXT_PUBLIC_APP_TITLE ?? "Language Translator";
const appDescription =
  "A modern, user-friendly language translator built with Next.js, React, and TypeScript. Translate text between dozens of languages instantly with the MyMemory API. Responsive UI, TailwindCSS, Framer Motion.";
const productionUrl = "https://langs-translator.vercel.app";

export const metadata: Metadata = {
  title: {
    default: appTitle,
    template: `%s | ${appTitle}`,
  },
  description: appDescription,
  applicationName: appTitle,
  authors: [
    {
      name: "Arnob Mahmud",
      url: "https://www.arnobmahmud.com",
    },
  ],
  keywords: [
    "language translator",
    "translate text",
    "MyMemory API",
    "Next.js",
    "React",
    "TypeScript",
    "TailwindCSS",
    "Framer Motion",
    "multilingual",
    "translation app",
    "open source",
    "Vercel",
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  metadataBase: new URL(productionUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: productionUrl,
    siteName: appTitle,
    title: appTitle,
    description: appDescription,
    emails: ["contact@arnobmahmud.com"],
  },
  twitter: {
    card: "summary_large_image",
    title: appTitle,
    description: appDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

/** Root layout: wraps every page. children is the current route (e.g. app/page.tsx). */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        russoOne.variable,
        righteous.variable,
        notoSansJp.variable,
        shojumaru.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <head>
        {/* Preload hero image so it’s ready for first paint */}
        <link rel="preload" href="/hero1.webp" as="image" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        />
        {/* Critical card-shell styles in head to avoid flash before Tailwind loads */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .card-shell{background-color:rgba(0,0,0,.5);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.1);transform:translateZ(0)}
            `,
          }}
        />
      </head>
      <body
        className="font-russoOne antialiased min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundColor: "#1a1a24",
          backgroundImage: "url('/hero1.webp')",
        }}
        suppressHydrationWarning
      >
        <div className="w-full max-w-9xl mx-auto min-h-screen">{children}</div>
      </body>
    </html>
  );
}
