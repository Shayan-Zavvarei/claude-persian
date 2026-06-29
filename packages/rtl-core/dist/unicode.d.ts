/**
 * Unicode constants and ranges used across RTL/Persian detection and fixing.
 *
 * @module unicode
 */
/** Right-to-Left Mark (U+200F). Forces following neutral characters to render RTL. */
export declare const RLM = "\u200F";
/** Left-to-Right Mark (U+200E). Forces following neutral characters to render LTR. */
export declare const LRM = "\u200E";
/** Zero-Width Non-Joiner (U+200C). Separates Persian letters without joining them. */
export declare const ZWNJ = "\u200C";
/** Zero-Width Joiner (U+200D). Forces a joining form between letters. */
export declare const ZWJ = "\u200D";
/**
 * Unicode codepoint ranges (inclusive) considered "Persian/Arabic script".
 * - U+0600–U+06FF: Arabic
 * - U+FB50–U+FDFF: Arabic Presentation Forms-A
 * - U+FE70–U+FEFF: Arabic Presentation Forms-B
 */
export declare const FARSI_RANGES: ReadonlyArray<readonly [number, number]>;
/**
 * Returns `true` when the given codepoint falls within any {@link FARSI_RANGES} range.
 *
 * @param codePoint - A Unicode codepoint (e.g. from `String.prototype.codePointAt`).
 */
export declare function isFarsiCodePoint(codePoint: number): boolean;
/**
 * Returns `true` for characters that are "neutral" for direction-counting purposes:
 * whitespace, ASCII digits, punctuation and other symbols that do not by themselves
 * indicate a script. Used so that, e.g., `"سلام!"` is not diluted by the `!`.
 *
 * @param codePoint - A Unicode codepoint.
 */
export declare function isNeutralCodePoint(codePoint: number): boolean;
