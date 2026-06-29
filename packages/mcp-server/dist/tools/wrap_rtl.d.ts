/**
 * `wrap_rtl` tool — wraps text so it renders right-to-left.
 *
 * @module tools/wrap_rtl
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export type WrapFormat = 'html' | 'markdown';
export type WrapRtlResult = {
    wrapped: string;
    format: WrapFormat;
};
/**
 * Pure wrapping logic backing the `wrap_rtl` tool.
 * - `html` wraps the text in an RTL `<div>`.
 * - `markdown` prepends a Right-to-Left Mark to every line.
 *
 * @param text - The text to wrap.
 * @param format - Output format.
 */
export declare function wrapRtl(text: string, format: WrapFormat): WrapRtlResult;
/** Registers the `wrap_rtl` tool on the given server. */
export declare function registerWrapRtl(server: McpServer): void;
