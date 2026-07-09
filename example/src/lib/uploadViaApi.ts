interface UploadResponse {
  url: string;
}

// Implements react-quill-blog-editor's onFileUpload prop against this app's own
// dev-only mock endpoint (see vite-plugins/imageUploadPlugin.ts). A real app would
// point this at its own upload API, S3, a CDN, etc.
export async function uploadViaApi(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }

  const data = (await response.json()) as UploadResponse;
  return data.url;
}
