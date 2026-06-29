/**
 * Text fixing, normalization and RTL-wrapping helpers.
 *
 * @module fixer
 */
/** Default font stack applied to RTL containers. */
export declare const DEFAULT_FONT_FAMILY = "Vazirmatn, Tahoma, sans-serif";
/**
 * Normalizes Persian text by converting common Arabic-script characters to their
 * Persian equivalents (e.g. `ك` → `ک`, `ي` → `ی`), collapsing alef-hamza/madda
 * forms, unifying digits, and removing redundant ZWNJ.
 *
 * @param text - The text to normalize.
 * @returns The normalized text.
 */
export declare function normalizeFarsi(text: string): string;
/**
 * Removes redundant Zero-Width Non-Joiners: collapses consecutive runs to a single
 * ZWNJ, strips ZWNJ adjacent to whitespace, and trims them from the string ends.
 *
 * @param text - The text to clean.
 * @returns The cleaned text.
 */
export declare function removeExtraZWNJ(text: string): string;
/**
 * Converts ASCII punctuation (`,` `;` `?`) to its Persian equivalent, but only when
 * it follows a Persian-script character (optionally separated by spaces), so that
 * embedded English text is left untouched.
 *
 * @param text - The text to fix.
 * @returns The text with Persian punctuation applied where appropriate.
 */
export declare function fixPunctuation(text: string): string;
/**
 * Prepends a Right-to-Left Mark (U+200F) so that leading neutral characters render
 * in RTL order. Returns the text unchanged if it already starts with an RLM.
 *
 * @param text - The text to mark.
 * @returns The text prefixed with an RLM.
 */
export declare function addRTLMark(text: string): string;
/**
 * Wraps text in an HTML container forcing right-to-left layout and a Persian font.
 *
 * @param text - The text to wrap.
 * @param fontFamily - Font stack for the container (default {@link DEFAULT_FONT_FAMILY}).
 * @returns An HTML `<div dir="rtl">` string.
 */
export declare function wrapRTL(text: string, fontFamily?: string): string;
