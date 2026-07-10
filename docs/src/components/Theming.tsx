import { useMemo } from 'react';
import { QuillBlogEditor, Delta } from 'react-quill-blog-editor';
import { uploadViaApi } from '../../../example/src/lib/uploadViaApi.ts';
import { CodeBlock } from './CodeBlock.tsx';

const SNIPPET = '<QuillBlogEditor\n  enableThemeToggle\n  /* ...your other props */\n/>';

const sampleContent = () =>
  new Delta()
    .insert('Theming', { bold: true })
    .insert('\n', { header: 2 })
    .insert('Click the sun/moon icon at the end of the toolbar - it toggles live, no remount.')
    .insert('\n');

export function Theming() {
  const defaultValue = useMemo(() => sampleContent(), []);

  return (
    <div className="theming-demo">
      <div className="theming-editor">
        <QuillBlogEditor
          defaultValue={defaultValue}
          placeholder="Write something..."
          onFileUpload={uploadViaApi}
          enableThemeToggle
        />
      </div>

      <CodeBlock code={SNIPPET} />
    </div>
  );
}
