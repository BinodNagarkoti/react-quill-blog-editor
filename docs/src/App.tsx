import { Nav } from './components/Nav.tsx';
import { Hero } from './components/Hero.tsx';
import { Features } from './components/Features.tsx';
import { CodeBlock } from './components/CodeBlock.tsx';
import { PropsTable } from './components/PropsTable.tsx';
import { Playground } from './components/Playground.tsx';
import { Theming } from './components/Theming.tsx';
import { SkillSection } from './components/SkillSection.tsx';
import './App.css';

const INSTALL_SNIPPET = `npm install react-quill-blog-editor quill react react-dom

# optional - only needed if you set enableFormula
npm install katex`;

const USAGE_SNIPPET = `import { useRef } from 'react';
import { QuillBlogEditor, Delta } from 'react-quill-blog-editor';
import 'react-quill-blog-editor/style.css';
import type Quill from 'quill';

const defaultValue = new Delta()
  .insert('Hello world')
  .insert('\\n', { header: 1 });

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('/api/upload', { method: 'POST', body: formData });
  const { url } = await response.json();
  return url; // must be a public HTTPS URL
}

function BlogEditor() {
  const quillRef = useRef<Quill | null>(null);

  return (
    <QuillBlogEditor
      ref={quillRef}
      defaultValue={defaultValue}
      placeholder="Write your post..."
      onFileUpload={uploadFile}
      onTextChange={() => {
        console.log(quillRef.current?.getContents());
      }}
    />
  );
}`;

const FORMULA_SNIPPET = `import katex from 'katex';
import 'katex/dist/katex.min.css';

window.katex = katex; // Quill's formula format renders through window.katex

<QuillBlogEditor enableFormula />`;

function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Features />
      <div className="docs">
        <section className="docs-section" id="install">
          <p className="docs-eyebrow">Setup</p>
          <h2>Install</h2>
          <CodeBlock code={INSTALL_SNIPPET} language="bash" />
        </section>

        <section className="docs-section" id="usage">
          <p className="docs-eyebrow">Setup</p>
          <h2>Usage</h2>
          <CodeBlock code={USAGE_SNIPPET} />
          <p className="docs-note">
            <code>onFileUpload</code> receives the picked file (an image, or a PDF - the picker
            accepts <code>image/*,application/pdf</code>) and must resolve to a public HTTPS URL.
            Implement it however you like. Image files insert as an embedded image; anything else
            inserts as a link showing the filename.
          </p>
        </section>

        <section className="docs-section" id="formulas">
          <p className="docs-eyebrow">Setup</p>
          <h2>Formulas (optional)</h2>
          <CodeBlock code={FORMULA_SNIPPET} />
        </section>

        <section className="docs-section" id="toolbar">
          <p className="docs-eyebrow">Reference</p>
          <h2>Toolbar</h2>
          <p className="docs-note">
            The default toolbar includes font, header (H1-H6), size, bold/italic/underline/strike,
            subscript/superscript, text/background color, line spacing, alignment, lists, indent,
            direction (RTL), blockquote, code block, link, image, table, formula (if enabled), and
            clear formatting. A few things are handled for you with no prop required: every control
            gets a hover <code>title</code>, a <code>|</code> separator sits between controls (but
            not after the last one), click-triggered popups (link/formula/video) stay inset from the
            editor&rsquo;s own edges rather than clamping to the page, and the font picker sizes
            itself to your longest font label instead of wrapping.
          </p>
        </section>

        <section className="docs-section" id="theming">
          <p className="docs-eyebrow">Reference</p>
          <h2>Theming</h2>
          <p className="docs-note">
            Both components ship a built-in light theme (the default) and dark theme, plus{' '}
            <code>theme=&quot;auto&quot;</code> to follow the OS/browser&rsquo;s{' '}
            <code>prefers-color-scheme</code>. Pass <code>enableThemeToggle</code> to{' '}
            <code>QuillBlogEditor</code> for a sun/moon button right in the toolbar, so readers can
            flip it themselves with no external control needed - live, no remount, no lost content.
          </p>
          <Theming />
        </section>

        <section className="docs-section" id="playground">
          <p className="docs-eyebrow">Try it</p>
          <h2>Playground</h2>
          <p className="docs-note">Toggle props and watch the editor and the code stay in sync.</p>
          <Playground />
        </section>

        <section className="docs-section" id="props">
          <p className="docs-eyebrow">Reference</p>
          <h2>Props</h2>
          <PropsTable />
          <p className="docs-note">
            The component forwards a <code>ref</code> to the underlying <code>Quill</code> instance.{' '}
            <code>readOnly</code>, <code>enableTable</code>, and <code>enableFormula</code> apply
            live - toggling them rebuilds the toolbar in place without losing content.{' '}
            <code>fonts</code>, <code>toolbar</code>, and <code>modules</code> are mount-time
            configuration (they&rsquo;re arrays/objects, easy to pass unstably), so changing them
            after mount has no effect - force a remount with a <code>key</code> if you need to.
          </p>
        </section>

        <SkillSection />
      </div>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <span>MIT licensed. Built on Quill 2.</span>
          <a href="https://github.com/BinodNagarkoti/react-quill-blog-editor" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </footer>
    </>
  );
}

export default App;
