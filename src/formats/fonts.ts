import Quill from 'quill';
import {
  DEFAULT_FONT_KEY,
  FONT_OPTIONS,
  fontFaceCss,
  fontToolbarValues,
  fontWhitelist,
  type FontOption,
} from './fontOptions.ts';

export { DEFAULT_FONT_KEY, FONT_OPTIONS, fontFaceCss, fontToolbarValues, fontWhitelist, type FontOption };

// Quill's Font format only whitelists 'serif' and 'monospace' by default. We extend
// its whitelist in place (the documented way to add fonts) so the `font` format and
// toolbar picker recognize the rest of FONT_OPTIONS (or a caller-supplied list).
export function registerFonts(fonts: FontOption[] = FONT_OPTIONS): void {
  // Quill.import returns the already-registered Font attributor by reference, so
  // mutating its whitelist in place is enough - no re-registration needed.
  const Font = Quill.import('formats/font') as { whitelist: string[] };
  Font.whitelist = fontWhitelist(fonts);
}

// The picker's option labels/font previews aren't in quill.snow.css for anything
// beyond serif/monospace, and applying a font in the editor needs a matching
// `.ql-font-<key>` rule. Inject both dynamically so custom font lists work without
// requiring consumers to hand-write CSS.
export function injectFontStyles(fonts: FontOption[] = FONT_OPTIONS): void {
  if (typeof document === 'undefined') return;

  const styleId = 'react-quill-blog-editor-fonts';
  let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }

  const escape = (value: string) => value.replace(/'/g, "\\'");

  // Quill's default .ql-picker.ql-font width (108px, from quill.snow.css) only
  // fits short labels like "Serif". Longer ones ("Times New Roman", "Comic Sans
  // MS") wrap inside the closed label, growing it taller and overlapping the
  // toolbar groups after it. Size the picker to the longest label in this list,
  // and ellipsis-truncate as a fallback for anything still too long to fit.
  const longestLabelLength = Math.max(
    'Sans Serif'.length,
    ...fonts.map((font) => font.label.length),
  );
  const pickerWidth = Math.max(108, longestLabelLength * 7 + 36);

  const baseRule = `
.ql-snow .ql-picker.ql-font {
  width: ${pickerWidth}px;
}
.ql-snow .ql-picker.ql-font .ql-picker-label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ql-snow .ql-picker.ql-font .ql-picker-label::before {
  display: inline;
}
.ql-snow .ql-picker.ql-expanded .ql-picker-options{
  right: 0px;
}

.ql-snow .ql-picker.ql-font .ql-picker-options {
  width: max-content;
}`;

  const pickerLabelRules = fonts
    .filter((font) => font.key !== DEFAULT_FONT_KEY)
    .map(
      (font) => `
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="${font.key}"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="${font.key}"]::before {
  content: '${escape(font.label)}';
}
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="${font.key}"]::before {
  font-family: ${font.family};
}`,
    )
    .join('\n');

  styleEl.textContent = baseRule + pickerLabelRules + fontFaceCss(fonts);
}
