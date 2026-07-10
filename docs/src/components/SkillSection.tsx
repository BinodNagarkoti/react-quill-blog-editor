import skillMarkdown from '../../../.claude/skills/react-quill-blog-editor/SKILL.md?raw';
import { CodeBlock } from './CodeBlock.tsx';

const NPX_SNIPPET = 'npx react-quill-blog-editor';

export function SkillSection() {
  return (
    <section className="docs-section" id="skill">
      <p className="docs-eyebrow">Reference</p>
      <h2>For AI coding agents</h2>
      <p className="docs-note">
        This package ships an <a href="https://claude.com/claude-code" target="_blank" rel="noreferrer">
          agent skill
        </a> - a self-contained reference an AI coding agent (Claude Code or otherwise) can read to
        correctly install and wire this component up, without needing to guess at props or read the
        package&rsquo;s source. Get it into your project either way:
      </p>

      <CodeBlock code={NPX_SNIPPET} language="bash" />
      <p className="docs-note">
        Writes <code>.claude/skills/react-quill-blog-editor/SKILL.md</code> into the current
        directory. Safe to run more than once - it won&rsquo;t overwrite an existing copy unless
        you pass <code>--force</code>.
      </p>

      <details className="skill-details">
        <summary>Or copy the skill file directly</summary>
        <CodeBlock code={skillMarkdown} language="md" scroll />
      </details>
    </section>
  );
}
