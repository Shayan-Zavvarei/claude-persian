/**
 * RTL Persian VS Code extension entry point.
 *
 * @module extension
 */

import * as vscode from 'vscode';
import {
  fixCurrentFile,
  fixSelection,
  insertRLM,
  normalizeFile,
  toggleDirection,
} from './commands';
import { RtlStatusBar } from './statusBar';
import { RtlDecorator } from './rtlDecorator';
import { AutoDetect } from './autoDetect';
import { isRtl } from './state';

/** Runs `fn` against the active text editor, warning if there is none. */
function withEditor(fn: (editor: vscode.TextEditor) => Thenable<void> | void): Thenable<void> | void {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    void vscode.window.showWarningMessage('RTL Persian: no active editor.');
    return;
  }
  return fn(editor);
}

export function activate(context: vscode.ExtensionContext): void {
  const statusBar = new RtlStatusBar();
  const decorator = new RtlDecorator();
  const autoDetect = new AutoDetect();

  const refresh = (editor: vscode.TextEditor | undefined): void => {
    decorator.update(editor);
    statusBar.update(editor ? isRtl(editor.document) : undefined);
  };

  context.subscriptions.push(
    statusBar,
    decorator,
    vscode.commands.registerCommand('rtl-persian.toggleDirection', () =>
      withEditor((editor) => toggleDirection(editor, statusBar)),
    ),
    vscode.commands.registerCommand('rtl-persian.fixCurrentFile', () => withEditor(fixCurrentFile)),
    vscode.commands.registerCommand('rtl-persian.fixSelection', () => withEditor(fixSelection)),
    vscode.commands.registerCommand('rtl-persian.normalizeFile', () => withEditor(normalizeFile)),
    vscode.commands.registerCommand('rtl-persian.insertRLM', () => withEditor(insertRLM)),
    vscode.window.onDidChangeActiveTextEditor((editor) => refresh(editor)),
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.document === vscode.window.activeTextEditor?.document) {
        refresh(vscode.window.activeTextEditor);
      }
    }),
    ...autoDetect.register(),
  );

  refresh(vscode.window.activeTextEditor);
}

export function deactivate(): void {
  // Disposables registered in `context.subscriptions` are cleaned up automatically.
}
