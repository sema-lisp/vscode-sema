<div align="center">

<img src="https://raw.githubusercontent.com/HelgeSverre/sema/main/assets/icons/png/sema-logotype-366.png" alt="Sema" height="48">

# Sema for VS Code

**[Sema](https://sema-lang.com) support for [VS Code](https://code.visualstudio.com)** — a Lisp with first-class LLM primitives.

[![CI](https://img.shields.io/github/actions/workflow/status/sema-lisp/vscode-sema/ci.yml?branch=main&label=CI&logo=github)](https://github.com/sema-lisp/vscode-sema/actions)
[![License](https://img.shields.io/github/license/sema-lisp/vscode-sema?color=c8a855)](LICENSE)
[![Website](https://img.shields.io/badge/website-sema--lang.com-c8a855)](https://sema-lang.com)

[![VS Marketplace](https://img.shields.io/badge/VS%20Marketplace-007ACC?logo=visualstudiocode&logoColor=white)](https://marketplace.visualstudio.com/items?itemName=sema-lang.sema-lang)
[![Open VSX](https://img.shields.io/badge/Open%20VSX-a60ee5?logo=openvsx&logoColor=white)](https://open-vsx.org/extension/sema-lang/sema-lang)

</div>

Language support for [Sema](https://sema-lang.com), a Lisp dialect with first-class LLM primitives.

## Install

Available on the **[VS Marketplace](https://marketplace.visualstudio.com/items?itemName=sema-lang.sema-lang)** (VS Code) and **[Open VSX](https://open-vsx.org/extension/sema-lang/sema-lang)** (VSCodium, Cursor, Windsurf, Gitpod, …):

```
ext install sema-lang.sema-lang
```

Or open the Extensions view (`Cmd+Shift+X` / `Ctrl+Shift+X`) and search for **Sema Lisp**.

## Features

- Syntax highlighting for `.sema` files (special forms, builtins, LLM primitives, keywords, strings, numbers, regex/f-string literals, and more)
- Bracket matching, auto-closing, and surrounding pairs for `()`, `[]`, `{}`, and strings
- Comment toggling with `Cmd+/` / `Ctrl+/`
- S-expression-aware indentation
- File icons for `.sema` and `.sema-nb` files
- **Language server** (`sema lsp`): completions, hover docs, go-to-definition, references, rename, signature help, diagnostics, document symbols, and inline eval results
- **Debugging** (`sema dap`): step-through debugging with line/conditional breakpoints, step in/over/out, stack traces, variable and upvalue inspection, evaluate-on-hover, pause/continue, and an "Uncaught Exceptions" filter
- **Notebooks**: open a `.sema-nb` file to edit it in the embedded Sema notebook UI with live cell execution
- **Command**: `Sema: Clear Inline Results` to clear inline eval decorations

## Requirements

The language server, debugger, and notebook features shell out to the `sema` binary. Install it from [sema-lang.com](https://sema-lang.com) and make sure it's on your `PATH`, or point the extension at it explicitly:

```json
{
  "sema.path": "/absolute/path/to/sema"
}
```

Syntax highlighting and bracket/comment editing work without the binary.

## Debugging

The extension registers a debug adapter that launches `sema dap` — the stdio DAP server built into your `sema` binary. Add a launch configuration to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "sema",
      "request": "launch",
      "name": "Debug Sema Program",
      "program": "${file}",
      "stopOnEntry": false
    }
  ]
}
```

Then press `F5` in a `.sema` file.

## Notebooks

Opening a `.sema-nb` file launches `sema notebook serve` for that file and embeds its web UI directly in the editor tab (live cell execution, one server per open notebook, stopped when you close the tab). It uses the same `sema.path` binary — no extra setup.

## Building from source

```bash
npm install
npm run compile
npx @vscode/vsce package
```

This produces `sema-<version>.vsix`, which you can install with:

```
code --install-extension sema-<version>.vsix
```

## Development

1. Open this repository in VS Code
2. Run `npm install`
3. Press `F5` to launch an Extension Development Host
4. Open any `.sema` file to see syntax highlighting and, if `sema` is installed, the language server

## Links

- **Website** — [sema-lang.com](https://sema-lang.com)
- **Playground** — [sema.run](https://sema.run)
- **Documentation** — [sema-lang.com/docs](https://sema-lang.com/docs/)
- **Grammar** — [tree-sitter-sema](https://github.com/sema-lisp/tree-sitter-sema)
- **Repository** — [sema-lisp/vscode-sema](https://github.com/sema-lisp/vscode-sema)

## License

[MIT](LICENSE) © [Helge Sverre](https://github.com/HelgeSverre)
