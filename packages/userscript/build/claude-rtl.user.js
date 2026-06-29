// ==UserScript==
// @name         Claude RTL Persian
// @namespace    https://github.com/claude-rtl-persian
// @version      1.0.0
// @description  Fix RTL and Persian text rendering on claude.ai
// @match        https://claude.ai/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==
"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // ../rtl-core/dist/unicode.js
  var require_unicode = __commonJS({
    "../rtl-core/dist/unicode.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.FARSI_RANGES = exports.ZWJ = exports.ZWNJ = exports.LRM = exports.RLM = void 0;
      exports.isFarsiCodePoint = isFarsiCodePoint;
      exports.isNeutralCodePoint = isNeutralCodePoint;
      exports.RLM = "\u200F";
      exports.LRM = "\u200E";
      exports.ZWNJ = "\u200C";
      exports.ZWJ = "\u200D";
      exports.FARSI_RANGES = [
        [1536, 1791],
        [64336, 65023],
        [65136, 65279]
      ];
      function isFarsiCodePoint(codePoint) {
        for (const [start, end] of exports.FARSI_RANGES) {
          if (codePoint >= start && codePoint <= end) {
            return true;
          }
        }
        return false;
      }
      function isNeutralCodePoint(codePoint) {
        if (codePoint <= 32)
          return true;
        const isAsciiDigit = codePoint >= 48 && codePoint <= 57;
        const isAsciiPunct = codePoint >= 33 && codePoint <= 47 || codePoint >= 58 && codePoint <= 64 || codePoint >= 91 && codePoint <= 96 || codePoint >= 123 && codePoint <= 126;
        return isAsciiDigit || isAsciiPunct;
      }
    }
  });

  // ../rtl-core/dist/detector.js
  var require_detector = __commonJS({
    "../rtl-core/dist/detector.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.DEFAULT_THRESHOLD = void 0;
      exports.farsiRatio = farsiRatio;
      exports.isFarsiPredominant = isFarsiPredominant3;
      exports.detectDirection = detectDirection;
      var unicode_1 = require_unicode();
      exports.DEFAULT_THRESHOLD = 0.3;
      function isLatinLetter(codePoint) {
        return codePoint >= 65 && codePoint <= 90 || // A–Z
        codePoint >= 97 && codePoint <= 122 || // a–z
        codePoint >= 192 && codePoint <= 591;
      }
      function countScripts(text) {
        let farsi = 0;
        let latin = 0;
        for (const ch of text) {
          const cp = ch.codePointAt(0);
          if (cp === void 0)
            continue;
          if ((0, unicode_1.isFarsiCodePoint)(cp)) {
            farsi++;
          } else if (isLatinLetter(cp)) {
            latin++;
          }
        }
        return { farsi, latin };
      }
      function farsiRatio(text) {
        const { farsi, latin } = countScripts(text);
        const total = farsi + latin;
        if (total === 0)
          return 0;
        return farsi / total;
      }
      function isFarsiPredominant3(text, threshold = exports.DEFAULT_THRESHOLD) {
        return farsiRatio(text) >= threshold;
      }
      function detectDirection(text) {
        const { farsi, latin } = countScripts(text);
        if (farsi > 0 && latin > 0)
          return "mixed";
        if (farsi > 0)
          return "rtl";
        return "ltr";
      }
    }
  });

  // ../rtl-core/dist/fixer.js
  var require_fixer = __commonJS({
    "../rtl-core/dist/fixer.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.DEFAULT_FONT_FAMILY = void 0;
      exports.normalizeFarsi = normalizeFarsi;
      exports.removeExtraZWNJ = removeExtraZWNJ;
      exports.fixPunctuation = fixPunctuation;
      exports.addRTLMark = addRTLMark;
      exports.wrapRTL = wrapRTL;
      var unicode_1 = require_unicode();
      exports.DEFAULT_FONT_FAMILY = "Vazirmatn, Tahoma, sans-serif";
      var NORMALIZE_MAP = [
        [/ك/g, "\u06A9"],
        // ARABIC KAF ك -> PERSIAN KEHEH ک
        [/ي/g, "\u06CC"],
        // ARABIC YEH ي -> PERSIAN YEH ی
        [/ى/g, "\u06CC"],
        // ARABIC ALEF MAKSURA ى -> PERSIAN YEH ی
        [/أ/g, "\u0627"],
        // ARABIC ALEF WITH HAMZA ABOVE أ -> ALEF ا
        [/إ/g, "\u0627"],
        // ARABIC ALEF WITH HAMZA BELOW إ -> ALEF ا
        [/ٱ/g, "\u0627"],
        // ARABIC ALEF WASLA ٱ -> ALEF ا
        [/آ/g, "\u0622"]
        // ALEF + COMBINING MADDA -> precomposed ALEF MADDA آ
      ];
      var ARABIC_TO_PERSIAN_DIGITS = Array.from({ length: 10 }, (_unused, i) => [new RegExp(String.fromCharCode(1632 + i), "g"), String.fromCharCode(1776 + i)]);
      function normalizeFarsi(text) {
        let result = text;
        for (const [pattern, replacement] of NORMALIZE_MAP) {
          result = result.replace(pattern, replacement);
        }
        for (const [pattern, replacement] of ARABIC_TO_PERSIAN_DIGITS) {
          result = result.replace(pattern, replacement);
        }
        return removeExtraZWNJ(result);
      }
      function removeExtraZWNJ(text) {
        return text.replace(/‌{2,}/g, unicode_1.ZWNJ).replace(/‌(?=\s)|(?<=\s)‌/g, "").replace(/^‌+|‌+$/g, "");
      }
      var PUNCTUATION_MAP = {
        ",": "\u060C",
        // ARABIC COMMA ،
        ";": "\u061B",
        // ARABIC SEMICOLON ؛
        "?": "\u061F"
        // ARABIC QUESTION MARK ؟
      };
      function fixPunctuation(text) {
        return text.replace(/([؀-ۿ])(\s*)([,;?])/g, (_match, letter, gap, punct) => {
          return `${letter}${gap}${PUNCTUATION_MAP[punct] ?? punct}`;
        });
      }
      function addRTLMark(text) {
        return text.startsWith(unicode_1.RLM) ? text : unicode_1.RLM + text;
      }
      function wrapRTL(text, fontFamily = exports.DEFAULT_FONT_FAMILY) {
        return `<div dir="rtl" style="text-align:right;font-family:${fontFamily}">${text}</div>`;
      }
    }
  });

  // ../rtl-core/dist/index.js
  var require_dist = __commonJS({
    "../rtl-core/dist/index.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      } : function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      __exportStar(require_unicode(), exports);
      __exportStar(require_detector(), exports);
      __exportStar(require_fixer(), exports);
    }
  });

  // src/domObserver.ts
  function observeDom(onChange, debounceMs = 150) {
    let timer;
    const schedule = () => {
      if (timer !== void 0) window.clearTimeout(timer);
      timer = window.setTimeout(onChange, debounceMs);
    };
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
    return observer;
  }
  function applyRtlStyle(el, rtl, fontFamily) {
    if (rtl) {
      el.style.direction = "rtl";
      el.style.textAlign = "right";
      el.style.fontFamily = fontFamily;
      el.style.unicodeBidi = "plaintext";
    } else {
      el.style.removeProperty("direction");
      el.style.removeProperty("text-align");
      el.style.removeProperty("font-family");
      el.style.removeProperty("unicode-bidi");
    }
  }
  function onReady(cb) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", cb, { once: true });
    } else {
      cb();
    }
  }

  // src/inputFixer.ts
  var import_rtl_core = __toESM(require_dist(), 1);
  var INPUT_SELECTOR = 'textarea, [contenteditable="true"], .ProseMirror';
  function readValue(el) {
    if (el instanceof HTMLTextAreaElement) return el.value;
    return el.textContent ?? "";
  }
  function fixOne(el, isEnabled2) {
    applyRtlStyle(el, isEnabled2() && (0, import_rtl_core.isFarsiPredominant)(readValue(el)), import_rtl_core.DEFAULT_FONT_FAMILY);
  }
  var wired = /* @__PURE__ */ new WeakSet();
  function fixInputs(isEnabled2) {
    const elements = document.querySelectorAll(INPUT_SELECTOR);
    for (const el of Array.from(elements)) {
      fixOne(el, isEnabled2);
      if (!wired.has(el)) {
        wired.add(el);
        el.addEventListener("input", () => fixOne(el, isEnabled2));
      }
    }
  }

  // src/responseFixer.ts
  var import_rtl_core2 = __toESM(require_dist(), 1);
  var CONTAINER_SELECTOR = '.prose, .message-content, [data-testid="message-content"]';
  var BLOCK_SELECTOR = "p, li, h1, h2, h3, h4, h5, h6, blockquote, td, th, pre, summary";
  function fixResponses(isEnabled2) {
    const enabled = isEnabled2();
    const containers = document.querySelectorAll(CONTAINER_SELECTOR);
    for (const container of Array.from(containers)) {
      const blocks = container.querySelectorAll(BLOCK_SELECTOR);
      for (const block of Array.from(blocks)) {
        applyRtlStyle(block, enabled && (0, import_rtl_core2.isFarsiPredominant)(block.textContent ?? ""), import_rtl_core2.DEFAULT_FONT_FAMILY);
      }
    }
  }

  // src/main.ts
  var STORAGE_KEY = "claude-rtl-enabled";
  var FONT_URL = "https://fonts.googleapis.com/css2?family=Vazirmatn&display=swap";
  function isEnabled() {
    return localStorage.getItem(STORAGE_KEY) !== "false";
  }
  function setEnabled(value) {
    localStorage.setItem(STORAGE_KEY, String(value));
  }
  function injectFont() {
    if (document.getElementById("claude-rtl-font")) return;
    const link = document.createElement("link");
    link.id = "claude-rtl-font";
    link.rel = "stylesheet";
    link.href = FONT_URL;
    document.head.appendChild(link);
  }
  function runFixers() {
    fixInputs(isEnabled);
    fixResponses(isEnabled);
  }
  function createToggleButton() {
    if (document.getElementById("claude-rtl-toggle")) return;
    const button = document.createElement("button");
    button.id = "claude-rtl-toggle";
    Object.assign(button.style, {
      position: "fixed",
      bottom: "16px",
      right: "16px",
      zIndex: "2147483647",
      padding: "6px 12px",
      borderRadius: "8px",
      border: "1px solid rgba(0,0,0,0.15)",
      background: "#1f2937",
      color: "#fff",
      fontFamily: "Vazirmatn, Tahoma, sans-serif",
      fontSize: "13px",
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
    });
    const render = () => {
      button.textContent = isEnabled() ? "\u27F5 RTL: On" : "\u27F6 RTL: Off";
    };
    render();
    button.addEventListener("click", () => {
      setEnabled(!isEnabled());
      render();
      runFixers();
    });
    document.body.appendChild(button);
  }
  function main() {
    injectFont();
    createToggleButton();
    runFixers();
    observeDom(runFixers);
  }
  onReady(main);
})();
