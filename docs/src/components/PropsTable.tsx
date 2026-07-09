interface PropRow {
  name: string;
  type: string;
  default: string;
  description: string;
}

const ROWS: PropRow[] = [
  { name: 'readOnly', type: 'boolean', default: 'false', description: 'Disables editing and hides the toolbar.' },
  { name: 'defaultValue', type: 'Delta', default: 'undefined', description: 'Initial content - set once on mount (uncontrolled).' },
  { name: 'placeholder', type: 'string', default: 'undefined', description: 'Placeholder text shown when empty.' },
  { name: 'onFileUpload', type: '(file: File) => Promise<string>', default: 'undefined', description: 'Called with the picked file; must resolve to a public HTTPS URL. Images embed, other files (e.g. PDF) insert as a link.' },
  { name: 'enableTable', type: 'boolean', default: 'true', description: "Adds a table toolbar button (Quill's built-in table module)." },
  { name: 'enableFormula', type: 'boolean', default: 'false', description: 'Adds a formula toolbar button. Requires window.katex to be set.' },
  { name: 'fonts', type: 'FontOption[]', default: '14 curated fonts', description: "Overrides the font picker's options." },
  { name: 'toolbar', type: 'ToolbarConfig', default: 'undefined', description: 'Fully replaces the default toolbar layout.' },
  { name: 'modules', type: 'Record<string, unknown>', default: 'undefined', description: 'Extra Quill modules merged in alongside toolbar/table.' },
  { name: 'onTextChange', type: '(delta, oldContents, source) => void', default: 'undefined', description: 'Fires on every content change.' },
  { name: 'onSelectionChange', type: '(range, oldRange, source) => void', default: 'undefined', description: 'Fires on selection/cursor changes.' },
];

export function PropsTable() {
  return (
    <div className="props-table-wrap">
      <table className="props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.name}>
              <td><code>{row.name}</code></td>
              <td><code>{row.type}</code></td>
              <td><code>{row.default}</code></td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
