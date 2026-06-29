import { describe, expect, test } from 'vitest';
import { detectFarsi } from './detect_farsi';
import { fixRtl } from './fix_rtl';
import { wrapRtl } from './wrap_rtl';
import { normalizeFarsi } from './normalize_farsi';

const RLM = '‏';

describe('detect_farsi', () => {
  test('reports rtl for Persian text', () => {
    const r = detectFarsi('سلام دنیا');
    expect(r.isFarsi).toBe(true);
    expect(r.direction).toBe('rtl');
    expect(r.ratio).toBe(1);
    expect(r.recommendation).toMatch(/right-to-left/i);
  });

  test('reports ltr for English text', () => {
    const r = detectFarsi('Hello world');
    expect(r.isFarsi).toBe(false);
    expect(r.direction).toBe('ltr');
    expect(r.ratio).toBe(0);
  });

  test('reports mixed for bidirectional text', () => {
    expect(detectFarsi('Hello سلام').direction).toBe('mixed');
  });
});

describe('normalize_farsi', () => {
  test('normalizes and counts changed characters', () => {
    const r = normalizeFarsi('اشكال علي');
    expect(r.normalized).toBe('اشکال علی');
    expect(r.changes).toBe(2);
  });

  test('reports zero changes for clean text', () => {
    expect(normalizeFarsi('سلام').changes).toBe(0);
  });
});

describe('fix_rtl', () => {
  test('html mode wraps in an RTL div', () => {
    const r = fixRtl('سلام', 'html');
    expect(r.fixed).toContain('dir="rtl"');
    expect(r.hasRTL).toBe(true);
    expect(r.changes).toContain('Wrapped text in an RTL HTML container.');
  });

  test('markdown mode prepends RLM to Persian lines', () => {
    const r = fixRtl('سلام\nhello', 'markdown');
    const lines = r.fixed.split('\n');
    expect(lines[0]?.startsWith(RLM)).toBe(true);
    expect(lines[1]).toBe('hello');
  });

  test('plain mode normalizes without markup', () => {
    const r = fixRtl('اشكال', 'plain');
    expect(r.fixed).toBe('اشکال');
    expect(r.changes.some((c) => c.includes('Normalized'))).toBe(true);
  });

  test('hasRTL is false for English', () => {
    expect(fixRtl('hello', 'plain').hasRTL).toBe(false);
  });
});

describe('wrap_rtl', () => {
  test('html wraps in a div', () => {
    expect(wrapRtl('سلام', 'html').wrapped).toContain('dir="rtl"');
  });

  test('markdown prepends RLM per non-empty line', () => {
    const r = wrapRtl('یک\nدو', 'markdown');
    expect(r.wrapped.split('\n').every((l) => l.startsWith(RLM))).toBe(true);
  });
});
