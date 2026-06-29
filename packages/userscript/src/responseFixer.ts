/**
 * Fixes the direction of Claude's response content blocks.
 *
 * @module responseFixer
 */

import { DEFAULT_FONT_FAMILY, isFarsiPredominant } from 'rtl-core';
import { applyRtlStyle } from './domObserver';

const CONTAINER_SELECTOR = '.prose, .message-content, [data-testid="message-content"]';
const BLOCK_SELECTOR = 'p, li, h1, h2, h3, h4, h5, h6, blockquote, td, th, pre, summary';

/**
 * Scans response containers and applies RTL styling to each block-level element whose
 * text is predominantly Persian (clearing it again when disabled or no longer Persian).
 */
export function fixResponses(isEnabled: () => boolean): void {
  const enabled = isEnabled();
  const containers = document.querySelectorAll<HTMLElement>(CONTAINER_SELECTOR);
  for (const container of Array.from(containers)) {
    const blocks = container.querySelectorAll<HTMLElement>(BLOCK_SELECTOR);
    for (const block of Array.from(blocks)) {
      applyRtlStyle(block, enabled && isFarsiPredominant(block.textContent ?? ''), DEFAULT_FONT_FAMILY);
    }
  }
}
