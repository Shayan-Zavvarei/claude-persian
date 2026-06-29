/**
 * `detect_farsi` tool — classifies the direction and Persian content of text.
 *
 * @module tools/detect_farsi
 */
import { detectDirection, farsiRatio, isFarsiPredominant } from 'rtl-core';
import { z } from 'zod';
import { jsonResult } from '../shared.js';
/** Human-facing recommendation for a detected direction. */
function recommend(direction) {
    switch (direction) {
        case 'rtl':
            return 'Text is right-to-left. Wrap it in an RTL container (see wrap_rtl) for correct rendering.';
        case 'mixed':
            return 'Text mixes RTL and LTR scripts. Wrap per paragraph or isolate Persian spans; an RLM may help leading punctuation.';
        case 'ltr':
        default:
            return 'Text is left-to-right. No RTL handling required.';
    }
}
/**
 * Pure detection logic backing the `detect_farsi` tool.
 *
 * @param text - The text to analyze.
 */
export function detectFarsi(text) {
    const direction = detectDirection(text);
    return {
        isFarsi: isFarsiPredominant(text),
        direction,
        ratio: Number(farsiRatio(text).toFixed(4)),
        recommendation: recommend(direction),
    };
}
const inputSchema = { text: z.string().describe('The text to analyze.') };
const outputSchema = {
    isFarsi: z.boolean(),
    direction: z.enum(['rtl', 'ltr', 'mixed']),
    ratio: z.number(),
    recommendation: z.string(),
};
/** Registers the `detect_farsi` tool on the given server. */
export function registerDetectFarsi(server) {
    server.registerTool('detect_farsi', {
        title: 'Detect Farsi / direction',
        description: 'Detect whether text is predominantly Persian and report its direction (rtl/ltr/mixed) and Persian ratio.',
        inputSchema,
        outputSchema,
    }, async ({ text }) => {
        const result = detectFarsi(text);
        return jsonResult(result);
    });
}
//# sourceMappingURL=detect_farsi.js.map