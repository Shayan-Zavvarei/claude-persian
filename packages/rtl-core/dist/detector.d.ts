/**
 * Direction and Persian-script detection.
 *
 * @module detector
 */
/** Resolved text direction. */
export type Direction = 'rtl' | 'ltr' | 'mixed';
/** Default ratio of Persian letters at or above which text is considered RTL-predominant. */
export declare const DEFAULT_THRESHOLD = 0.3;
/**
 * Ratio of Persian letters to all directional (Persian + Latin) letters, in `[0, 1]`.
 * Digits, punctuation and whitespace are ignored. Returns `0` when there are no letters.
 *
 * @param text - The text to measure.
 */
export declare function farsiRatio(text: string): number;
/**
 * Returns `true` when the ratio of Persian letters meets or exceeds `threshold`.
 *
 * @param text - The text to test.
 * @param threshold - Minimum Persian ratio in `[0, 1]` (default {@link DEFAULT_THRESHOLD}).
 */
export declare function isFarsiPredominant(text: string, threshold?: number): boolean;
/**
 * Detects the overall direction of `text`.
 * - `'rtl'` when only Persian letters are present,
 * - `'ltr'` when only Latin letters (or no letters) are present,
 * - `'mixed'` when both scripts appear together.
 *
 * @param text - The text to classify.
 */
export declare function detectDirection(text: string): Direction;
