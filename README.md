# react-quill-blog-editor

A React wrapper around [Quill 2](https://quilljs.com) preconfigured for blog content: fonts, headings, sizes, colors, alignment, line spacing, lists, tables, image uploads (no base64), and optional math formulas.

## Install

```bash
npm install react-quill-blog-editor quill react react-dom
```

Formulas are opt-in and require [KaTeX](https://katex.org) as a peer dependency - only install it if you set `enableFormula`:

```bash
npm install katex
```

## Usage

```tsx
import { useRef } from 'react';
import { QuillBlogEditor, Delta } from 'react-quill-blog-editor';
import 'react-quill-blog-editor/style.css';
import type Quill from 'quill';

const defaultValue = new Delta()
  .insert('Hello world')
  .insert('\n', { header: 1 });

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('/api/upload', { method: 'POST', body: formData });
  const { url } = await response.json();
  return url; // must be a public HTTPS URL
}

function BlogEditor() {
  const quillRef = useRef<Quill | null>(null);

  return (
    <QuillBlogEditor
      ref={quillRef}
      defaultValue={defaultValue}
      placeholder="Write your post..."
      onFileUpload={uploadFile}
      onTextChange={(delta, oldContents, source) => {
        console.log(quillRef.current?.getContents());
      }}
    />
  );
}
```

`onFileUpload` is called with the picked `File` (an image, or a PDF - the picker accepts `image/*,application/pdf`) and must resolve to a public HTTPS URL. Implement it however you like: your own API, S3, a CDN, whatever. Image files are inserted as an embedded `<img>`; everything else (e.g. a PDF) is inserted as a link showing the filename, since it can't render as an image. If `onFileUpload` isn't provided, using the button logs an error and shows an alert instead of silently embedding base64.

### Formulas (optional)

```tsx
import katex from 'katex';
import 'katex/dist/katex.min.css';

window.katex = katex; // Quill's formula format renders through window.katex

<QuillBlogEditor enableFormula />
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `readOnly` | `boolean` | `false` | Disables editing and hides the toolbar. |
| `defaultValue` | `Delta` | `undefined` | Initial content (uncontrolled - set once on mount). |
| `placeholder` | `string` | `undefined` | Placeholder text shown when empty. |
| `onFileUpload` | `(file: File) => Promise<string>` | `undefined` | Called with the picked file; must resolve to a public HTTPS URL. Images embed, other files (e.g. PDF) insert as a link. |
| `enableTable` | `boolean` | `true` | Adds a table toolbar button (Quill's built-in table module: insert only, no resize/merge). |
| `enableFormula` | `boolean` | `false` | Adds a formula toolbar button. Requires `window.katex` to be set - see above. |
| `fonts` | `FontOption[]` | 14 curated web fonts | Overrides the font picker's options. |
| `toolbar` | `ToolbarConfig` | `undefined` | Fully replaces the default toolbar layout. |
| `modules` | `Record<string, unknown>` | `undefined` | Extra Quill modules merged in alongside toolbar/table. |
| `onTextChange` | `(delta, oldContents, source) => void` | `undefined` | Fires on every content change. |
| `onSelectionChange` | `(range, oldRange, source) => void` | `undefined` | Fires on selection/cursor changes. |

The component also forwards a `ref` giving direct access to the underlying `Quill` instance (`getContents()`, `getText()`, `root.innerHTML`, etc.).

`readOnly`, `enableTable`, and `enableFormula` apply live - toggling them rebuilds the toolbar in place without losing the current content. `fonts`, `toolbar`, and `modules` are mount-time configuration: changing them after the editor has mounted has no effect (they're arrays/objects, which are easy to pass a new instance of on every render, so treating them as live would risk rebuilding on every re-render). Force a re-mount with a `key` if you need to change one of those after the fact.

## Toolbar

The default toolbar includes: font, header (H1-H6), size, bold/italic/underline/strike, subscript/superscript, text/background color, line spacing, alignment, ordered/bullet/checklist lists, indent, direction (RTL), blockquote, code block, link, image, table, formula (if enabled), and clear formatting.

A few things are handled for you automatically, with no prop required:

- **Hover tooltips.** Every button and picker gets a plain-language `title` (e.g. "Bold", "Insert Table", "Line Spacing") - Quill only ships an `aria-label`, which isn't visible on hover.
- **`|` separators.** A thin `|` glyph sits between every control except the last one, so individual buttons read as distinct items instead of a flush row of icons.
- **Popup positioning.** The link/formula/video tooltip Quill shows on click is kept at least 16px inside the editor's own edges (Quill's default `bounds` is the whole page `<body>`, which can clamp a tooltip against the *page* edge instead of the editor's when the selection is near the left/right side of a narrower or padded container).
- **Font picker width.** The font picker is sized to whatever the longest label in your `fonts` list actually is (falling back to ellipsis for anything still too long), so a name like "Times New Roman" doesn't wrap and overlap the next toolbar group.

## Development

This repo is the library source plus three Vite apps that consume it via a source alias (no build step needed while developing):

```bash
npm run dev          # example/ - a blog-editor demo (title, publish, preview mode)
npm run dev:docs      # docs/  - install/usage docs with a live props playground
npm run build         # builds the publishable library into dist/
npm run build:example
npm run build:docs
npm run typecheck
npm run lint
```

## For AI coding agents

[`.claude/skills/react-quill-blog-editor/SKILL.md`](.claude/skills/react-quill-blog-editor/SKILL.md) is a self-contained reference for implementing this library, meant to be read by an AI agent (Claude Code or otherwise) rather than a human - install steps, the full props reference, the `onFileUpload` contract, KaTeX setup, and a troubleshooting checklist.

Get it into any project (this one or another) with:

```bash
npx react-quill-blog-editor
```

This writes `.claude/skills/react-quill-blog-editor/SKILL.md` into the current directory - it won't overwrite an existing copy unless you pass `--force`. No network access beyond npm's own package fetch; it just copies a file bundled in the package.

Don't have (or don't want) network access to run that? Copy the file directly - it's plain markdown, portable to any project's `.claude/skills/` directory by hand.
