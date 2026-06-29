/**
 * Highlights likely RTL/Persian text issues: redundant ZWNJ and ASCII punctuation
 * used in a Persian context.
 *
 * @module rtlDecorator
 */

import * as vscode from 'vscode';

interface Issue {
  start: number;
  end: number;
  message: string;
}

/** Matches redundant ZWNJ: runs of 2+, or a ZWNJ adjacent to whitespace. */
const EXTRA_ZWNJ = /‌{2,}|‌(?=\s)|(?<=\s)‌/g;
/** Matches ASCII punctuation (`,` `;` `?`) immediately after Persian text. */
const ASCII_PUNCT_AFTER_FARSI = /[؀-ۿ]\s*([,;?])/g;

/** Scans `text` for highlightable issues. */
function findIssues(text: string): Issue[] {
  const issues: Issue[] = [];
  for (const m of text.matchAll(EXTRA_ZWNJ)) {
    issues.push({ start: m.index, end: m.index + m[0].length, message: 'Redundant ZWNJ — normalize to remove it.' });
  }
  for (const m of text.matchAll(ASCII_PUNCT_AFTER_FARSI)) {
    const punctOffset = m.index + m[0].length - 1;
    issues.push({
      start: punctOffset,
      end: punctOffset + 1,
      message: 'ASCII punctuation in Persian text — consider the Persian form (، ؛ ؟).',
    });
  }
  return issues;
}

/** Decorates editors with warnings for redundant ZWNJ and mispunctuation. */
export class RtlDecorator {
  private readonly decoration: vscode.TextEditorDecorationType;

  constructor() {
    this.decoration = vscode.window.createTextEditorDecorationType({
      backgroundColor: 'rgba(255, 217, 0, 0.25)',
      borderRadius: '2px',
      overviewRulerColor: 'rgba(255, 217, 0, 0.8)',
      overviewRulerLane: vscode.OverviewRulerLane.Right,
    });
  }

  /** Recomputes and applies decorations for the given editor. */
  update(editor: vscode.TextEditor | undefined): void {
    if (!editor) return;
    const text = editor.document.getText();
    const decorations: vscode.DecorationOptions[] = findIssues(text).map((issue) => ({
      range: new vscode.Range(editor.document.positionAt(issue.start), editor.document.positionAt(issue.end)),
      hoverMessage: new vscode.MarkdownString(`**RTL Persian:** ${issue.message}`),
    }));
    editor.setDecorations(this.decoration, decorations);
  }

  dispose(): void {
    this.decoration.dispose();
  }
}
