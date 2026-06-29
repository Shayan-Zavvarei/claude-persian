/**
 * `fix_rtl` tool — normalizes Persian text and applies RTL formatting.
 *
 * @module tools/fix_rtl
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export type FixMode = 'html' | 'markdown' | 'plain';
export type FixRtlResult = {
    fixed: string;
    changes: string[];
    hasRTL: boolean;
};
/**
 * Pure fixing logic backing the `fix_rtl` tool: normalizes characters, fixes
 * punctuation, then applies formatting according to `mode`.
 *
 * @param text - The text to fix.
 * @param mode - Output formatting: `html` (RTL div), `markdown` (RLM per line) or `plain`.
 */
export declare function fixRtl(text: string, mode: FixMode): FixRtlResult;
/** Registers the `fix_rtl` tool on the given server. */
export declare function registerFixRtl(server: McpServer): void;
