import { useState } from 'react';

export function CodeBlock({
  code,
  language = 'tsx',
  scroll = false,
}: {
  code: string;
  language?: string;
  /** Caps the block's height with a vertical scrollbar - for long content (e.g. a whole file). */
  scroll?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`code-block lang-${language}${scroll ? ' code-block-scroll' : ''}`}>
      <button type="button" className="code-copy" onClick={handleCopy}>
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
