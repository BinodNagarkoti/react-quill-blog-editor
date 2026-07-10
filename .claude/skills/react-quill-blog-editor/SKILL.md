---
name: react-quill-blog-editor
description: Reference for installing and correctly implementing the react-quill-blog-editor npm package - a Quill 2 rich text editor for React preconfigured for blog content (fonts, tables, colors, line spacing, image/PDF uploads, optional math formulas). Use whenever a user asks to add a rich text editor, WYSIWYG editor, or blog post editor to a React project, or asks a question about this specific package. This file is self-contained - written to be read by an AI agent with no other context, in any project, not just this repo.
---

# react-quill-blog-editor

A React component wrapping [Quill 2](https://quilljs.com), preconfigured with a full
blog-writing toolbar. It is **uncontrolled** - Quill owns its own DOM and internal
state; React only reads/writes through the exported `ref` and a handful of event
callbacks. Do not try to control its content via a `value` prop; there isn't one.

## When to reach for this vs. plain Quill or another editor

Use this package when the ask is "add a rich text / blog post editor to a React
app" and Quill's feature set (not Slate/Lexical/TipTap) is acceptable. It already
ships fonts, headings, sizes, colors, alignment, line spacing, lists, indent,
direction, blockquote, code block, links, tables, image/PDF uploads (no base64),
and optional math formulas - so don't hand-roll a Quill wrapper or a custom
toolbar config unless the user explicitly asks for something this package's
`toolbar`/`modules` escape hatches can't express.

## Install

```bash
npm install react-quill-blog-editor quill react react-dom
```

`quill`, `react`, and `react-dom` are peer dependencies - install them explicitly,
don't assume they're already present.

KaTeX is an **optional** peer dependency, needed only if you turn on `enableFormula`:

```bash
npm install katex
```

## Minimal working example

```tsx
import { useRef } from 'react';
import { QuillBlogEditor, Delta } from 'react-quill-blog-editor';
import 'react-quill-blog-editor/style.css'; // required - see "CSS" below
import type Quill from 'quill';

const defaultValue = new Delta().insert('Hello world').insert('\n', { header: 1 });

function BlogEditor() {
  const quillRef = useRef<Quill | null>(null);

  return (
    <QuillBlogEditor
      ref={quillRef}
      defaultValue={defaultValue}
      placeholder="Write your post..."
      onFileUpload={async (file) => {
        // Upload `file` however you like and return a public HTTPS URL.
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const { url } = await res.json();
        return url;
      }}
      onTextChange={() => {
        console.log(quillRef.current?.getContents());
      }}
    />
  );
}
```

### CSS

You must import `react-quill-blog-editor/style.css` once, anywhere near the app's
entry point (or in the same file as the component - either works). It bundles
Quill's own snow-theme stylesheet. Without it the editor renders as unstyled HTML.

### Framework notes

- **Next.js App Router**: this component touches `document`/`window` on mount.
  Add `'use client'` at the top of the file that renders `<QuillBlogEditor />`.
- **Vite / CRA / Remix (SPA mode)**: works with no special handling.
- The package ships both ESM (`dist/index.js`) and CJS (`dist/index.cjs`) builds,
  so it works from either `import` or `require`.

## Props reference

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `readOnly` | `boolean` | `false` | Disables editing, hides the toolbar. **Live** - toggling it takes effect immediately. |
| `defaultValue` | `Delta` (from `quill`) | `undefined` | Initial content. Read once on mount only - this is uncontrolled, there is no way to push new content in via props after mount. Use the `ref` (`quill.setContents(delta)`) if you need to replace content programmatically. |
| `placeholder` | `string` | `undefined` | Placeholder text when empty. |
| `onFileUpload` | `(file: File) => Promise<string>` | `undefined` | See "File uploads" below. **Live** - safe to pass a new inline function every render. |
| `enableTable` | `boolean` | `true` | Table toolbar button (Quill's built-in table module: insert only, no resize/merge). **Live.** |
| `enableFormula` | `boolean` | `false` | Formula toolbar button. Requires KaTeX setup - see below. **Live.** |
| `fonts` | `FontOption[]` (`{ key, label, family }`) | 14 curated web fonts, exported as `FONT_OPTIONS` | Overrides the font picker. **Mount-time only** - see "Live vs. mount-time props." |
| `toolbar` | `ToolbarConfig` (from `quill/modules/toolbar.js`) | `undefined` | Fully replaces the default toolbar layout (Quill's array-of-arrays format). **Mount-time only.** |
| `modules` | `Record<string, unknown>` | `undefined` | Extra Quill modules merged in alongside toolbar/table. **Mount-time only.** |
| `onTextChange` | `(delta, oldContents, source) => void` | `undefined` | Fires on every content change. |
| `onSelectionChange` | `(range, oldRange, source) => void` | `undefined` | Fires on selection/cursor changes. |
| `ref` | `Ref<Quill>` | - | Optional. Gives direct access to the underlying Quill instance: `getContents()`, `getText()`, `setContents()`, `root.innerHTML`, etc. |

### Live vs. mount-time props (read this before debugging "my prop isn't working")

`readOnly`, `enableTable`, `enableFormula`, and `onFileUpload` apply **live** -
changing them on an already-mounted editor takes effect immediately (the
`enable*` booleans rebuild the toolbar in place without losing the current
content).

`fonts`, `toolbar`, and `modules` are **mount-time only**. Changing them after
the editor has mounted does nothing, by design - they're arrays/objects, which
are easy to pass a new instance of on every render (e.g. an inline
`toolbar={[...]}` literal), and treating them as live would risk silently
rebuilding the editor (losing focus/selection) on every re-render. If a user
needs to swap one of these after mount (e.g. a "toolbar preset" switcher UI),
force a remount with a `key` prop that changes when the relevant value changes:

```tsx
<QuillBlogEditor key={toolbarPreset} toolbar={toolbarPreset === 'minimal' ? minimalToolbar : undefined} />
```

If you observe a prop from the second group appearing to "not work" when
toggled, this is the reason - it is not a bug, and doesn't need patching by
editing the package.

## File uploads (`onFileUpload`)

Quill's own image button defaults to embedding files as base64, which bloats
storage. This package replaces that with a callback you control:

- The file picker accepts `image/*,application/pdf`.
- Your `onFileUpload` function receives the picked `File` and must resolve to a
  **public HTTPS URL** (upload it to S3, your own API, a CDN, whatever - the
  package doesn't care how, it never calls `fetch` itself).
- If the file's MIME type starts with `image/`, the resolved URL is inserted as
  an embedded `<img>`.
- Otherwise (e.g. a PDF), it's inserted as a link with the filename as the
  visible text (a PDF can't render as an `<img>`).
- If `onFileUpload` is not provided and the user clicks the image button, the
  package logs a console error and shows a `window.alert` - it does **not**
  silently fall back to base64. If a user reports "the image button doesn't do
  anything," check whether `onFileUpload` was passed.

Do not build a `/api/upload`-shaped REST contract inside the app expecting the
package to call it - there is no `imageUploadUrl`-style prop; the callback is
the entire integration point.

## Formulas (`enableFormula`)

Quill's formula format renders through a global `window.katex`, which this
package deliberately never imports itself (KaTeX is large and most consumers
don't need it). To enable formulas:

```tsx
import katex from 'katex';
import 'katex/dist/katex.min.css';

window.katex = katex as unknown as typeof window.katex; // see note below
```

Run this once, near the app's entry point, before any `<QuillBlogEditor enableFormula />`
renders. If `enableFormula` is set but `window.katex` isn't, the package logs a
console warning naming the missing setup step - it does not throw or silently
disable the button.

TypeScript note: KaTeX's own `.d.ts` declares a self-referential global `Window.katex`
type that the plain ESM default export doesn't structurally match, so the assignment
above needs an `as unknown as typeof window.katex` cast - this is a quirk in KaTeX's
types, not a mistake in your code.

## Toolbar contents (built in - do not re-implement)

Default toolbar: font, header (H1-H6), size, bold/italic/underline/strike,
subscript/superscript, text/background color, line spacing, alignment,
ordered/bullet/checklist lists, indent, direction (RTL), blockquote, code block,
link, image, table, formula (if enabled), clear formatting.

The package also handles, automatically, with no prop and no extra CSS needed:

- **Hover tooltips** on every button/picker (a plain-language `title`, since
  Quill itself only ships an invisible `aria-label`).
- **`|` separators** between toolbar controls (but not after the last one).
- **Popup edge clamping**: the link/formula/video popup Quill shows on click
  stays at least 16px inside the editor's own edges, not the whole page - avoid
  wrapping the editor in a container that hides overflow right at its edges, as
  that's the one layout that could still clip the popup.
- **Font picker sizing**: the font dropdown's width tracks the longest label in
  whatever `fonts` list is active, so long names don't wrap. If you pass a
  custom `fonts` array with very long labels, this still applies automatically.

If a user asks for any of the above ("add tooltips to the toolbar," "separate
the buttons," "the font dropdown wraps") - it is very likely already handled;
check the installed version before adding custom CSS/JS for it.

## Troubleshooting checklist

- **Editor renders unstyled** → missing `import 'react-quill-blog-editor/style.css'`.
- **Image button does nothing / shows an alert** → `onFileUpload` wasn't passed.
- **Formula button warns in the console** → `window.katex` wasn't set (see above).
- **Toggling `fonts`/`toolbar`/`modules` has no visible effect** → expected;
  those are mount-time only, use a `key` to force a remount (see above).
- **Next.js: "document is not defined" or similar** → the file rendering
  `<QuillBlogEditor />` needs `'use client'`.
- **TypeScript error assigning to `window.katex`** → use the cast shown in the
  Formulas section above; it's a real quirk in KaTeX's own type declarations.
