const ACRONYM_TOKEN_PATTERN = /^[A-Z0-9]{2,4}$/;

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
  return name
    .split(/\s+/)
    .map((token) => toDisplayToken(token))
    .join(" ")
    .trim();
}
