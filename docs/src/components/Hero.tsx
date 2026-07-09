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
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="hero-kicker">React + Quill 2</p>
          <h1>react-quill-blog-editor</h1>
          <p className="hero-tagline">
            A drop-in rich text editor for blog content: fonts, tables, colors, line spacing,
            image/PDF uploads with no base64, and optional math formulas - all preconfigured.
          </p>
          <CodeBlock code="npm install react-quill-blog-editor" language="bash" />
          <a href="#install" className="hero-link">
            Full setup &darr;
          </a>
        </div>
        <div className="hero-demo">
          <QuillBlogEditor
            defaultValue={defaultValue}
            placeholder="Write something..."
            onFileUpload={uploadViaApi}
          />
        </div>
      </div>
    </section>
  );
}
