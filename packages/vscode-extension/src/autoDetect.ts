/**
 * Auto-detects Persian-heavy documents and offers to apply RTL-friendly settings.
 *
 * @module autoDetect
 */

import * as vscode from 'vscode';
import { farsiRatio } from 'rtl-core';
import { getThreshold } from './state';

const DEBOUNCE_MS = 400;

/** Watches documents and prompts to apply RTL settings when Persian content is detected. */
export class AutoDetect {
  private readonly prompted = new Set<string>();
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();

  /** Whether auto-detection is enabled (`rtlPersian.autoDetect`). */
  private get enabled(): boolean {
    return vscode.workspace.getConfiguration('rtlPersian').get<boolean>('autoDetect', true);
  }

  /** Registers document listeners and returns the disposables to dispose on deactivate. */
  register(): vscode.Disposable[] {
    return [
      vscode.workspace.onDidOpenTextDocument((doc) => this.consider(doc)),
      vscode.workspace.onDidChangeTextDocument((e) => this.scheduleConsider(e.document)),
      new vscode.Disposable(() => {
        for (const timer of this.timers.values()) clearTimeout(timer);
        this.timers.clear();
      }),
    ];
  }

  private scheduleConsider(document: vscode.TextDocument): void {
    const key = document.uri.toString();
    const existing = this.timers.get(key);
    if (existing) clearTimeout(existing);
    this.timers.set(
      key,
      setTimeout(() => {
        this.timers.delete(key);
        this.consider(document);
      }, DEBOUNCE_MS),
    );
  }

  private consider(document: vscode.TextDocument): void {
    if (!this.enabled) return;
    if (document.uri.scheme !== 'file' && document.uri.scheme !== 'untitled') return;
    const key = document.uri.toString();
    if (this.prompted.has(key)) return;
    if (farsiRatio(document.getText()) < getThreshold()) return;

    this.prompted.add(key);
    void vscode.window
      .showInformationMessage('This file looks Persian. Apply RTL-friendly settings?', 'Apply RTL')
      .then((choice) => {
        if (choice === 'Apply RTL') void this.applyRtlSettings(document.uri);
      });
  }

  /** Turns on word wrap for the document, persisting to workspace `.vscode/settings.json`. */
  private async applyRtlSettings(uri: vscode.Uri): Promise<void> {
    await vscode.workspace
      .getConfiguration('editor', uri)
      .update('wordWrap', 'on', vscode.ConfigurationTarget.Workspace);
  }
}
