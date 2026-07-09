import Quill from 'quill';

export const LINE_HEIGHT_WHITELIST = ['1', '1.15', '1.5', '2', '2.5', '3'];
export const LINE_HEIGHT_TOOLBAR_VALUES: (string | false)[] = [false, ...LINE_HEIGHT_WHITELIST];

interface ParchmentModule {
  StyleAttributor: new (
    name: string,
    keyName: string,
    options: { scope: number; whitelist: string[] },
  ) => unknown;
  Scope: { BLOCK: number };
}

let registered = false;

type QuillRegister = (target: Record<string, unknown>, overwrite?: boolean) => void;

// Quill has no notion of paragraph "spacing" out of the box, so this registers a
// plain CSS line-height format ourselves via Parchment, the same mechanism Quill's
// own formats (e.g. font, size) are built on.
export function registerLineHeight(): void {
  if (registered) return;
  const Parchment = Quill.import('parchment') as unknown as ParchmentModule;
  const LineHeight = new Parchment.StyleAttributor('lineheight', 'line-height', {
    scope: Parchment.Scope.BLOCK,
    whitelist: LINE_HEIGHT_WHITELIST,
  });
  // Quill.register()'s overloads are typed for its own known formats and don't
  // model arbitrary custom-format keys, even though registering them this way is
  // the documented extension mechanism. Loosen the signature locally for this
  // call only - cast inline (not via an intermediate variable) so `this` inside
  // Quill.register's own implementation still resolves to the Quill class.
  (Quill.register as QuillRegister)({ 'formats/lineheight': LineHeight }, true);
  registered = true;
}

// Quill's picker items get their visible label from CSS `content`, driven by
// quill.snow.css for its own formats. A custom format like ours has no such rule,
// which leaves the picker's options empty (zero width/height, unclickable) rather
// than just unlabeled - so this is required, not cosmetic.
export function injectLineHeightStyles(): void {
  if (typeof document === 'undefined') return;

  const styleId = 'react-quill-blog-editor-lineheight';
  let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = `
.ql-picker.ql-lineheight {
  width: 110px;
}
.ql-picker.ql-lineheight .ql-picker-label::before,
.ql-picker.ql-lineheight .ql-picker-item::before {
  content: 'Spacing';
}
.ql-picker.ql-lineheight .ql-picker-label[data-value]::before,
.ql-picker.ql-lineheight .ql-picker-item[data-value]::before {
  content: attr(data-value);
}`;
}
