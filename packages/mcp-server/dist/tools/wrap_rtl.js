/**
 * `wrap_rtl` tool — wraps text so it renders right-to-left.
 *
 * @module tools/wrap_rtl
 */
import { addRTLMark, wrapRTL } from 'rtl-core';
import { z } from 'zod';
import { jsonResult } from '../shared.js';
/**
 * Pure wrapping logic backing the `wrap_rtl` tool.
 * - `html` wraps the text in an RTL `<div>`.
 * - `markdown` prepends a Right-to-Left Mark to every line.
 *
 * @param text - The text to wrap.
 * @param format - Output format.
 */
export function wrapRtl(text, format) {
    if (format === 'html') {
        return { wrapped: wrapRTL(text), format };
    }
    const wrapped = text
        .split('\n')
        .map((line) => (line.length > 0 ? addRTLMark(line) : line))
        .join('\n');
    return { wrapped, format };
}
const inputSchema = {
    text: z.string().describe('The text to wrap.'),
    format: z.enum(['html', 'markdown']).describe('Output format: an RTL HTML div, or RLM-prefixed markdown lines.'),
};
const outputSchema = { wrapped: z.string(), format: z.enum(['html', 'markdown']) };
/** Registers the `wrap_rtl` tool on the given server. */
export function registerWrapRtl(server) {
    server.registerTool('wrap_rtl', {
        title: 'Wrap text RTL',
        description: 'Wrap text for right-to-left rendering: an RTL HTML div (html) or RLM-prefixed lines (markdown).',
        inputSchema,
        outputSchema,
    }, async ({ text, format }) => jsonResult(wrapRtl(text, format)));
}
//# sourceMappingURL=wrap_rtl.js.map