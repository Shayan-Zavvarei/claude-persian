/**
 * Text fixing, normalization and RTL-wrapping helpers.
 *
 * @module fixer
 */

import { RLM, ZWNJ } from './unicode';

/** Default font stack applied to RTL containers. */
export const DEFAULT_FONT_FAMILY = 'Vazirmatn, Tahoma, sans-serif';

/**
 * Character-level normalization map: Arabic-script characters that have a
 * canonical Persian counterpart. Applied by {@link normalizeFarsi}.
 */
const NORMALIZE_MAP: ReadonlyArray<readonly [RegExp, string]> = [
  [/ك/g, 'ک'], // ARABIC KAF ك -> PERSIAN KEHEH ک
  [/ي/g, 'ی'], // ARABIC YEH ي -> PERSIAN YEH ی
  [/ى/g, 'ی'], // ARABIC ALEF MAKSURA ى -> PERSIAN YEH ی
  [/أ/g, 'ا'], // ARABIC ALEF WITH HAMZA ABOVE أ -> ALEF ا
  [/إ/g, 'ا'], // ARABIC ALEF WITH HAMZA BELOW إ -> ALEF ا
  [/ٱ/g, 'ا'], // ARABIC ALEF WASLA ٱ -> ALEF ا
  [/آ/g, 'آ'], // ALEF + COMBINING MADDA -> precomposed ALEF MADDA آ
];

/** Arabic-Indic digits (٠–٩) mapped to Persian (Extended Arabic-Indic) digits (۰–۹). */
const ARABIC_TO_PERSIAN_DIGITS: ReadonlyArray<readonly [RegExp, string]> = Array.from(
  { length: 10 },
  (_unused, i) => [new RegExp(String.fromCharCode(0x0660 + i), 'g'), String.fromCharCode(0x06f0 + i)] as const,
);

/**
 * Normalizes Persian text by converting common Arabic-script characters to their
 * Persian equivalents (e.g. `ك` → `ک`, `ي` → `ی`), collapsing alef-hamza/madda
 * forms, unifying digits, and removing redundant ZWNJ.
 *
 * @param text - The text to normalize.
 * @returns The normalized text.
 */
export function normalizeFarsi(text: string): string {
  let result = text;
  for (const [pattern, replacement] of NORMALIZE_MAP) {
    result = result.replace(pattern, replacement);
  }
  for (const [pattern, replacement] of ARABIC_TO_PERSIAN_DIGITS) {
    result = result.replace(pattern, replacement);
  }
  return removeExtraZWNJ(result);
}

/**
 * Removes redundant Zero-Width Non-Joiners: collapses consecutive runs to a single
 * ZWNJ, strips ZWNJ adjacent to whitespace, and trims them from the string ends.
 *
 * @param text - The text to clean.
 * @returns The cleaned text.
 */
export function removeExtraZWNJ(text: string): string {
  return text
    .replace(/‌{2,}/g, ZWNJ) // collapse runs of ZWNJ
    .replace(/‌(?=\s)|(?<=\s)‌/g, '') // drop ZWNJ touching whitespace
    .replace(/^‌+|‌+$/g, ''); // trim leading/trailing ZWNJ
}

/** ASCII punctuation mapped to its Persian equivalent, used by {@link fixPunctuation}. */
const PUNCTUATION_MAP: Readonly<Record<string, string>> = {
  ',': '،', // ARABIC COMMA ،
  ';': '؛', // ARABIC SEMICOLON ؛
  '?': '؟', // ARABIC QUESTION MARK ؟
};

/**
 * Converts ASCII punctuation (`,` `;` `?`) to its Persian equivalent, but only when
 * it follows a Persian-script character (optionally separated by spaces), so that
 * embedded English text is left untouched.
 *
 * @param text - The text to fix.
 * @returns The text with Persian punctuation applied where appropriate.
 */
export function fixPunctuation(text: string): string {
  return text.replace(/([؀-ۿ])(\s*)([,;?])/g, (_match, letter: string, gap: string, punct: string) => {
    return `${letter}${gap}${PUNCTUATION_MAP[punct] ?? punct}`;
  });
}

/**
 * Prepends a Right-to-Left Mark (U+200F) so that leading neutral characters render
 * in RTL order. Returns the text unchanged if it already starts with an RLM.
 *
 * @param text - The text to mark.
 * @returns The text prefixed with an RLM.
 */
export function addRTLMark(text: string): string {
  return text.startsWith(RLM) ? text : RLM + text;
}

/**
 * Wraps text in an HTML container forcing right-to-left layout and a Persian font.
 *
 * @param text - The text to wrap.
 * @param fontFamily - Font stack for the container (default {@link DEFAULT_FONT_FAMILY}).
 * @returns An HTML `<div dir="rtl">` string.
 */
export function wrapRTL(text: string, fontFamily: string = DEFAULT_FONT_FAMILY): string {
  return `<div dir="rtl" style="text-align:right;font-family:${fontFamily}">${text}</div>`;
}
