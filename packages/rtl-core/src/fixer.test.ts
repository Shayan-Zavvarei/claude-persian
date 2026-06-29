import { describe, expect, test } from 'vitest';
import { RLM, ZWNJ } from './unicode';
import {
  addRTLMark,
  fixPunctuation,
  normalizeFarsi,
  removeExtraZWNJ,
  wrapRTL,
} from './fixer';

describe('normalizeFarsi', () => {
  test('converts Arabic kaf to Persian kaf', () => {
    expect(normalizeFarsi('اشكال')).toBe('اشکال');
  });

  test('converts Arabic yeh to Persian yeh', () => {
    expect(normalizeFarsi('علي')).toBe('علی');
  });

  test('converts alef maksura to Persian yeh', () => {
    expect(normalizeFarsi('موسى')).toBe('موسی');
  });

  test('normalizes hamza-on-alef to bare alef', () => {
    expect(normalizeFarsi('أحمد')).toBe('احمد');
    expect(normalizeFarsi('إيمان')).toBe('ایمان');
  });

  test('converts Arabic-Indic digits to Persian digits', () => {
    expect(normalizeFarsi('٠١٢٣٤٥٦٧٨٩')).toBe('۰۱۲۳۴۵۶۷۸۹');
  });

  test('leaves clean Persian text unchanged', () => {
    expect(normalizeFarsi('سلام دنیا')).toBe('سلام دنیا');
  });
});

describe('removeExtraZWNJ', () => {
  test('collapses consecutive ZWNJ', () => {
    expect(removeExtraZWNJ(`می${ZWNJ}${ZWNJ}روم`)).toBe(`می${ZWNJ}روم`);
  });

  test('removes ZWNJ next to whitespace', () => {
    expect(removeExtraZWNJ(`سلام ${ZWNJ}دنیا`)).toBe('سلام دنیا');
  });

  test('trims ZWNJ at the ends', () => {
    expect(removeExtraZWNJ(`${ZWNJ}سلام${ZWNJ}`)).toBe('سلام');
  });

  test('keeps a single meaningful ZWNJ', () => {
    expect(removeExtraZWNJ(`می${ZWNJ}روم`)).toBe(`می${ZWNJ}روم`);
  });
});

describe('fixPunctuation', () => {
  test('converts punctuation following Persian text', () => {
    expect(fixPunctuation('سلام?')).toBe('سلام؟');
    expect(fixPunctuation('یک, دو')).toBe('یک، دو');
    expect(fixPunctuation('بله; خیر')).toBe('بله؛ خیر');
  });

  test('leaves English punctuation untouched', () => {
    expect(fixPunctuation('Hello, world?')).toBe('Hello, world?');
  });
});

describe('addRTLMark', () => {
  test('prepends an RLM', () => {
    expect(addRTLMark('سلام')).toBe(`${RLM}سلام`);
  });

  test('does not double up the RLM', () => {
    expect(addRTLMark(`${RLM}سلام`)).toBe(`${RLM}سلام`);
  });
});

describe('wrapRTL', () => {
  test('wraps in an RTL div with a Persian font', () => {
    const out = wrapRTL('سلام');
    expect(out).toContain('dir="rtl"');
    expect(out).toContain('text-align:right');
    expect(out).toContain('Vazirmatn');
    expect(out).toContain('سلام');
  });

  test('honors a custom font family', () => {
    expect(wrapRTL('متن', 'IRANSans')).toContain('font-family:IRANSans');
  });
});
