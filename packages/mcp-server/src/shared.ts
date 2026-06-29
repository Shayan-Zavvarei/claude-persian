/**
 * Shared helpers for MCP tool handlers.
 *
 * @module shared
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

/**
 * Builds a tool result that returns `data` both as pretty JSON text (for clients that
 * only render text) and as structured content (validated against the tool's outputSchema).
 *
 * @param data - The structured payload to return.
 */
export function jsonResult(data: Record<string, unknown>): CallToolResult {
  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
    structuredContent: data,
  };
}
