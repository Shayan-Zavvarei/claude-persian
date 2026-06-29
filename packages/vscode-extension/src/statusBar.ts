/**
 * Status bar item showing the active editor's RTL/LTR state.
 *
 * @module statusBar
 */

import * as vscode from 'vscode';

/** Manages a status bar item that reflects and toggles text direction. */
export class RtlStatusBar {
  private readonly item: vscode.StatusBarItem;

  constructor() {
    this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.item.command = 'rtl-persian.toggleDirection';
    this.item.tooltip = 'Click to toggle text direction (RTL Persian)';
  }

  /**
   * Updates the label. Pass `isRtl = undefined` to hide the item (e.g. no active editor).
   *
   * @param isRtl - Whether the active document is currently treated as RTL.
   */
  update(isRtl: boolean | undefined): void {
    if (isRtl === undefined) {
      this.item.hide();
      return;
    }
    this.item.text = isRtl ? '$(arrow-left) RTL Active' : '$(arrow-right) LTR';
    this.item.show();
  }

  dispose(): void {
    this.item.dispose();
  }
}
