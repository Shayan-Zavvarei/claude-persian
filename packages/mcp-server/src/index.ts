#!/usr/bin/env node
/**
 * Entry point: starts the RTL/Persian MCP server over stdio.
 *
 * @module index
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';

async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // The process now stays alive serving requests over stdio.
}

main().catch((error: unknown) => {
  console.error('[rtl-persian] fatal error:', error);
  process.exit(1);
});
