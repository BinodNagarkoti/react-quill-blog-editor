import { useMemo, useState } from 'react';
import { QuillBlogEditor, Delta, type FontOption } from 'react-quill-blog-editor';
import { uploadViaApi } from '../../../example/src/lib/uploadViaApi.ts';
import { CodeBlock } from './CodeBlock.tsx';

const MINIMAL_FONTS: FontOption[] = [
  { key: 'sans-serif', label: 'Sans Serif', family: 'Helvetica, Arial, sans-serif' },
  { key: 'serif', label: 'Serif', family: 'Georgia, "Times New Roman", serif' },
  { key: 'monospace', label: 'Monospace', family: '"Courier New", Courier, monospace' },
];

const MINIMAL_TOOLBAR = [['bold', 'italic', 'link'], ['clean']];

const sampleContent = () =>
  new Delta()
    .insert('Toggle the props on the left')
    .insert('\n', { header: 2 })
    .insert('and watch both the editor and the code below update.')
    .insert('\n');

type FontsPreset = 'default' | 'minimal';
type ToolbarPreset = 'default' | 'minimal';

export function Playground() {
  const [readOnly, setReadOnly] = useState(false);
  const [enableTable, setEnableTable] = useState(true);
  const [enableFormula, setEnableFormula] = useState(true);
  const [fontsPreset, setFontsPreset] = useState<FontsPreset>('default');
  const [toolbarPreset, setToolbarPreset] = useState<ToolbarPreset>('default');

  const defaultValue = useMemo(() => sampleContent(), []);

  const fonts = fontsPreset === 'minimal' ? MINIMAL_FONTS : undefined;
  const toolbar = toolbarPreset === 'minimal' ? MINIMAL_TOOLBAR : undefined;

  const snippet = useMemo(() => {
    const lines = [
      '<QuillBlogEditor',
      `  readOnly={${readOnly}}`,
      `  enableTable={${enableTable}}`,
      `  enableFormula={${enableFormula}}`,
      '  onFileUpload={(file) => uploadToMyBackend(file)}',
    ];
    if (fontsPreset === 'minimal') {
      lines.push('  fonts={[', "    { key: 'sans-serif', label: 'Sans Serif', family: '...' },", "    { key: 'serif', label: 'Serif', family: '...' },", "    { key: 'monospace', label: 'Monospace', family: '...' },", '  ]}');
    }
    if (toolbarPreset === 'minimal') {
      lines.push("  toolbar={[['bold', 'italic', 'link'], ['clean']]}");
    }
    lines.push('/>');
    return lines.join('\n');
  }, [readOnly, enableTable, enableFormula, fontsPreset, toolbarPreset]);

  return (
    <div className="playground">
      <p className="playground-note">
        <code>readOnly</code>, <code>enableTable</code>, and <code>enableFormula</code> apply
        live - toggling them rebuilds the toolbar in place without losing your content.{' '}
        <code>fonts</code> and <code>toolbar</code> are mount-time configuration (they&rsquo;re
        arrays, easy to pass unstably), so toggling those presets below remounts the editor
        instead.
      </p>
      <div className="playground-controls">
        <label className="toggle">
          <input type="checkbox" checked={readOnly} onChange={(e) => setReadOnly(e.target.checked)} />
          <span className="toggle-track">
            <span className="toggle-thumb" />
          </span>
          <span className="toggle-label">readOnly</span>
        </label>
        <label className="toggle">
          <input type="checkbox" checked={enableTable} onChange={(e) => setEnableTable(e.target.checked)} />
          <span className="toggle-track">
            <span className="toggle-thumb" />
          </span>
          <span className="toggle-label">enableTable</span>
        </label>
        <label className="toggle">
          <input type="checkbox" checked={enableFormula} onChange={(e) => setEnableFormula(e.target.checked)} />
          <span className="toggle-track">
            <span className="toggle-thumb" />
          </span>
          <span className="toggle-label">enableFormula</span>
        </label>

        <div className="playground-preset">
          <span>fonts</span>
          <div className="playground-preset-buttons">
            <button
              type="button"
              className={fontsPreset === 'default' ? 'active' : ''}
              onClick={() => setFontsPreset('default')}
            >
              Default (14)
            </button>
            <button
              type="button"
              className={fontsPreset === 'minimal' ? 'active' : ''}
              onClick={() => setFontsPreset('minimal')}
            >
              Minimal (3)
            </button>
          </div>
        </div>

        <div className="playground-preset">
          <span>toolbar</span>
          <div className="playground-preset-buttons">
            <button
              type="button"
              className={toolbarPreset === 'default' ? 'active' : ''}
              onClick={() => setToolbarPreset('default')}
            >
              Default
            </button>
            <button
              type="button"
              className={toolbarPreset === 'minimal' ? 'active' : ''}
              onClick={() => setToolbarPreset('minimal')}
            >
              Minimal
            </button>
          </div>
        </div>
      </div>

      <div className="playground-editor">
        <QuillBlogEditor
          key={`${fontsPreset}-${toolbarPreset}`}
          readOnly={readOnly}
          enableTable={enableTable}
          enableFormula={enableFormula}
          fonts={fonts}
          toolbar={toolbar}
          onFileUpload={uploadViaApi}
          defaultValue={defaultValue}
          placeholder="Write something..."
        />
      </div>

      <CodeBlock code={snippet} />
    </div>
  );
}
