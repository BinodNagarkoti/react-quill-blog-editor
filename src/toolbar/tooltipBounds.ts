const TOOLTIP_BOUNDS_MARGIN = 16;

// Quill clamps its link/formula/video tooltips inside a `bounds` element so they
// never render off-screen (see quill/ui/tooltip.js) - but it clamps flush to that
// element's edges with zero margin, and defaults to document.body if no `bounds`
// option is given at all. With no `bounds` set, a selection near the left edge of
// the editor can produce a tooltip clamped against the *page's* edge instead of
// the editor's, landing it over unrelated page content.
//
// This creates an invisible marker inset from the editor container by a fixed
// margin on each side and returns it for use as Quill's `bounds` option, so the
// tooltip always keeps that much breathing room from the editor's own edges.
export function createTooltipBoundsElement(container: HTMLElement): HTMLElement {
  if (getComputedStyle(container).position === 'static') {
    container.style.position = 'relative';
  }

  const bounds = container.ownerDocument.createElement('div');
  bounds.setAttribute('aria-hidden', 'true');
  bounds.style.position = 'absolute';
  bounds.style.top = '0';
  bounds.style.bottom = '0';
  bounds.style.left = `${TOOLTIP_BOUNDS_MARGIN}px`;
  bounds.style.right = `${TOOLTIP_BOUNDS_MARGIN}px`;
  bounds.style.pointerEvents = 'none';
  bounds.style.visibility = 'hidden';
  container.appendChild(bounds);
  return bounds;
}
