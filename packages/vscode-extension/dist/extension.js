"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../rtl-core/dist/unicode.js
var require_unicode = __commonJS({
  "../rtl-core/dist/unicode.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.FARSI_RANGES = exports2.ZWJ = exports2.ZWNJ = exports2.LRM = exports2.RLM = void 0;
    exports2.isFarsiCodePoint = isFarsiCodePoint;
    exports2.isNeutralCodePoint = isNeutralCodePoint;
    exports2.RLM = "\u200F";
    exports2.LRM = "\u200E";
    exports2.ZWNJ = "\u200C";
    exports2.ZWJ = "\u200D";
    exports2.FARSI_RANGES = [
      [1536, 1791],
      [64336, 65023],
      [65136, 65279]
    ];
    function isFarsiCodePoint(codePoint) {
      for (const [start, end] of exports2.FARSI_RANGES) {
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
  "../rtl-core/dist/detector.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DEFAULT_THRESHOLD = void 0;
    exports2.farsiRatio = farsiRatio2;
    exports2.isFarsiPredominant = isFarsiPredominant2;
    exports2.detectDirection = detectDirection;
    var unicode_1 = require_unicode();
    exports2.DEFAULT_THRESHOLD = 0.3;
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
    function farsiRatio2(text) {
      const { farsi, latin } = countScripts(text);
      const total = farsi + latin;
      if (total === 0)
        return 0;
      return farsi / total;
    }
    function isFarsiPredominant2(text, threshold = exports2.DEFAULT_THRESHOLD) {
      return farsiRatio2(text) >= threshold;
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
  "../rtl-core/dist/fixer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DEFAULT_FONT_FAMILY = void 0;
    exports2.normalizeFarsi = normalizeFarsi2;
    exports2.removeExtraZWNJ = removeExtraZWNJ;
    exports2.fixPunctuation = fixPunctuation2;
    exports2.addRTLMark = addRTLMark;
    exports2.wrapRTL = wrapRTL;
    var unicode_1 = require_unicode();
    exports2.DEFAULT_FONT_FAMILY = "Vazirmatn, Tahoma, sans-serif";
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
    function normalizeFarsi2(text) {
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
    function fixPunctuation2(text) {
      return text.replace(/([؀-ۿ])(\s*)([,;?])/g, (_match, letter, gap, punct) => {
        return `${letter}${gap}${PUNCTUATION_MAP[punct] ?? punct}`;
      });
    }
    function addRTLMark(text) {
      return text.startsWith(unicode_1.RLM) ? text : unicode_1.RLM + text;
    }
    function wrapRTL(text, fontFamily = exports2.DEFAULT_FONT_FAMILY) {
      return `<div dir="rtl" style="text-align:right;font-family:${fontFamily}">${text}</div>`;
    }
  }
});

// ../rtl-core/dist/index.js
var require_dist = __commonJS({
  "../rtl-core/dist/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
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
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_unicode(), exports2);
    __exportStar(require_detector(), exports2);
    __exportStar(require_fixer(), exports2);
  }
});

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode6 = __toESM(require("vscode"));

// src/commands.ts
var vscode2 = __toESM(require("vscode"));
var import_rtl_core2 = __toESM(require_dist());

// src/state.ts
var vscode = __toESM(require("vscode"));
var import_rtl_core = __toESM(require_dist());
var overrides = /* @__PURE__ */ new Map();
function getThreshold() {
  return vscode.workspace.getConfiguration("rtlPersian").get("threshold", 0.3);
}
function isRtl(document) {
  const key = document.uri.toString();
  const override = overrides.get(key);
  if (override !== void 0) return override;
  return (0, import_rtl_core.isFarsiPredominant)(document.getText(), getThreshold());
}
function toggle(document) {
  const next = !isRtl(document);
  overrides.set(document.uri.toString(), next);
  return next;
}

// src/commands.ts
function fixText(text) {
  return (0, import_rtl_core2.fixPunctuation)((0, import_rtl_core2.normalizeFarsi)(text));
}
function fullRange(document) {
  return new vscode2.Range(document.positionAt(0), document.positionAt(document.getText().length));
}
async function applyIfChanged(editor, range, next) {
  const current = editor.document.getText(range);
  if (current === next) return false;
  return editor.edit((builder) => builder.replace(range, next));
}
async function fixCurrentFile(editor) {
  const range = fullRange(editor.document);
  const changed = await applyIfChanged(editor, range, fixText(editor.document.getText(range)));
  void vscode2.window.showInformationMessage(
    changed ? "RTL Persian: file fixed." : "RTL Persian: nothing to fix."
  );
}
async function fixSelection(editor) {
  const selections = editor.selections.filter((s) => !s.isEmpty);
  if (selections.length === 0) {
    await fixCurrentFile(editor);
    return;
  }
  await editor.edit((builder) => {
    for (const selection of selections) {
      builder.replace(selection, fixText(editor.document.getText(selection)));
    }
  });
}
async function normalizeFile(editor) {
  const range = fullRange(editor.document);
  const changed = await applyIfChanged(editor, range, (0, import_rtl_core2.normalizeFarsi)(editor.document.getText(range)));
  void vscode2.window.showInformationMessage(
    changed ? "RTL Persian: characters normalized." : "RTL Persian: already normalized."
  );
}
async function insertRLM(editor) {
  await editor.edit((builder) => {
    for (const selection of editor.selections) {
      builder.insert(selection.active, import_rtl_core2.RLM);
    }
  });
}
async function toggleDirection(editor, statusBar) {
  const isRtl2 = toggle(editor.document);
  await vscode2.workspace.getConfiguration("editor", editor.document.uri).update("wordWrap", isRtl2 ? "on" : void 0, vscode2.ConfigurationTarget.Workspace);
  statusBar.update(isRtl2);
  void vscode2.window.showInformationMessage(
    `RTL Persian: direction set to ${isRtl2 ? "RTL" : "LTR"}.`
  );
}

// src/statusBar.ts
var vscode3 = __toESM(require("vscode"));
var RtlStatusBar = class {
  constructor() {
    this.item = vscode3.window.createStatusBarItem(vscode3.StatusBarAlignment.Right, 100);
    this.item.command = "rtl-persian.toggleDirection";
    this.item.tooltip = "Click to toggle text direction (RTL Persian)";
  }
  /**
   * Updates the label. Pass `isRtl = undefined` to hide the item (e.g. no active editor).
   *
   * @param isRtl - Whether the active document is currently treated as RTL.
   */
  update(isRtl2) {
    if (isRtl2 === void 0) {
      this.item.hide();
      return;
    }
    this.item.text = isRtl2 ? "$(arrow-left) RTL Active" : "$(arrow-right) LTR";
    this.item.show();
  }
  dispose() {
    this.item.dispose();
  }
};

// src/rtlDecorator.ts
var vscode4 = __toESM(require("vscode"));
var EXTRA_ZWNJ = /‌{2,}|‌(?=\s)|(?<=\s)‌/g;
var ASCII_PUNCT_AFTER_FARSI = /[؀-ۿ]\s*([,;?])/g;
function findIssues(text) {
  const issues = [];
  for (const m of text.matchAll(EXTRA_ZWNJ)) {
    issues.push({ start: m.index, end: m.index + m[0].length, message: "Redundant ZWNJ \u2014 normalize to remove it." });
  }
  for (const m of text.matchAll(ASCII_PUNCT_AFTER_FARSI)) {
    const punctOffset = m.index + m[0].length - 1;
    issues.push({
      start: punctOffset,
      end: punctOffset + 1,
      message: "ASCII punctuation in Persian text \u2014 consider the Persian form (\u060C \u061B \u061F)."
    });
  }
  return issues;
}
var RtlDecorator = class {
  constructor() {
    this.decoration = vscode4.window.createTextEditorDecorationType({
      backgroundColor: "rgba(255, 217, 0, 0.25)",
      borderRadius: "2px",
      overviewRulerColor: "rgba(255, 217, 0, 0.8)",
      overviewRulerLane: vscode4.OverviewRulerLane.Right
    });
  }
  /** Recomputes and applies decorations for the given editor. */
  update(editor) {
    if (!editor) return;
    const text = editor.document.getText();
    const decorations = findIssues(text).map((issue) => ({
      range: new vscode4.Range(editor.document.positionAt(issue.start), editor.document.positionAt(issue.end)),
      hoverMessage: new vscode4.MarkdownString(`**RTL Persian:** ${issue.message}`)
    }));
    editor.setDecorations(this.decoration, decorations);
  }
  dispose() {
    this.decoration.dispose();
  }
};

// src/autoDetect.ts
var vscode5 = __toESM(require("vscode"));
var import_rtl_core3 = __toESM(require_dist());
var DEBOUNCE_MS = 400;
var AutoDetect = class {
  constructor() {
    this.prompted = /* @__PURE__ */ new Set();
    this.timers = /* @__PURE__ */ new Map();
  }
  /** Whether auto-detection is enabled (`rtlPersian.autoDetect`). */
  get enabled() {
    return vscode5.workspace.getConfiguration("rtlPersian").get("autoDetect", true);
  }
  /** Registers document listeners and returns the disposables to dispose on deactivate. */
  register() {
    return [
      vscode5.workspace.onDidOpenTextDocument((doc) => this.consider(doc)),
      vscode5.workspace.onDidChangeTextDocument((e) => this.scheduleConsider(e.document)),
      new vscode5.Disposable(() => {
        for (const timer of this.timers.values()) clearTimeout(timer);
        this.timers.clear();
      })
    ];
  }
  scheduleConsider(document) {
    const key = document.uri.toString();
    const existing = this.timers.get(key);
    if (existing) clearTimeout(existing);
    this.timers.set(
      key,
      setTimeout(() => {
        this.timers.delete(key);
        this.consider(document);
      }, DEBOUNCE_MS)
    );
  }
  consider(document) {
    if (!this.enabled) return;
    if (document.uri.scheme !== "file" && document.uri.scheme !== "untitled") return;
    const key = document.uri.toString();
    if (this.prompted.has(key)) return;
    if ((0, import_rtl_core3.farsiRatio)(document.getText()) < getThreshold()) return;
    this.prompted.add(key);
    void vscode5.window.showInformationMessage("This file looks Persian. Apply RTL-friendly settings?", "Apply RTL").then((choice) => {
      if (choice === "Apply RTL") void this.applyRtlSettings(document.uri);
    });
  }
  /** Turns on word wrap for the document, persisting to workspace `.vscode/settings.json`. */
  async applyRtlSettings(uri) {
    await vscode5.workspace.getConfiguration("editor", uri).update("wordWrap", "on", vscode5.ConfigurationTarget.Workspace);
  }
};

// src/extension.ts
function withEditor(fn) {
  const editor = vscode6.window.activeTextEditor;
  if (!editor) {
    void vscode6.window.showWarningMessage("RTL Persian: no active editor.");
    return;
  }
  return fn(editor);
}
function activate(context) {
  const statusBar = new RtlStatusBar();
  const decorator = new RtlDecorator();
  const autoDetect = new AutoDetect();
  const refresh = (editor) => {
    decorator.update(editor);
    statusBar.update(editor ? isRtl(editor.document) : void 0);
  };
  context.subscriptions.push(
    statusBar,
    decorator,
    vscode6.commands.registerCommand(
      "rtl-persian.toggleDirection",
      () => withEditor((editor) => toggleDirection(editor, statusBar))
    ),
    vscode6.commands.registerCommand("rtl-persian.fixCurrentFile", () => withEditor(fixCurrentFile)),
    vscode6.commands.registerCommand("rtl-persian.fixSelection", () => withEditor(fixSelection)),
    vscode6.commands.registerCommand("rtl-persian.normalizeFile", () => withEditor(normalizeFile)),
    vscode6.commands.registerCommand("rtl-persian.insertRLM", () => withEditor(insertRLM)),
    vscode6.window.onDidChangeActiveTextEditor((editor) => refresh(editor)),
    vscode6.workspace.onDidChangeTextDocument((e) => {
      if (e.document === vscode6.window.activeTextEditor?.document) {
        refresh(vscode6.window.activeTextEditor);
      }
    }),
    ...autoDetect.register()
  );
  refresh(vscode6.window.activeTextEditor);
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
