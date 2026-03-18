import type { Metadata } from "next";
import {
  Russo_One,
  Righteous,
  Noto_Sans_JP,
  Shojumaru, Geist } from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const russoOne = Russo_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-russo-one",
  display: "swap",
});

const righteous = Righteous({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-righteous",
  display: "swap",
});

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const shojumaru = Shojumaru({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-shojumaru",
  display: "swap",
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_TITLE ?? "Translator App",
  description:
    "Translate text between multiple languages with the MyMemory API.",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(russoOne.variable, righteous.variable, notoSansJp.variable, shojumaru.variable, "font-sans", geist.variable)}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        />
      </head>
      <body className="font-russoOne antialiased min-h-screen">
        <div className="w-full max-w-9xl mx-auto min-h-screen">{children}</div>
      </body>
    </html>
  );
}
