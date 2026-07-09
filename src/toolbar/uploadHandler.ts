import type Quill from 'quill';

export type FileUploadHandler = (file: File) => Promise<string>;

const ACCEPTED_FILE_TYPES = 'image/*,application/pdf';

// Quill's toolbar module defaults to embedding images as base64. This replaces the
// image button's handler with one that hands the file to the consumer's own
// upload logic and inserts whatever URL it resolves to instead - as an image
// embed for image files, or a link (since a PDF can't render as an <img>) for
// everything else.
//
// getQuill is called lazily on click, after the Quill instance has been assigned
// (the handler itself is registered before that assignment completes).
export function createUploadHandler(
  getQuill: () => Quill,
  getOnFileUpload: () => FileUploadHandler | undefined,
) {
  return function uploadHandler() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', ACCEPTED_FILE_TYPES);
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const onFileUpload = getOnFileUpload();
      if (!onFileUpload) {
        console.error(
          'react-quill-blog-editor: the image/file toolbar button was used but no ' +
            'onFileUpload prop was provided. Pass onFileUpload={(file) => Promise<string>} ' +
            'to enable uploads.',
        );
        window.alert('This editor is missing an onFileUpload handler - uploads are disabled.');
        return;
      }

      const quill = getQuill();
      const range = quill.getSelection(true);
      try {
        const url = await onFileUpload(file);
        if (file.type.startsWith('image/')) {
          quill.insertEmbed(range.index, 'image', url, 'user');
          quill.setSelection(range.index + 1, 0, 'silent');
        } else {
          const label = `📄 ${file.name}`;
          quill.insertText(range.index, label, { link: url }, 'user');
          quill.insertText(range.index + label.length, ' ', {}, 'user');
          quill.setSelection(range.index + label.length + 1, 0, 'silent');
        }
      } catch (error) {
        console.error('File upload failed', error);
        window.alert('File upload failed. Please try again.');
      }
    };
  };
}
