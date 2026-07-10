import type Quill from 'quill';

export type BinaryTheme = 'light' | 'dark';

// Matches Quill's own icon style (18x18 viewBox, colored via the `ql-stroke`/
// `ql-fill` classes that theme.css already re-colors per theme) so the button
// looks native rather than bolted on. The moon is drawn as one big circle
// minus an offset smaller circle (even-odd fill) rather than via a <mask> with
// a hardcoded id - multiple editors can be mounted on one page, and a shared
// id would collide between them.
const THEME_TOGGLE_ICONS: Record<BinaryTheme, string> = {
  light: `<svg viewbox="0 0 18 18"><circle class="ql-stroke" cx="9" cy="9" r="3"/><line class="ql-stroke" x1="9" x2="9" y1="1" y2="3"/><line class="ql-stroke" x1="9" x2="9" y1="15" y2="17"/><line class="ql-stroke" x1="1" x2="3" y1="9" y2="9"/><line class="ql-stroke" x1="15" x2="17" y1="9" y2="9"/><line class="ql-stroke" x1="3.5" x2="4.9" y1="3.5" y2="4.9"/><line class="ql-stroke" x1="13.1" x2="14.5" y1="13.1" y2="14.5"/><line class="ql-stroke" x1="3.5" x2="4.9" y1="14.5" y2="13.1"/><line class="ql-stroke" x1="13.1" x2="14.5" y1="4.9" y2="3.5"/></svg>`,
  dark: `<svg viewbox="0 0 18 18"><path class="ql-fill" fill-rule="evenodd" d="M2,9 A7,7 0 1 0 16,9 A7,7 0 1 0 2,9 Z M6.5,6 A5.5,5.5 0 1 0 17.5,6 A5.5,5.5 0 1 0 6.5,6 Z"/></svg>`,
};

const LABEL: Record<BinaryTheme, string> = {
  light: 'Switch to dark theme',
  dark: 'Switch to light theme',
};

interface IconRegistry {
  [format: string]: unknown;
}

// Called once per mount, right before `new Quill(...)`, so the button's
// first-paint icon already matches this instance's starting theme. Quill
// reads `icons[format]` synchronously while building the toolbar and never
// looks at it again, so later theme flips are applied by directly patching
// the rendered button (see updateThemeToggleButton) rather than re-registering.
export function registerThemeToggleIcon(Ctor: typeof Quill, theme: BinaryTheme): void {
  const icons = Ctor.import('ui/icons') as IconRegistry;
  icons['theme-toggle'] = THEME_TOGGLE_ICONS[theme];
}

export function updateThemeToggleButton(quill: Quill, theme: BinaryTheme): void {
  const toolbar = quill.getModule('toolbar') as { container?: HTMLElement } | undefined;
  const button = toolbar?.container?.querySelector<HTMLButtonElement>('.ql-theme-toggle');
  if (!button) return;
  button.innerHTML = THEME_TOGGLE_ICONS[theme];
  button.setAttribute('title', LABEL[theme]);
  button.setAttribute('aria-label', LABEL[theme]);
}

// Quill only wires up a button's click listener if a handler is registered
// for its format name (see Toolbar#attach) - 'theme-toggle' isn't a real
// Quill format, so without this the button would render but do nothing.
export function createThemeToggleHandler(onToggle: () => void): () => void {
  return () => onToggle();
}
