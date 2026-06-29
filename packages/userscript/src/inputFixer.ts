/**
 * Fixes the direction of user input fields (textarea / contenteditable / ProseMirror).
 *
 * @module inputFixer
 */

import { DEFAULT_FONT_FAMILY, isFarsiPredominant } from 'rtl-core';
import { applyRtlStyle } from './domObserver';

const INPUT_SELECTOR = 'textarea, [contenteditable="true"], .ProseMirror';

/** Reads the text content of an input element regardless of its kind. */
function readValue(el: HTMLElement): string {
  if (el instanceof HTMLTextAreaElement) return el.value;
  return el.textContent ?? '';
}

/** Re-evaluates and applies direction for a single input element. */
function fixOne(el: HTMLElement, isEnabled: () => boolean): void {
  applyRtlStyle(el, isEnabled() && isFarsiPredominant(readValue(el)), DEFAULT_FONT_FAMILY);
}

/** Tracks elements that already have an input listener attached. */
const wired = new WeakSet<HTMLElement>();

/** Scans for input elements, styling them and wiring live updates on typing. */
export function fixInputs(isEnabled: () => boolean): void {
  const elements = document.querySelectorAll<HTMLElement>(INPUT_SELECTOR);
  for (const el of Array.from(elements)) {
    fixOne(el, isEnabled);
    if (!wired.has(el)) {
      wired.add(el);
      el.addEventListener('input', () => fixOne(el, isEnabled));
    }
  }
}
