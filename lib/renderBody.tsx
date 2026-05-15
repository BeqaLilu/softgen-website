/**
 * Render long-form body content for projects + articles on the public side.
 *
 * Two body shapes coexist in the wild:
 *
 *  1. **Prototype shape** — `[{ type: 'p' | 'h2', text: string }]`. Used by
 *     the original `content/static.ts` seeds for backwards compatibility.
 *
 *  2. **TipTap / ProseMirror JSON** — `{ type: 'doc', content: [...] }`. What
 *     the admin editor (`TipTapEditor`) saves into the DB from now on.
 *
 * `RenderBody` accepts either; `isProseMirror()` is the discriminator.
 *
 * For ProseMirror docs we serialize with `@tiptap/html` using the same
 * extension set as the editor, so output mirrors what the admin previewed.
 * The output is trusted because it came from a logged-in admin and TipTap's
 * schema rejects unknown nodes.
 */

import { generateHTML } from '@tiptap/html';
import type { JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import type { ReactNode } from 'react';

const EXTENSIONS = [
  StarterKit,
  Image.configure({ inline: false }),
  Link.configure({ openOnClick: false, autolink: true }),
];

export type SimpleBlock = { type: 'p' | 'h2' | 'h3'; text: string };

export function isProseMirror(value: unknown): value is { type: 'doc'; content?: unknown[] } {
  return (
    !!value &&
    typeof value === 'object' &&
    (value as { type?: string }).type === 'doc' &&
    Array.isArray((value as { content?: unknown }).content)
  );
}

export function isSimpleBlocks(value: unknown): value is SimpleBlock[] {
  if (!Array.isArray(value)) return false;
  return value.every(
    (b) =>
      b &&
      typeof b === 'object' &&
      typeof (b as { type?: string }).type === 'string' &&
      typeof (b as { text?: string }).text === 'string'
  );
}

/**
 * Inline styles below mirror the prototype's body styling at the article-detail
 * page (font-size 17, line-height 1.75, h2 large with tight leading) so that
 * the swap from inline `[{type, text}]` rendering to TipTap output is visually
 * a no-op for already-shipped content.
 */
const PROSE_CSS = `
  .body-prose p { font-size: 17px; line-height: 1.75; color: var(--text-primary); margin: 0 0 24px; text-wrap: pretty; }
  .body-prose h2 { font-family: var(--font-display); font-weight: 600; font-size: clamp(22px, 2vw, 28px); line-height: 1.2; letter-spacing: -0.025em; margin: 48px 0 16px; color: var(--text-primary); }
  .body-prose h3 { font-family: var(--font-display); font-weight: 600; font-size: 20px; margin: 32px 0 12px; color: var(--text-primary); }
  .body-prose ul, .body-prose ol { font-size: 17px; line-height: 1.75; padding-left: 22px; margin: 0 0 24px; color: var(--text-primary); }
  .body-prose li { margin-bottom: 6px; }
  .body-prose blockquote { border-left: 3px solid var(--primary); padding-left: 16px; margin: 24px 0; color: var(--text-secondary); font-style: italic; }
  .body-prose a { color: var(--primary); text-decoration: underline; }
  .body-prose img { max-width: 100%; border-radius: var(--radius-md); margin: 24px 0; display: block; }
  .body-prose strong { font-weight: 700; }
  .body-prose em { font-style: italic; }
`;

export function RenderBody({
  body,
  className = 'body-prose',
}: {
  body: unknown;
  className?: string;
}): ReactNode {
  if (isProseMirror(body)) {
    let html = '';
    try {
      html = generateHTML(body as JSONContent, EXTENSIONS);
    } catch {
      // Bad JSON shouldn't crash a page render — show nothing rather than a 500.
      html = '';
    }
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: PROSE_CSS }} />
        <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
      </>
    );
  }

  if (isSimpleBlocks(body)) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: PROSE_CSS }} />
        <div className={className}>
          {body.map((b, i) =>
            b.type === 'h2' ? (
              <h2 key={i}>{b.text}</h2>
            ) : b.type === 'h3' ? (
              <h3 key={i}>{b.text}</h3>
            ) : (
              <p key={i}>{b.text}</p>
            )
          )}
        </div>
      </>
    );
  }

  return null;
}
