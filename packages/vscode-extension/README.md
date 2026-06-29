# RTL Persian — VS Code Extension

RTL and Persian text support for the editor and Claude for VS Code.

## Features

- **Toggle Direction** (`Ctrl/Cmd+Shift+F`) — flip the active file between RTL and LTR (syncs word wrap, updates the status bar).
- **Fix Current File / Fix Selection** — normalize Arabic characters to Persian (`ك`→`ک`, `ي`→`ی`), fix punctuation, and clean redundant ZWNJ.
- **Normalize Persian Characters** — character normalization only.
- **Insert RLM** — insert a Right-to-Left Mark at the cursor.
- **Auto-detection** — when a file is more than `rtlPersian.threshold` Persian, offers to apply RTL-friendly settings.
- **Diagnostics decoration** — highlights redundant ZWNJ and ASCII punctuation used in Persian text.

## Settings

| Setting | Default | Description |
|---|---|---|
| `rtlPersian.autoDetect` | `true` | Offer RTL settings for Persian-heavy files. |
| `rtlPersian.threshold` | `0.3` | Persian-character ratio that counts as RTL. |
| `rtlPersian.fontFamily` | `Vazirmatn, Tahoma, sans-serif` | Suggested Persian font. |

> Note: VS Code does not expose an API to render the editor truly right-to-left, so
> "Toggle Direction" manages logical state and word wrap rather than mirroring glyphs.

## Build

```bash
pnpm build      # type-check + bundle with esbuild
pnpm package    # produce a .vsix
```
