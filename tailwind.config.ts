import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0b0e",
        panel: "#ffffff",
        line: "#dedede",
        muted: "#707070",
        bitcoin: "#f7931a",
        success: "#16c784",
        danger: "#ea3943",
      },
      boxShadow: {
        soft: "0 14px 44px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
