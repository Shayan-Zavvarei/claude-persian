# claude-rtl-persian

RTL and Persian text support for Claude environments. A pnpm monorepo containing three
tools that share one core library:

| Package | What it is |
|---|---|
| [`rtl-core`](packages/rtl-core) | Shared detection, normalization and fixing logic. Zero runtime dependencies. |
| [`mcp-server`](packages/mcp-server) | MCP server exposing `detect_farsi`, `fix_rtl`, `wrap_rtl`, `normalize_farsi` to Claude Code. |
| [`vscode-extension`](packages/vscode-extension) | Editor-level RTL toggling, auto-detection, decorations and status bar. |
| [`userscript`](packages/userscript) | Tampermonkey/Violentmonkey script that fixes RTL rendering on claude.ai. |

## Install & build

```bash
pnpm install
pnpm build:all   # builds rtl-core first, then the dependents
pnpm test        # runs all vitest suites
```

## MCP server

Register it with Claude Code (`~/.claude.json`):

```json
{
  "mcpServers": {
    "rtl-persian": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/claude-rtl-persian/packages/mcp-server/dist/index.js"]
    }
  }
}
```

Tools:

- **`detect_farsi`** — `{ text }` → `{ isFarsi, direction, ratio, recommendation }`
- **`fix_rtl`** — `{ text, mode: 'html'|'markdown'|'plain' }` → `{ fixed, changes, hasRTL }`
- **`wrap_rtl`** — `{ text, format: 'html'|'markdown' }` → wraps in an RTL container / RLM-prefixed lines
- **`normalize_farsi`** — `{ text }` → `{ normalized, changes }` (Arabic → Persian characters, ZWNJ cleanup)

## VS Code extension

| Command | Keybinding | Description |
|---|---|---|
| `rtl-persian.toggleDirection` | `Ctrl/Cmd+Shift+F` | Toggle direction of the active file |
| `rtl-persian.fixCurrentFile` | — | Fix the entire file |
| `rtl-persian.fixSelection` | — | Fix the selected text |
| `rtl-persian.normalizeFile` | — | Normalize Persian characters in the file |
| `rtl-persian.insertRLM` | — | Insert a Right-to-Left Mark at the cursor |

Build a `.vsix`:

```bash
cd packages/vscode-extension && pnpm package
```

## Userscript

Build and install:

```bash
cd packages/userscript && pnpm build
# then open build/claude-rtl.user.js in Tampermonkey/Violentmonkey
```

## License

MIT
