const ACRONYM_TOKEN_PATTERN = /^[A-Z0-9]{2,4}$/;
const BRAND_DISPLAY_OVERRIDES: Record<string, string> = {
  AIRBNB: "AirBnB",
  FORD: "Ford",
};

function toDisplayWord(word: string): string {
  if (!word) return word;
  if (ACRONYM_TOKEN_PATTERN.test(word)) return word;

  const lower = word.toLowerCase();
  return `${lower.charAt(0).toUpperCase()}${lower.slice(1)}`;
}

function toDisplayToken(token: string): string {
  if (!token) return token;
  if (ACRONYM_TOKEN_PATTERN.test(token)) return token;

  return token
    .split(/([-/])/)
    .map((segment) => (segment === "-" || segment === "/" ? segment : toDisplayWord(segment)))
    .join("");
}

export function formatBrandDisplayName(name: string): string {
  const override = BRAND_DISPLAY_OVERRIDES[name.toUpperCase()];
  if (override) return override;

  return name
    .split(/\s+/)
    .map((token) => toDisplayToken(token))
    .join(" ")
    .trim();
}
