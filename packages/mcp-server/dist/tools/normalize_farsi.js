/**
 * `normalize_farsi` tool — converts Arabic-script characters to Persian equivalents.
 *
 * @module tools/normalize_farsi
 */
import { normalizeFarsi as normalize } from 'rtl-core';
import { z } from 'zod';
import { jsonResult } from '../shared.js';
/** Characters that {@link normalize} rewrites to a Persian form. */
const REWRITTEN_CHARS = /[كيىأإٱ٠-٩ٓ]/g;
const ZWNJ_RE = /‌/g;
/** Counts how many ZWNJ are in `text`. */
function countZWNJ(text) {
    return (text.match(ZWNJ_RE) ?? []).length;
}
/**
 * Pure normalization logic backing the `normalize_farsi` tool, including a count of
 * how many characters were changed (rewritten characters + removed ZWNJ).
 *
 * @param text - The text to normalize.
 */
export function normalizeFarsi(text) {
    const normalized = normalize(text);
    const rewritten = (text.match(REWRITTEN_CHARS) ?? []).length;
    const zwnjRemoved = Math.max(0, countZWNJ(text) - countZWNJ(normalized));
    return { normalized, changes: rewritten + zwnjRemoved };
}
const inputSchema = { text: z.string().describe('The text to normalize.') };
const outputSchema = { normalized: z.string(), changes: z.number() };
/** Registers the `normalize_farsi` tool on the given server. */
export function registerNormalizeFarsi(server) {
    server.registerTool('normalize_farsi', {
        title: 'Normalize Farsi characters',
        description: 'Convert Arabic-script characters to their Persian equivalents (ك→ک, ي→ی, أإٱ→ا, digits) and remove redundant ZWNJ.',
        inputSchema,
        outputSchema,
    }, async ({ text }) => jsonResult(normalizeFarsi(text)));
}
//# sourceMappingURL=normalize_farsi.js.map