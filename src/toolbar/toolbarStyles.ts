import type Quill from 'quill';

const SEPARATOR_CLASS = 'ql-rqbe-separator';

// A border-based divider doubles up between adjacent controls (each contributes
// one edge) and reads as an uneven, thicker line. A literal `|` character,
// vertically centered against the 24px-tall buttons/pickers, reads more clearly
// as "these are separate controls" than a css border does.
export function injectToolbarStyles(): void {
  if (typeof document === 'undefined') return;

  const styleId = 'react-quill-blog-editor-toolbar';
  let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = `
.ql-toolbar.ql-snow .${SEPARATOR_CLASS} {
  display: inline-block;
  float: left;
  width: 12px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  color: #c6c6c6;
  font-size: 15px;
  user-select: none;
  pointer-events: none;
}`;
}

interface ToolbarModule {
  container?: HTMLElement | null;
}

// Inserts a `|` glyph between every pair of adjacent toolbar controls, but not
// after the very last one. Quill leaves each picker's original (hidden)
// <select> as a DOM sibling after the visible .ql-picker, so `.ql-formats >
// button, .ql-formats > .ql-picker` is used (rather than `.ql-picker-label`)
// to get each control's actual outer boundary - inserting after the label
// itself would land the glyph inside the picker's own box instead of beside it.
export function insertToolbarSeparators(quill: Quill): void {
  const toolbar = quill.getModule('toolbar') as ToolbarModule | undefined;
  const container = toolbar?.container;
  if (!container) return;

  const controls = Array.from(
    container.querySelectorAll<HTMLElement>('.ql-formats > button, .ql-formats > .ql-picker'),
  );

  controls.slice(0, -1).forEach((control) => {
    const separator = container.ownerDocument.createElement('span');
    separator.className = SEPARATOR_CLASS;
    separator.setAttribute('aria-hidden', 'true');
    separator.textContent = '|';
    control.insertAdjacentElement('afterend', separator);
  });
}
