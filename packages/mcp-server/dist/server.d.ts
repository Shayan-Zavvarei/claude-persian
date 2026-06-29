/**
 * Builds the RTL/Persian MCP server and registers all tools.
 *
 * @module server
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
/** Server name advertised to MCP clients. */
export declare const SERVER_NAME = "rtl-persian";
/** Server version advertised to MCP clients. */
export declare const SERVER_VERSION = "1.0.0";
/**
 * Creates a fully configured {@link McpServer} with all four RTL/Persian tools
 * (`detect_farsi`, `fix_rtl`, `wrap_rtl`, `normalize_farsi`) registered.
 */
export declare function createServer(): McpServer;
