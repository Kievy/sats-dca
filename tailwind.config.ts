import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        app: "var(--color-app)",
        ink: "var(--color-ink)",
        panel: "var(--color-panel)",
        field: "var(--color-field)",
        subtle: "var(--color-subtle)",
        line: "var(--color-line)",
        muted: "var(--color-muted)",
        action: "var(--color-action)",
        actionText: "var(--color-action-text)",
        hero: "var(--color-hero)",
        heroText: "var(--color-hero-text)",
        bitcoin: "#f7931a",
        success: "#16c784",
        danger: "#ea3943",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
      },
    },
  },
  plugins: [],
};

export default config;
