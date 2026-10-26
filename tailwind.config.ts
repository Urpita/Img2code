import type { Config } from "tailwindcss";

const c = (v: string) => `hsl(var(--${v}))`;

export default {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Segoe UI", "system-ui", "sans-serif"],
        serif: ["Instrument Serif", "Georgia", "serif"],
        display: ["BubbledotICG-FinePos", "Geist Pixel Circle", "monospace"],
      },
      colors: {
        background: c("background"),
        foreground: c("foreground"),
        card: c("card"),
        primary: c("primary"),
        "primary-foreground": c("primary-foreground"),
        secondary: c("secondary"),
        muted: c("muted"),
        "muted-foreground": c("muted-foreground"),
        accent: c("accent"),
        border: c("border"),
        input: c("input"),
        ring: c("ring"),
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
