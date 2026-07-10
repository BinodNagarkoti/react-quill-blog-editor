export interface FontOption {
  key: string;
  label: string;
  family: string;
}

export const DEFAULT_FONT_KEY = 'sans-serif';

export const FONT_OPTIONS: FontOption[] = [
  { key: 'sans-serif', label: 'Sans Serif', family: 'Helvetica, Arial, sans-serif' },
  { key: 'serif', label: 'Serif', family: 'Georgia, "Times New Roman", serif' },
  { key: 'monospace', label: 'Monospace', family: '"Courier New", Courier, monospace' },
  { key: 'arial', label: 'Arial', family: 'Arial, Helvetica, sans-serif' },
  { key: 'georgia', label: 'Georgia', family: 'Georgia, serif' },
  { key: 'times-new-roman', label: 'Times New Roman', family: '"Times New Roman", Times, serif' },
  { key: 'courier-new', label: 'Courier New', family: '"Courier New", Courier, monospace' },
  { key: 'comic-sans', label: 'Comic Sans MS', family: '"Comic Sans MS", "Comic Sans", cursive' },
  { key: 'trebuchet-ms', label: 'Trebuchet MS', family: '"Trebuchet MS", sans-serif' },
  { key: 'verdana', label: 'Verdana', family: 'Verdana, Geneva, sans-serif' },
  { key: 'tahoma', label: 'Tahoma', family: 'Tahoma, Geneva, sans-serif' },
  { key: 'garamond', label: 'Garamond', family: 'Garamond, serif' },
  { key: 'impact', label: 'Impact', family: 'Impact, Haettenschweiler, sans-serif' },
  { key: 'papyrus', label: 'Papyrus', family: 'Papyrus, fantasy' },
];

export function fontWhitelist(fonts: FontOption[]): string[] {
  return fonts.filter((font) => font.key !== DEFAULT_FONT_KEY).map((font) => font.key);
}

export function fontToolbarValues(fonts: FontOption[]): (string | false)[] {
  return [false, ...fontWhitelist(fonts)];
}

// Pure and dependency-free (no `quill`, no `document`) so it can run anywhere,
// including during SSR/RSC rendering. Builds just the `.ql-font-<key>` rules
// that make HTML captured from a live editor (e.g. `quill.root.innerHTML`)
// render with the right fonts wherever it's redisplayed later.
export function fontFaceCss(fonts: FontOption[] = FONT_OPTIONS): string {
  return fonts
    .filter((font) => font.key !== DEFAULT_FONT_KEY)
    .map((font) => `.ql-font-${font.key} { font-family: ${font.family}; }`)
    .join('\n');
}
