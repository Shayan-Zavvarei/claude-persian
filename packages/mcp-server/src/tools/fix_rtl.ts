/**
 * `fix_rtl` tool — normalizes Persian text and applies RTL formatting.
 *
 * @module tools/fix_rtl
 */

import { addRTLMark, detectDirection, fixPunctuation, normalizeFarsi, wrapRTL } from 'rtl-core';
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { jsonResult } from '../shared.js';

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
export function fixRtl(text: string, mode: FixMode): FixRtlResult {
  const changes: string[] = [];

  const normalized = normalizeFarsi(text);
  if (normalized !== text) {
    changes.push('Normalized Arabic characters to Persian and removed redundant ZWNJ.');
  }

  const punctuated = fixPunctuation(normalized);
  if (punctuated !== normalized) {
    changes.push('Converted ASCII punctuation to Persian punctuation.');
  }

  const hasRTL = detectDirection(text) !== 'ltr';
  let fixed = punctuated;

  if (mode === 'html') {
    fixed = wrapRTL(punctuated);
    changes.push('Wrapped text in an RTL HTML container.');
  } else if (mode === 'markdown') {
    let count = 0;
    fixed = punctuated
      .split('\n')
      .map((line) => {
        if (line.length > 0 && detectDirection(line) !== 'ltr') {
          count++;
          return addRTLMark(line);
        }
        return line;
      })
      .join('\n');
    if (count > 0) changes.push(`Added a Right-to-Left Mark to ${count} line(s).`);
  }

  return { fixed, changes, hasRTL };
}

const inputSchema = {
  text: z.string().describe('The text to fix.'),
  mode: z.enum(['html', 'markdown', 'plain']).describe('Output formatting mode.'),
};
const outputSchema = {
  fixed: z.string(),
  changes: z.array(z.string()),
  hasRTL: z.boolean(),
};

/** Registers the `fix_rtl` tool on the given server. */
export function registerFixRtl(server: McpServer): void {
  server.registerTool(
    'fix_rtl',
    {
      title: 'Fix RTL / Persian text',
      description: 'Normalize Persian characters and punctuation, then format the text for RTL (html, markdown or plain).',
      inputSchema,
      outputSchema,
    },
    async ({ text, mode }) => jsonResult(fixRtl(text, mode)),
  );
}
