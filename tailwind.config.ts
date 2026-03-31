import type { Config } from "tailwindcss";
import gsMarketingUiPreset from "@genius-sports/gs-marketing-ui/tailwind-preset";

export default {
  presets: [gsMarketingUiPreset],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./node_modules/@genius-sports/gs-marketing-ui/dist/**/*.{js,mjs}",
  ],
} satisfies Config;
