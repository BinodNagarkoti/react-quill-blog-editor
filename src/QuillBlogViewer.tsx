import './theme/theme.css';
import { FONT_OPTIONS, fontFaceCss, type FontOption } from './formats/fontOptions.ts';
import type { ThemeMode } from './theme/themeMode.ts';

export interface QuillBlogViewerProps {
  /**
   * HTML to display, exactly as produced by a QuillBlogEditor instance -
   * capture it with `quillRef.current.root.innerHTML` when the post is
   * saved/published, store it alongside (or instead of) the Delta, and pass
   * it back in here at read time.
   *
   * There's no `delta` prop: turning a Delta back into HTML faithfully
   * (fonts, tables, formulas, line spacing, indents) is exactly what Quill's
   * own DOM-based renderer does, and mounting that renderer is the
   * `document`/`window` access this component exists to avoid. Save the HTML
   * once, on the client, where the editor already lives.
   */
  content: string;
  /**
   * Must match the `fonts` list (if any) passed to the QuillBlogEditor that
   * produced `content`, so `ql-font-*` classes resolve to the right
   * font-family. Defaults to the same curated list QuillBlogEditor defaults to.
   */
  fonts?: FontOption[];
  /**
   * Built-in color theme - same palette QuillBlogEditor uses, so a post
   * viewed here matches how it looked while being written. `'auto'` follows
   * the OS/browser's `prefers-color-scheme`. Default `'light'`.
   */
  theme?: ThemeMode;
  className?: string;
}

// Pure presentational component: no hooks, no `document`/`window` access, and
// no `quill` import - safe to render on the server, including React Server
// Components, with no 'use client' directive needed.
export default function QuillBlogViewer({
  content,
  fonts = FONT_OPTIONS,
  theme = 'light',
  className,
}: QuillBlogViewerProps) {
  return (
    <div
      className={`rqbe-theme${className ? ` ${className}` : ''}`}
      data-rqbe-theme={theme}
    >
      <style>{fontFaceCss(fonts)}</style>
      {/* content is trusted HTML produced by QuillBlogEditor - sanitize it yourself first if it can come from an untrusted author. */}
      <div className="ql-editor" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
