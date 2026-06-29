/**
 * Per-document RTL direction state (detected, with optional manual override).
 *
 * @module state
 */

import * as vscode from 'vscode';
import { isFarsiPredominant } from 'rtl-core';

/** Manual direction overrides keyed by document URI. */
const overrides = new Map<string, boolean>();

/** Reads the configured detection threshold (`rtlPersian.threshold`). */
export function getThreshold(): number {
  return vscode.workspace.getConfiguration('rtlPersian').get<number>('threshold', 0.3);
}

/**
 * Resolves whether a document should be treated as RTL: a manual override if present,
 * otherwise auto-detection against the configured threshold.
 */
export function isRtl(document: vscode.TextDocument): boolean {
  const key = document.uri.toString();
  const override = overrides.get(key);
  if (override !== undefined) return override;
  return isFarsiPredominant(document.getText(), getThreshold());
}

/** Flips the direction override for a document and returns the new value. */
export function toggle(document: vscode.TextDocument): boolean {
  const next = !isRtl(document);
  overrides.set(document.uri.toString(), next);
  return next;
}
