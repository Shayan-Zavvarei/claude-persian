/**
 * `normalize_farsi` tool — converts Arabic-script characters to Persian equivalents.
 *
 * @module tools/normalize_farsi
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export type NormalizeFarsiResult = {
    normalized: string;
    changes: number;
};
/**
 * Pure normalization logic backing the `normalize_farsi` tool, including a count of
 * how many characters were changed (rewritten characters + removed ZWNJ).
 *
 * @param text - The text to normalize.
 */
export declare function normalizeFarsi(text: string): NormalizeFarsiResult;
/** Registers the `normalize_farsi` tool on the given server. */
export declare function registerNormalizeFarsi(server: McpServer): void;
