import { useMemo } from 'react';
import { QuillBlogEditor, Delta } from 'react-quill-blog-editor';
import { uploadViaApi } from '../../../example/src/lib/uploadViaApi.ts';
import { CodeBlock } from './CodeBlock.tsx';

const showcaseContent = () =>
  new Delta()
    .insert('Write beautiful posts, faster.', { bold: true })
    .insert('\n', { header: 1 })
    .insert('A React wrapper around Quill 2, ready for blog content out of the box.')
    .insert('\n\n')
    .insert('Fonts, tables, colors, alignment, line spacing')
    .insert('\n', { list: 'bullet' })
    .insert('Image & PDF uploads without base64')
    .insert('\n', { list: 'bullet' })
    .insert('Optional math formulas via KaTeX')
    .insert('\n', { list: 'bullet' })
    .insert('\n')
    .insert('Try it - type below, format some text, or insert a table.', { italic: true })
    .insert('\n');

export function Hero() {
  const defaultValue = useMemo(() => showcaseContent(), []);

  return (
    <section className="hero" id="top">
      <p className="hero-kicker">React + Quill 2</p>
      <h1 className="hero-title">A drop-in rich text editor, built for blog content</h1>
      <p className="hero-tagline">
        Fonts, tables, colors, alignment, and line spacing preconfigured. Image and PDF uploads
        with no base64. Optional math formulas. One component, one CSS import.
      </p>

      <div className="hero-actions">
        <a href="#install" className="button button-primary">
          Get started
        </a>
        <a
          href="https://github.com/BinodNagarkoti/react-quill-blog-editor"
          target="_blank"
          rel="noreferrer"
          className="button button-secondary"
        >
          View on GitHub
        </a>
      </div>

      <div className="hero-install">
        <CodeBlock code="npm install react-quill-blog-editor quill react react-dom" language="bash" />
      </div>

      <div className="hero-demo">
        <QuillBlogEditor
          defaultValue={defaultValue}
          placeholder="Write something..."
          onFileUpload={uploadViaApi}
        />
      </div>
    </section>
  );
}
