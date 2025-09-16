## Frontend DSL for React/JSX

This document describes the pseudo-code DSL supported by `sevdo_frontend/frontend_compiler.py` and how it translates into React JSX. The DSL is intentionally small and focused, with simple tokens and predictable output.

### TL;DR

- A program is a sequence of statements (one per line or separated by whitespace).
- Each statement is: `token(args){props}`. `args` and `props` are optional.
- Only container tokens accept nested children: `c( ...children... )` and `f( ...children... )`.
- Props are comma-separated `key=value` pairs; flags without `=` are treated as `true`.

### Supported tokens

| Token | Component                              | Purpose                 | Args (inside `(...)`)                                                                                      | Props (inside `{...}`)                                      | Notes                                                                   |
| ----: | -------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------- |
|   `h` | `<h1>`                                 | Header text             | `text`                                                                                                     | —                                                           | Defaults to `Header` if omitted.                                        |
|   `t` | `<p>`                                  | Paragraph text          | `text`                                                                                                     | —                                                           | —                                                                       |
|   `i` | `<input>` or `<label><input/></label>` | Text input              | First arg without `=` becomes `placeholder`. Additional inline `key=value` supported (e.g., `label=Name`). | `label` supported and takes precedence over inline `label`. | When `label` is present, output becomes a labeled control.              |
|   `b` | `<button>`                             | Button                  | `label`                                                                                                    | `onClick` handler name                                      | Produces Tailwind-styled button; `onClick={handler}` added if provided. |
|   `c` | `<div>`                                | Container (flex column) | Children statements inside `(...)`                                                                         | `class` (Tailwind classes)                                  | Merges `class` with base `flex flex-col gap-4`.                         |
|   `f` | `<form>`                               | Form container          | Children statements inside `(...)`                                                                         | —                                                           | Wraps children with `<form>`.                                           |
|   `n` | `<nav>`                                | Simple navbar           | Comma-separated link labels: `Home,About,Contact`                                                          | —                                                           | Links render as `<a href="#">...` with simple classes.                  |
| `img` | `<img>`                                | Image                   | Either `src=path` or just `path`                                                                           | `alt`                                                       | Class `max-w-full` is added.                                            |
| `sel` | `<select>`                             | Select box              | Comma-separated options: `One,Two,Three`                                                                   | —                                                           | Renders `<option>` for each non-empty trimmed value.                    |

If you use an unknown token, the compiler will raise an error.

### Syntax details

1. Statement shape: `token(args){props}`

   - `args` are parsed when present. For containers (`c`, `f`), `args` is the nested body to be parsed as child statements.
   - `props` is a comma-separated list of key-value pairs: `key=value, other=true`. Whitespace is ignored around separators. Flags without `=` are treated as `true`.

2. Whitespace and newlines:

   - You can put one statement per line or separate by whitespace.
   - Nested content for containers can span multiple lines for readability.

3. Escaping and special characters:
   - The v1 DSL is minimal: there is no string quoting/escaping. If you need commas or parentheses in text, they may conflict with parsing.

### Component-specific behavior

- `h(text)` → `<h1>{text}</h1>`
- `t(text)` → `<p>{text}</p>`
- `i(placeholder, label=Name)` or `i(placeholder){label=Name}`
  - Placeholder is taken from the first non-`key=value` arg.
  - A `label` may be provided either inline (`label=...`) or in `{props}`. The `{props}` value overrides the inline value.
  - With label: output is a `<label>` containing a labeled `<input>`.
  - Without label: output is a standalone `<input>`.
- `b(Label){onClick=handler}` → adds `onClick={handler}` if provided.
- `c( ...children... ){class=extra-classes}` → wraps children in `<div className="flex flex-col gap-4 ...">` with classes merged.
- `f( ...children... )` → wraps children in `<form>`.
- `n(Home,About)` → `<nav>` with two `<a href="#">Home</a>` and `<a href="#">About</a>`.
- `img(src=logo.png){alt=Logo}` or `img(logo.png){alt=Logo}` → `<img src="logo.png" alt="Logo" />`.
- `sel(One,Two)` → `<select><option key="One" value="One">One</option>...</select>`.

### Examples

#### Simple page

```
h(Title)
t(Welcome)
i(email,label=Email)
b(Go){onClick=go}
```

Outputs inside a fragment (simplified):

```
<h1>Title</h1>
<p>Welcome</p>
<label className="block">
  <span className="mb-1 block">Email</span>
  <input className="border rounded px-3 py-2 w-full" placeholder="email" />
</label>
<button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded" onClick={go}>Go</button>
```

#### Nesting

```
c(
  h(Welcome)
  c(t(Inner)){class=mt-4}
  f(i(name,label=Name) b(Save){onClick=save})
)
```

Key points:

- `c( ... )` and `f( ... )` accept nested statements.
- Extra classes for containers are merged with the base layout classes.

### Import and wrapper behavior

The HTTP API accepts a flag `include_imports` and a `component_name`:

- When `include_imports=true`, the output is wrapped with:
  - `import React from 'react';`
  - `export default function {component_name}() { return ( <> ... </> ); }`
- When `include_imports=false`, the compiler returns just the fragment `<>...</>`.

These are API-level options; they are not specified inside the DSL itself.

### Button actions (playground only)

The playground view adds `window.sevdoAct(action)` used when a button has `{action=...}`. Supported kinds:

- alert: `alert:Message`
- log: `log:Message`
- open: `open:url|target` (default target `_blank`)
- back: `back:`
- reload: `reload:`
- copy to clipboard: `copy:Text`
- download file: `download:filename|content`
- focus element: `focus:CSSselector`
- scroll to element: `scroll:CSSselector`
- class add/remove/toggle: `class:add selector|class`, `class:remove selector|class`, `class:toggle selector|class`
- localStorage: `store:set key|value`, `store:get key`, `store:remove key`
- navigate: `nav:/path`
- API GET: `api:/path`
- API with method/body: `api:METHOD /path|BODY` (BODY string or JSON)

Shorthand: if `action` starts with `/`, it is treated as `api:/...`.

### Error handling

- Unknown tokens or malformed nesting will result in a 400 response with details.
- Missing files return 404; oversized files return 413 (limits controlled by env vars like `TRANSLATE_MAX_FILE_BYTES`).

### Tips

- Prefer short, comma-separated args for simple content.
- Use containers (`c`, `f`) to structure layout and forms.
- For inputs, prefer `{label=...}` to ensure the `<label>` wrapper is generated.
