/**
 * `detect_farsi` tool — classifies the direction and Persian content of text.
 *
 * @module tools/detect_farsi
 */
import { type Direction } from 'rtl-core';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export type DetectFarsiResult = {
    isFarsi: boolean;
    direction: Direction;
    ratio: number;
    recommendation: string;
};
/**
 * Pure detection logic backing the `detect_farsi` tool.
 *
 * @param text - The text to analyze.
 */
export declare function detectFarsi(text: string): DetectFarsiResult;
/** Registers the `detect_farsi` tool on the given server. */
export declare function registerDetectFarsi(server: McpServer): void;
