"use strict";
/**
 * Direction and Persian-script detection.
 *
 * @module detector
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_THRESHOLD = void 0;
exports.farsiRatio = farsiRatio;
exports.isFarsiPredominant = isFarsiPredominant;
exports.detectDirection = detectDirection;
const unicode_1 = require("./unicode");
/** Default ratio of Persian letters at or above which text is considered RTL-predominant. */
exports.DEFAULT_THRESHOLD = 0.3;
/** Returns `true` for a Latin-script letter codepoint (basic ASCII + Latin-1/Extended-A). */
function isLatinLetter(codePoint) {
    return ((codePoint >= 0x41 && codePoint <= 0x5a) || // A–Z
        (codePoint >= 0x61 && codePoint <= 0x7a) || // a–z
        (codePoint >= 0xc0 && codePoint <= 0x24f) // Latin-1 Supplement + Extended-A
    );
}
/** Counts Persian and Latin letters in `text`, ignoring digits, punctuation and whitespace. */
function countScripts(text) {
    let farsi = 0;
    let latin = 0;
    for (const ch of text) {
        const cp = ch.codePointAt(0);
        if (cp === undefined)
            continue;
        if ((0, unicode_1.isFarsiCodePoint)(cp)) {
            farsi++;
        }
        else if (isLatinLetter(cp)) {
            latin++;
        }
    }
    return { farsi, latin };
}
/**
 * Ratio of Persian letters to all directional (Persian + Latin) letters, in `[0, 1]`.
 * Digits, punctuation and whitespace are ignored. Returns `0` when there are no letters.
 *
 * @param text - The text to measure.
 */
function farsiRatio(text) {
    const { farsi, latin } = countScripts(text);
    const total = farsi + latin;
    if (total === 0)
        return 0;
    return farsi / total;
}
/**
 * Returns `true` when the ratio of Persian letters meets or exceeds `threshold`.
 *
 * @param text - The text to test.
 * @param threshold - Minimum Persian ratio in `[0, 1]` (default {@link DEFAULT_THRESHOLD}).
 */
function isFarsiPredominant(text, threshold = exports.DEFAULT_THRESHOLD) {
    return farsiRatio(text) >= threshold;
}
/**
 * Detects the overall direction of `text`.
 * - `'rtl'` when only Persian letters are present,
 * - `'ltr'` when only Latin letters (or no letters) are present,
 * - `'mixed'` when both scripts appear together.
 *
 * @param text - The text to classify.
 */
function detectDirection(text) {
    const { farsi, latin } = countScripts(text);
    if (farsi > 0 && latin > 0)
        return 'mixed';
    if (farsi > 0)
        return 'rtl';
    return 'ltr';
}
//# sourceMappingURL=detector.js.map