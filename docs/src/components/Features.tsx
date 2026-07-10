interface Feature {
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    title: 'Full blog toolbar',
    description:
      'Fonts, headings, sizes, colors, alignment, and line spacing - preconfigured so you skip the toolbar-building step entirely.',
  },
  {
    title: 'Tables & formulas',
    description:
      "Insert tables via Quill's built-in table module, plus optional math formulas rendered through KaTeX.",
  },
  {
    title: 'Uploads without base64',
    description:
      'The image/PDF picker hands you the raw File and waits for a public URL back - upload it to S3, your own API, wherever.',
  },
  {
    title: 'Uncontrolled by design',
    description:
      'Quill owns its own DOM and internal state. React reads and writes through a ref and a few event callbacks - no fighting a controlled value prop.',
  },
  {
    title: 'Read-only viewer included',
    description:
      "QuillBlogViewer renders saved content with zero document/window access - safe to use in React Server Components, no 'use client' required.",
  },
  {
    title: 'Ships an AI agent skill',
    description:
      'A self-contained reference an agent like Claude Code can read to wire this up correctly on the first try - no guessing at props.',
  },
];

export function Features() {
  return (
    <section className="features" aria-label="Features">
      <div className="features-grid">
        {FEATURES.map((feature) => (
          <div className="feature-card" key={feature.title}>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
