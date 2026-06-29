"use strict";
/**
 * Unicode constants and ranges used across RTL/Persian detection and fixing.
 *
 * @module unicode
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FARSI_RANGES = exports.ZWJ = exports.ZWNJ = exports.LRM = exports.RLM = void 0;
exports.isFarsiCodePoint = isFarsiCodePoint;
exports.isNeutralCodePoint = isNeutralCodePoint;
/** Right-to-Left Mark (U+200F). Forces following neutral characters to render RTL. */
exports.RLM = '‏';
/** Left-to-Right Mark (U+200E). Forces following neutral characters to render LTR. */
exports.LRM = '‎';
/** Zero-Width Non-Joiner (U+200C). Separates Persian letters without joining them. */
exports.ZWNJ = '‌';
/** Zero-Width Joiner (U+200D). Forces a joining form between letters. */
exports.ZWJ = '‍';
/**
 * Unicode codepoint ranges (inclusive) considered "Persian/Arabic script".
 * - U+0600–U+06FF: Arabic
 * - U+FB50–U+FDFF: Arabic Presentation Forms-A
 * - U+FE70–U+FEFF: Arabic Presentation Forms-B
 */
exports.FARSI_RANGES = [
    [0x0600, 0x06ff],
    [0xfb50, 0xfdff],
    [0xfe70, 0xfeff],
];
/**
 * Returns `true` when the given codepoint falls within any {@link FARSI_RANGES} range.
 *
 * @param codePoint - A Unicode codepoint (e.g. from `String.prototype.codePointAt`).
 */
function isFarsiCodePoint(codePoint) {
    for (const [start, end] of exports.FARSI_RANGES) {
        if (codePoint >= start && codePoint <= end) {
            return true;
        }
    }
    return false;
}
/**
 * Returns `true` for characters that are "neutral" for direction-counting purposes:
 * whitespace, ASCII digits, punctuation and other symbols that do not by themselves
 * indicate a script. Used so that, e.g., `"سلام!"` is not diluted by the `!`.
 *
 * @param codePoint - A Unicode codepoint.
 */
function isNeutralCodePoint(codePoint) {
    // Whitespace / control
    if (codePoint <= 0x20)
        return true;
    // ASCII punctuation and symbols (but not letters or digits-as-letters)
    const isAsciiDigit = codePoint >= 0x30 && codePoint <= 0x39;
    const isAsciiPunct = (codePoint >= 0x21 && codePoint <= 0x2f) ||
        (codePoint >= 0x3a && codePoint <= 0x40) ||
        (codePoint >= 0x5b && codePoint <= 0x60) ||
        (codePoint >= 0x7b && codePoint <= 0x7e);
    return isAsciiDigit || isAsciiPunct;
}
//# sourceMappingURL=unicode.js.map