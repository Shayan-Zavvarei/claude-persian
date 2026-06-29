/**
 * Generic DOM mutation observation helper.
 *
 * @module domObserver
 */

/**
 * Observes the document subtree and invokes `onChange` (debounced) whenever nodes are
 * added or character data changes. Returns the observer so callers can disconnect it.
 *
 * @param onChange - Callback run after mutations settle.
 * @param debounceMs - Debounce window in milliseconds.
 */
export function observeDom(onChange: () => void, debounceMs = 150): MutationObserver {
  let timer: number | undefined;
  const schedule = (): void => {
    if (timer !== undefined) window.clearTimeout(timer);
    timer = window.setTimeout(onChange, debounceMs);
  };

  const observer = new MutationObserver(schedule);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });
  return observer;
}

/**
 * Applies (or clears) RTL styling on an element.
 *
 * @param el - The element to style.
 * @param rtl - When `true`, force RTL/right-align/font; when `false`, clear those styles.
 * @param fontFamily - Font stack to apply when `rtl` is `true`.
 */
export function applyRtlStyle(el: HTMLElement, rtl: boolean, fontFamily: string): void {
  if (rtl) {
    el.style.direction = 'rtl';
    el.style.textAlign = 'right';
    el.style.fontFamily = fontFamily;
    el.style.unicodeBidi = 'plaintext';
  } else {
    el.style.removeProperty('direction');
    el.style.removeProperty('text-align');
    el.style.removeProperty('font-family');
    el.style.removeProperty('unicode-bidi');
  }
}

/** Runs `cb` once the DOM is ready (immediately if it already is). */
export function onReady(cb: () => void): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cb, { once: true });
  } else {
    cb();
  }
}
