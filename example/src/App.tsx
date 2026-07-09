import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Quill, { Delta, type Op } from 'quill';
import { QuillBlogEditor } from 'react-quill-blog-editor';
import { uploadViaApi } from './lib/uploadViaApi.ts';
import './App.css';

const STORAGE_KEY = 'quill-blog-post';

const SAMPLE_TITLE = 'Getting Started with Quill in React';

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
      'Try editing this post, switch to Preview to see the rendered article, then hit Publish to persist it to localStorage.',
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
      html: quillRef.current.root.innerHTML,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(post));
    setSavedAt(post.savedAt);
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>react-quill-blog-editor</h1>
          <p className="subtitle">Example app showcasing the published component&rsquo;s props</p>
        </div>
        <div className="mode-toggle">
          <label>
            <input
              type="checkbox"
              checked={enableTable}
              onChange={(e) => setEnableTable(e.target.checked)}
            />
            enableTable
          </label>
          <label>
            <input
              type="checkbox"
              checked={enableFormula}
              onChange={(e) => setEnableFormula(e.target.checked)}
            />
            enableFormula
          </label>
          <label>
            <input
              type="checkbox"
              checked={readOnly}
              onChange={(e) => setReadOnly(e.target.checked)}
            />
            readOnly
          </label>
        </div>
      </header>

      <main className="editor-card">
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
          onFileUpload={uploadViaApi}
          onTextChange={handleTextChange}
        />

        <div className="editor-footer">
          <span>{wordCount} words</span>
          <span>{savedAt ? `Saved ${new Date(savedAt).toLocaleString()}` : 'Not saved yet'}</span>
          <button type="button" className="publish-button" onClick={handlePublish}>
            Publish
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
