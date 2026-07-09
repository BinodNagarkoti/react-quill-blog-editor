import type { ToolbarConfig } from 'quill/modules/toolbar.js';
import { fontToolbarValues, type FontOption } from '../formats/fonts.ts';
import { LINE_HEIGHT_TOOLBAR_VALUES } from '../formats/lineHeight.ts';

export interface ToolbarFeatureFlags {
  fonts: FontOption[];
  enableTable: boolean;
  enableFormula: boolean;
}

export function buildToolbarConfig({
  fonts,
  enableTable,
  enableFormula,
}: ToolbarFeatureFlags): ToolbarConfig {
  const embeds = ['link', 'image'];
  if (enableTable) embeds.push('table');
  if (enableFormula) embeds.push('formula');

  return [
    [{ font: fontToolbarValues(fonts) }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ size: ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ script: 'sub' }, { script: 'super' }],
    [{ color: [] }, { background: [] }],
    [{ lineheight: LINE_HEIGHT_TOOLBAR_VALUES }],
    [{ align: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    ['blockquote', 'code-block'],
    embeds,
    ['clean'],
  ];
}
