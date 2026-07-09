// Quill's formula format renders via `window.katex` (see quill/formats/formula.js).
// We never import KaTeX ourselves - it's a large, optional peer dependency - so
// consumers who opt into formulas must load it and expose it globally themselves:
//
//   import katex from 'katex';
//   import 'katex/dist/katex.min.css';
//   window.katex = katex;
export function isKatexAvailable(): boolean {
  return typeof window !== 'undefined' && 'katex' in window;
}

export function warnIfKatexMissing(): void {
  if (!isKatexAvailable()) {
    console.warn(
      'react-quill-blog-editor: enableFormula is on but window.katex is not set. ' +
        'Install katex and set window.katex before using the formula button. ' +
        'See the react-quill-blog-editor README for setup.',
    );
  }
}
