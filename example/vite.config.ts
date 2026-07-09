import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { imageUploadPlugin } from './vite-plugins/imageUploadPlugin.ts';

const exampleDir = fileURLToPath(new URL('.', import.meta.url));
const librarySrc = fileURLToPath(new URL('../src/index.ts', import.meta.url));

export default defineConfig({
  root: exampleDir,
  plugins: [react(), imageUploadPlugin()],
  resolve: {
    alias: {
      'react-quill-blog-editor': librarySrc,
    },
  },
});
