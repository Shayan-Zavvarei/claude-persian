/**
 * Command implementations for the RTL Persian extension.
 *
 * @module commands
 */

import * as vscode from 'vscode';
import { RLM, fixPunctuation, normalizeFarsi } from 'rtl-core';
import { toggle } from './state';
import type { RtlStatusBar } from './statusBar';

/** Normalizes characters and fixes punctuation. */
function fixText(text: string): string {
  return fixPunctuation(normalizeFarsi(text));
}

/** A `Range` covering the entire document. */
function fullRange(document: vscode.TextDocument): vscode.Range {
  return new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length));
}

/** Replaces a range with `next` only if it differs from the current content. */
async function applyIfChanged(
  editor: vscode.TextEditor,
  range: vscode.Range,
  next: string,
): Promise<boolean> {
  const current = editor.document.getText(range);
  if (current === next) return false;
  return editor.edit((builder) => builder.replace(range, next));
}

/** `rtl-persian.fixCurrentFile` — normalize + fix punctuation across the whole file. */
export async function fixCurrentFile(editor: vscode.TextEditor): Promise<void> {
  const range = fullRange(editor.document);
  const changed = await applyIfChanged(editor, range, fixText(editor.document.getText(range)));
  void vscode.window.showInformationMessage(
    changed ? 'RTL Persian: file fixed.' : 'RTL Persian: nothing to fix.',
  );
}

/** `rtl-persian.fixSelection` — fix each non-empty selection (or the whole file if none). */
export async function fixSelection(editor: vscode.TextEditor): Promise<void> {
  const selections = editor.selections.filter((s) => !s.isEmpty);
  if (selections.length === 0) {
    await fixCurrentFile(editor);
    return;
  }
  await editor.edit((builder) => {
    for (const selection of selections) {
      builder.replace(selection, fixText(editor.document.getText(selection)));
    }
  });
}

/** `rtl-persian.normalizeFile` — normalize Persian characters across the whole file. */
export async function normalizeFile(editor: vscode.TextEditor): Promise<void> {
  const range = fullRange(editor.document);
  const changed = await applyIfChanged(editor, range, normalizeFarsi(editor.document.getText(range)));
  void vscode.window.showInformationMessage(
    changed ? 'RTL Persian: characters normalized.' : 'RTL Persian: already normalized.',
  );
}

/** `rtl-persian.insertRLM` — insert a Right-to-Left Mark at every cursor. */
export async function insertRLM(editor: vscode.TextEditor): Promise<void> {
  await editor.edit((builder) => {
    for (const selection of editor.selections) {
      builder.insert(selection.active, RLM);
    }
  });
}

/**
 * `rtl-persian.toggleDirection` — flip the active file's direction state, sync word wrap
 * and refresh the status bar.
 */
export async function toggleDirection(editor: vscode.TextEditor, statusBar: RtlStatusBar): Promise<void> {
  const isRtl = toggle(editor.document);
  await vscode.workspace
    .getConfiguration('editor', editor.document.uri)
    .update('wordWrap', isRtl ? 'on' : undefined, vscode.ConfigurationTarget.Workspace);
  statusBar.update(isRtl);
  void vscode.window.showInformationMessage(
    `RTL Persian: direction set to ${isRtl ? 'RTL' : 'LTR'}.`,
  );
}
