/**
 * Claude RTL Persian userscript entry point: injects a font, wires a toggle button,
 * and continuously fixes input and response direction on claude.ai.
 *
 * @module main
 */

import { observeDom, onReady } from './domObserver';
import { fixInputs } from './inputFixer';
import { fixResponses } from './responseFixer';

const STORAGE_KEY = 'claude-rtl-enabled';
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Vazirmatn&display=swap';

/** Auto-fix state, persisted in localStorage. Defaults to enabled. */
function isEnabled(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== 'false';
}

function setEnabled(value: boolean): void {
  localStorage.setItem(STORAGE_KEY, String(value));
}

/** Injects the Vazirmatn web font once. */
function injectFont(): void {
  if (document.getElementById('claude-rtl-font')) return;
  const link = document.createElement('link');
  link.id = 'claude-rtl-font';
  link.rel = 'stylesheet';
  link.href = FONT_URL;
  document.head.appendChild(link);
}

/** Runs both fixers against the current DOM. */
function runFixers(): void {
  fixInputs(isEnabled);
  fixResponses(isEnabled);
}

/** Creates the floating toggle button in the bottom-right corner. */
function createToggleButton(): void {
  if (document.getElementById('claude-rtl-toggle')) return;
  const button = document.createElement('button');
  button.id = 'claude-rtl-toggle';
  Object.assign(button.style, {
    position: 'fixed',
    bottom: '16px',
    right: '16px',
    zIndex: '2147483647',
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(0,0,0,0.15)',
    background: '#1f2937',
    color: '#fff',
    fontFamily: 'Vazirmatn, Tahoma, sans-serif',
    fontSize: '13px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  } satisfies Partial<CSSStyleDeclaration>);

  const render = (): void => {
    button.textContent = isEnabled() ? '⟵ RTL: On' : '⟶ RTL: Off';
  };
  render();

  button.addEventListener('click', () => {
    setEnabled(!isEnabled());
    render();
    runFixers();
  });

  document.body.appendChild(button);
}

function main(): void {
  injectFont();
  createToggleButton();
  runFixers();
  observeDom(runFixers);
}

onReady(main);
