import { describe, expect, test } from 'vitest';
import { detectDirection, farsiRatio, isFarsiPredominant } from './detector';

describe('detectDirection', () => {
  test('detects Persian text as RTL', () => {
    expect(detectDirection('سلام دنیا')).toBe('rtl');
  });

  test('detects English text as LTR', () => {
    expect(detectDirection('Hello world')).toBe('ltr');
  });

  test('detects mixed text as mixed', () => {
    expect(detectDirection('Hello سلام')).toBe('mixed');
  });

  test('treats empty and punctuation-only text as LTR', () => {
    expect(detectDirection('')).toBe('ltr');
    expect(detectDirection('!?.,  123')).toBe('ltr');
  });

  test('digits and punctuation around Persian stay RTL', () => {
    expect(detectDirection('سلام ۱۲۳ 456!')).toBe('rtl');
  });
});

describe('farsiRatio', () => {
  test('pure Persian is 1', () => {
    expect(farsiRatio('سلام')).toBe(1);
  });

  test('pure English is 0', () => {
    expect(farsiRatio('hello')).toBe(0);
  });

  test('no letters is 0', () => {
    expect(farsiRatio('123 !!!')).toBe(0);
  });

  test('half-and-half is around 0.5', () => {
    // "abcd" (4 latin) + "سلام" (4 farsi)
    expect(farsiRatio('abcdسلام')).toBeCloseTo(0.5, 5);
  });
});

describe('isFarsiPredominant', () => {
  test('default threshold treats majority-Persian as predominant', () => {
    expect(isFarsiPredominant('سلام world')).toBe(true);
  });

  test('mostly English is not predominant at default threshold', () => {
    expect(isFarsiPredominant('Hello world, این')).toBe(false);
  });

  test('respects a custom threshold', () => {
    // ratio ~0.43 — above 0.4, below 0.5
    const text = 'abcdسلام'.slice(0, 7); // abcd + سلا -> 4 latin, 3 farsi => 0.428
    expect(isFarsiPredominant(text, 0.5)).toBe(false);
    expect(isFarsiPredominant(text, 0.4)).toBe(true);
  });
});
