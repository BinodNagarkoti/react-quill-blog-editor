import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import Quill, { Delta, Range, type EmitterSource } from 'quill';
import type { ToolbarConfig } from 'quill/modules/toolbar.js';
import 'quill/dist/quill.snow.css';

import { FONT_OPTIONS, registerFonts, injectFontStyles, type FontOption } from './formats/fonts.ts';
import { registerLineHeight, injectLineHeightStyles } from './formats/lineHeight.ts';
import { buildToolbarConfig } from './toolbar/buildToolbarConfig.ts';
import { createUploadHandler, type FileUploadHandler } from './toolbar/uploadHandler.ts';
import { createTableHandler } from './toolbar/tableHandler.ts';
import { warnIfKatexMissing } from './toolbar/formula.ts';
import { injectToolbarStyles, insertToolbarSeparators } from './toolbar/toolbarStyles.ts';
import { applyToolbarTitles } from './toolbar/toolbarTitles.ts';
import { createTooltipBoundsElement } from './toolbar/tooltipBounds.ts';

export interface QuillBlogEditorProps {
  readOnly?: boolean;
  defaultValue?: Delta;
  placeholder?: string;
  /**
   * Called when the image/file toolbar button is used. Receives the picked File
   * (images, or a PDF) and must resolve to a public HTTPS URL - implement this
   * however you like (upload to S3, your own API, a CDN, etc.). Image files are
   * inserted as an embedded image; anything else is inserted as a link.
   */
  onFileUpload?: FileUploadHandler;
  /** Adds a table toolbar button backed by Quill's built-in table module. Default true. */
  enableTable?: boolean;
  /**
   * Adds a formula toolbar button. Requires KaTeX to be installed and exposed as
   * `window.katex` by the consumer - see the package README. Default false.
   */
  enableFormula?: boolean;
  /** Overrides the font picker's options. Defaults to a curated list of common web fonts. */
  fonts?: FontOption[];
  /** Fully overrides the default toolbar layout. */
  toolbar?: ToolbarConfig;
  /** Extra Quill modules merged in alongside toolbar/table. */
  modules?: Record<string, unknown>;
  onTextChange?: (delta: Delta, oldContents: Delta, source: EmitterSource) => void;
  onSelectionChange?: (
    range: Range | null,
    oldRange: Range | null,
    source: EmitterSource,
  ) => void;
}

// Uncontrolled component: Quill owns the DOM, we only read/write via the ref.
const QuillBlogEditor = forwardRef<Quill, QuillBlogEditorProps>(
  (
    {
      readOnly,
      defaultValue,
      placeholder,
      onFileUpload,
      enableTable = true,
      enableFormula = false,
      fonts = FONT_OPTIONS,
      toolbar,
      modules,
      onTextChange,
      onSelectionChange,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);
    const onFileUploadRef = useRef(onFileUpload);
    // Carries content across an enableTable/enableFormula-triggered rebuild (see
    // below) so toggling those doesn't wipe what the user has typed.
    const pendingContentRef = useRef<Delta | null>(null);

    // The forwarded ref is optional (most consumers never need direct Quill
    // access), so this instance is always tracked internally and only mirrored
    // out to `ref` - as an object ref or a callback ref - when one is provided.
    const internalRef = useRef<Quill | null>(null);
    const setQuillInstance = useCallback(
      (value: Quill | null) => {
        internalRef.current = value;
        if (typeof ref === 'function') {
          ref(value);
        } else if (ref) {
          ref.current = value;
        }
      },
      [ref],
    );

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
      onFileUploadRef.current = onFileUpload;
    });

    useEffect(() => {
      internalRef.current?.enable(!readOnly);
    }, [readOnly]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      registerFonts(fonts);
      injectFontStyles(fonts);
      registerLineHeight();
      injectLineHeightStyles();
      injectToolbarStyles();
      if (enableFormula) warnIfKatexMissing();

      const editorContainer = container.appendChild(
        container.ownerDocument.createElement('div'),
      );
      const boundsElement = createTooltipBoundsElement(container);

      const toolbarConfig = toolbar ?? buildToolbarConfig({ fonts, enableTable, enableFormula });

      const quill: Quill = new Quill(editorContainer, {
        theme: 'snow',
        placeholder,
        bounds: boundsElement,
        modules: {
          ...modules,
          table: enableTable || undefined,
          toolbar: {
            container: toolbarConfig,
            handlers: {
              image: createUploadHandler(() => quill, () => onFileUploadRef.current),
              table: enableTable ? createTableHandler(() => quill) : undefined,
            },
          },
        },
      });

      applyToolbarTitles(quill);
      insertToolbarSeparators(quill);
      setQuillInstance(quill);

      // pendingContentRef is set below whenever this effect tears down an
      // existing instance (an enableTable/enableFormula toggle) - fall back to
      // defaultValue only on the very first mount.
      const initialContent = pendingContentRef.current ?? defaultValueRef.current;
      if (initialContent) {
        quill.setContents(initialContent);
      }
      pendingContentRef.current = null;

      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.(...args);
      });

      quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
        onSelectionChangeRef.current?.(...args);
      });

      return () => {
        pendingContentRef.current = quill.getContents();
        setQuillInstance(null);
        container.innerHTML = '';
      };
      // enableTable/enableFormula are plain booleans, safe to rebuild on - the
      // content-preservation above makes that rebuild invisible to the user.
      // `fonts`/`toolbar`/`modules` stay mount-time-only: consumers often pass
      // those as inline arrays/objects, which would otherwise rebuild on every
      // render.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enableTable, enableFormula, setQuillInstance]);

    return <div className={readOnly ? 'ql-readonly' : ''} ref={containerRef}></div>;
  },
);

QuillBlogEditor.displayName = 'QuillBlogEditor';

export default QuillBlogEditor;
