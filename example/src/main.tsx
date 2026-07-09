import React from 'react';
import ReactDOM from 'react-dom/client';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import App from './App.tsx';
import './index.css';

// react-quill-blog-editor's formula button renders via window.katex - see its
// enableFormula prop docs. KaTeX is a peer dependency the consumer wires up.
// (katex's own .d.ts declares a self-referential `katex` global type that the
// ESM default export doesn't structurally match - hence the cast.)
window.katex = katex as unknown as typeof window.katex;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
