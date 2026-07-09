import React from 'react';
import ReactDOM from 'react-dom/client';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import App from './App.tsx';
import './index.css';

// The playground's "enableFormula" toggle needs window.katex set - see
// react-quill-blog-editor's README for why this is the consumer's responsibility.
window.katex = katex as unknown as typeof window.katex;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
