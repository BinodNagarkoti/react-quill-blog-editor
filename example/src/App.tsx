import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Quill, { Delta, type Op } from 'quill';
import { QuillBlogEditor, QuillBlogViewer, type BinaryTheme } from 'react-quill-blog-editor';
import { uploadViaApi } from './lib/uploadViaApi.ts';
import './App.css';

const STORAGE_KEY = 'quill-blog-post';

const SAMPLE_TITLE = 'Implementation Of Quill in React JS/ Reactjs Framework';

const sampleContent = (): Delta =>
  new Delta()
    .insert('Getting Started with Quill in React')
    .insert('\n', { header: 1 })
    .insert(
      'Quill is a free, open-source WYSIWYG editor built for the modern web. This post shows how to wire it up as an ',
    )
    .insert('uncontrolled', { italic: true })
    .insert(
      ' React component so Quill keeps full control of its own DOM while React just listens for changes.',
    )
    .insert('\n\n')
    .insert('Try the toolbar', { header: 2 })
    .insert('\n')
    .insert('Pick a font, a heading level, or a text size')
    .insert('\n', { list: 'bullet' })
    .insert('Add a table, a link, an image, or a formula')
    .insert('\n', { list: 'bullet' })
    .insert('Adjust line spacing from the dropdown next to the color pickers')
    .insert('\n', { list: 'bullet' })
    .insert('\n')
    .insert(
      'Write something above, then hit Preview to see exactly what a reader would get back from QuillBlogViewer.',
    )
    .insert('\n');

interface SavedPost {
  title: string;
  content: Delta;
  savedAt: string | null;
}

interface StoredPost {
  title?: string;
  content?: { ops: Op[] };
  savedAt?: string;
}

function loadSavedPost(): SavedPost | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredPost;
    return {
      title: parsed.title ?? '',
      content: parsed.content ? new Delta(parsed.content.ops) : sampleContent(),
      savedAt: parsed.savedAt ?? null,
    };
  } catch {
    return null;
  }
}

const App = () => {
  const quillRef = useRef<Quill | null>(null);
  const initialPost = useMemo(() => loadSavedPost(), []);

  const [title, setTitle] = useState(initialPost?.title ?? SAMPLE_TITLE);
  const [readOnly, setReadOnly] = useState(false);
  const [enableTable, setEnableTable] = useState(true);
  const [enableFormula, setEnableFormula] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [savedAt, setSavedAt] = useState<string | null>(initialPost?.savedAt ?? null);
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const [previewHtml, setPreviewHtml] = useState('');
  // Mirrors the editor's own in-toolbar theme toggle (enableThemeToggle below)
  // so the Preview pane's separate QuillBlogViewer instance can match it.
  const [theme, setTheme] = useState<BinaryTheme>('light');

  const defaultContent = useMemo(
    () => initialPost?.content ?? sampleContent(),
    [initialPost],
  );

  const updateWordCount = useCallback(() => {
    const text = quillRef.current?.getText() ?? '';
    const words = text.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  }, []);

  const handleTextChange = useCallback(() => {
    updateWordCount();
  }, [updateWordCount]);

  useEffect(() => {
    updateWordCount();
  }, [updateWordCount]);

  const handlePublish = () => {
    if (!quillRef.current) return;
    const post = {
      title,
      content: quillRef.current.getContents(),
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(post));
    setSavedAt(post.savedAt);
  };

  // The editor is uncontrolled, so "what the reader would see" is only ever
  // knowable by asking Quill for its current HTML - there's no live-bound
  // content prop to derive it from. Snapshot it on demand, right when the
  // person switches tabs, so Preview always reflects the latest draft rather
  // than requiring a Publish first.
  const handleModeChange = (next: 'write' | 'preview') => {
    if (next === 'preview' && quillRef.current) {
      setPreviewHtml(quillRef.current.root.innerHTML);
    }
    setMode(next);
  };

  const readingTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <div className="page">
      <header className="page-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            Q
          </span>
          <div>
            <h1>react-quill-blog-editor</h1>
            <p className="subtitle">Write a post, then preview exactly what a reader gets back</p>
          </div>
        </div>

        <div className="settings">
          <label className="toggle">
            <input
              type="checkbox"
              checked={enableTable}
              onChange={(e) => setEnableTable(e.target.checked)}
            />
            <span className="toggle-track">
              <span className="toggle-thumb" />
            </span>
            <span className="toggle-label">Tables</span>
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={enableFormula}
              onChange={(e) => setEnableFormula(e.target.checked)}
            />
            <span className="toggle-track">
              <span className="toggle-thumb" />
            </span>
            <span className="toggle-label">Formulas</span>
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={readOnly}
              onChange={(e) => setReadOnly(e.target.checked)}
            />
            <span className="toggle-track">
              <span className="toggle-thumb" />
            </span>
            <span className="toggle-label">Read-only</span>
          </label>
        </div>
      </header>

      <main className="editor-card">
        <div className="card-toolbar">
          <div className="segmented" role="tablist" aria-label="View">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'write'}
              className={mode === 'write' ? 'active' : ''}
              onClick={() => handleModeChange('write')}
            >
              Write
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'preview'}
              className={mode === 'preview' ? 'active' : ''}
              onClick={() => handleModeChange('preview')}
            >
              Preview
            </button>
          </div>
        </div>

        {/* Kept mounted (just hidden) rather than unmounted on tab switch -
            QuillBlogEditor is uncontrolled, so unmounting would drop whatever
            was typed and remounting would reset back to defaultContent. */}
        <div className="editor-pane" style={{ display: mode === 'write' ? 'block' : 'none' }}>
          <input
            className="title-input"
            type="text"
            value={title}
            placeholder="Post title"
            onChange={(e) => setTitle(e.target.value)}
            readOnly={readOnly}
          />
          <QuillBlogEditor
            ref={quillRef}
            readOnly={readOnly}
            defaultValue={defaultContent}
            placeholder="Write your blog post..."
            enableTable={enableTable}
            enableFormula={enableFormula}
            enableThemeToggle
            onThemeChange={setTheme}
            onFileUpload={uploadViaApi}
            onTextChange={handleTextChange}
          />
        </div>

        {mode === 'preview' && (
          <div className="preview-pane">
            <p className="preview-meta">
              {wordCount} words · {readingTime} min read
            </p>
            <h1 className="preview-title">{title || 'Untitled post'}</h1>
            <QuillBlogViewer className="preview-body" content={previewHtml} theme={theme} />
          </div>
        )}

        {mode === 'write' && (
          <div className="editor-footer">
            <span>{wordCount} words</span>
            <span className="dot">·</span>
            <span>{savedAt ? `Saved ${new Date(savedAt).toLocaleString()}` : 'Not saved yet'}</span>
            <button type="button" className="publish-button" onClick={handlePublish}>
              Publish
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
