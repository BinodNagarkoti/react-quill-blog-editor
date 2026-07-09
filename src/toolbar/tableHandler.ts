import type Quill from 'quill';

interface TableModule {
  insertTable(rows: number, columns: number): void;
}

function promptForDimension(label: string, fallback: number): number | null {
  const raw = window.prompt(label, String(fallback));
  if (raw === null) return null;
  const value = Math.trunc(Number(raw));
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

// Quill's built-in table module has no toolbar button of its own, so this wires one
// up: prompt for rows/columns, then insert via the table module's own API.
export function createTableHandler(getQuill: () => Quill) {
  return function tableHandler() {
    const rows = promptForDimension('Number of rows:', 2);
    if (rows === null) return;
    const columns = promptForDimension('Number of columns:', 2);
    if (columns === null) return;

    const quill = getQuill();
    const table = quill.getModule('table') as TableModule | undefined;
    if (!table) {
      console.error(
        'react-quill-blog-editor: the table module is not enabled on this editor instance.',
      );
      return;
    }
    table.insertTable(rows, columns);
  };
}
