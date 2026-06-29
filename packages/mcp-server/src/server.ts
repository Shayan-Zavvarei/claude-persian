/**
 * Builds the RTL/Persian MCP server and registers all tools.
 *
 * @module server
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerDetectFarsi } from './tools/detect_farsi.js';
import { registerFixRtl } from './tools/fix_rtl.js';
import { registerWrapRtl } from './tools/wrap_rtl.js';
import { registerNormalizeFarsi } from './tools/normalize_farsi.js';

/** Server name advertised to MCP clients. */
export const SERVER_NAME = 'rtl-persian';

/** Server version advertised to MCP clients. */
export const SERVER_VERSION = '1.0.0';

/**
 * Creates a fully configured {@link McpServer} with all four RTL/Persian tools
 * (`detect_farsi`, `fix_rtl`, `wrap_rtl`, `normalize_farsi`) registered.
 */
export function createServer(): McpServer {
  const server = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION });
  registerDetectFarsi(server);
  registerFixRtl(server);
  registerWrapRtl(server);
  registerNormalizeFarsi(server);
  return server;
}
