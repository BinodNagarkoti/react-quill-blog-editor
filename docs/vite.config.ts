import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { imageUploadPlugin } from '../example/vite-plugins/imageUploadPlugin.ts';

const docsDir = fileURLToPath(new URL('.', import.meta.url));
const librarySrc = fileURLToPath(new URL('../src/index.ts', import.meta.url));

export default defineConfig({
  root: docsDir,
  base: '/',
  plugins: [react(), imageUploadPlugin()],
  resolve: {
    alias: {
      'react-quill-blog-editor': librarySrc,
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
