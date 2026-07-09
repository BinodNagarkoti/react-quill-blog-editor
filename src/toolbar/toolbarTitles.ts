import type Quill from 'quill';

const BUTTON_TITLES: Record<string, string> = {
  bold: 'Bold',
  italic: 'Italic',
  underline: 'Underline',
  strike: 'Strikethrough',
  blockquote: 'Blockquote',
  'code-block': 'Code Block',
  link: 'Insert Link',
  image: 'Insert Image or File',
  table: 'Insert Table',
  formula: 'Insert Formula (requires KaTeX)',
  clean: 'Clear Formatting',
  direction: 'Text Direction (RTL)',
};

const BUTTON_VALUE_TITLES: Record<string, Record<string, string>> = {
  script: { sub: 'Subscript', super: 'Superscript' },
  list: { ordered: 'Numbered List', bullet: 'Bulleted List', check: 'Checklist' },
  indent: { '-1': 'Decrease Indent', '+1': 'Increase Indent' },
};

const PICKER_TITLES: Record<string, string> = {
  font: 'Font',
  header: 'Heading',
  size: 'Font Size',
  color: 'Text Color',
  background: 'Background Color',
  align: 'Alignment',
  lineheight: 'Line Spacing',
};

interface ToolbarModule {
  container?: HTMLElement | null;
}

// Quill's toolbar buttons/pickers only carry an aria-label (for screen readers,
// invisible on hover). This adds native `title` attributes so hovering any
// control shows a plain-language tooltip of what it does.
export function applyToolbarTitles(quill: Quill): void {
  const toolbar = quill.getModule('toolbar') as ToolbarModule | undefined;
  const container = toolbar?.container;
  if (!container) return;

  container.querySelectorAll('button').forEach((button) => {
    const format = Array.from(button.classList)
      .find((className) => className.startsWith('ql-'))
      ?.slice('ql-'.length);
    if (!format) return;

    const value = button.getAttribute('value');
    const title = (value && BUTTON_VALUE_TITLES[format]?.[value]) ?? BUTTON_TITLES[format];
    if (title) button.setAttribute('title', title);
  });

  Object.entries(PICKER_TITLES).forEach(([format, title]) => {
    container.querySelector(`.ql-picker.ql-${format} .ql-picker-label`)?.setAttribute('title', title);
  });
}
