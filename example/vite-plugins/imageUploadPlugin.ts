import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync } from 'node:fs';
import { extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Connect, Plugin } from 'vite';
import multer from 'multer';
import type { Request, Response } from 'express';

const UPLOAD_DIR = fileURLToPath(new URL('../public/uploads', import.meta.url));

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });
    callback(null, UPLOAD_DIR);
  },
  filename: (_req, file, callback) => {
    callback(null, `${randomUUID()}${extname(file.originalname)}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }).single('image');

function sendJson(res: import('node:http').ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

// Mocks a real upload API for this demo: saves the file to public/uploads and
// returns its public URL, so the Quill image handler never has to embed base64.
const handleUpload: Connect.NextHandleFunction = (req, res) => {
  upload(req as unknown as Request, res as unknown as Response, (err: unknown) => {
    if (err) {
      sendJson(res, 400, { error: err instanceof Error ? err.message : 'Upload failed' });
      return;
    }

    const file = (req as unknown as Request).file;
    if (!file) {
      sendJson(res, 400, { error: 'No image file provided' });
      return;
    }

    sendJson(res, 200, { url: `/uploads/${file.filename}` });
  });
};

export function imageUploadPlugin(): Plugin {
  return {
    name: 'image-upload-middleware',
    configureServer(server) {
      server.middlewares.use('/api/upload', handleUpload);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/upload', handleUpload);
    },
  };
}
