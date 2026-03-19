import type { Config } from "tailwindcss";

/** Minimal type for Tailwind plugin API (addUtilities). */
interface TailwindPluginAPI {
  addUtilities: (utilities: Record<string, Record<string, string | Record<string, string>>>) => void;
}

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)" },
        secondary: { DEFAULT: "var(--secondary)", foreground: "var(--secondary-foreground)" },
        destructive: "var(--destructive)",
        muted: { DEFAULT: "var(--muted)", foreground: "var(--muted-foreground)" },
        accent: { DEFAULT: "var(--accent)", foreground: "var(--accent-foreground)" },
        card: { DEFAULT: "var(--card)", foreground: "var(--card-foreground)" },
      },
      maxWidth: {
        "9xl": "96rem",
      },
      fontFamily: {
        righteous: ["var(--font-righteous)", "sans-serif"],
        russoOne: ["var(--font-russo-one)", "sans-serif"],
        notoSansJp: ["var(--font-noto-sans-jp)", "sans-serif"],
        shojumaru: ["var(--font-shojumaru)", "system-ui"],
      },
      keyframes: {
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.8" },
          "100%": { transform: "scale(25)", opacity: "0" },
        },
      },
      animation: {
        ripple: "ripple 0.75s ease-out forwards",
      },
    },
  },
  plugins: [
    function (api: TailwindPluginAPI) {
      api.addUtilities({
        ".scrollbar-hide": {
          "::-webkit-scrollbar": { display: "none" },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
      });
    },
  ],
};

export default config;
