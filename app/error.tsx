'use client';

import Link from 'next/link';
import { useEffect } from 'react';

/**
 * Application-level error boundary. Catches uncaught errors thrown
 * during render in any nested route (excluding the root layout itself).
 * Styled to match the design system + layout shell.
 *
 * Per build-prompt §"Phase 6 Polish" — 500 page matches the design system.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface in the dev console +, in prod, send to Sentry / Logtail / etc.
    // eslint-disable-next-line no-console
    console.error('[error.tsx]', error);
  }, [error]);

  return (
    <section
      style={{
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 32px',
        textAlign: 'center',
      }}
    >
      <div className="container-x" style={{ maxWidth: 640 }}>
        <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: 24 }}>
          500 · Something went wrong
        </div>
        <h1 className="h1" style={{ marginBottom: 16 }}>
          We hit a snag rendering this page.
        </h1>
        <p className="lead" style={{ margin: '0 auto 32px' }}>
          The team has been notified. Try again in a moment, or head back home and pick a different
          path.
        </p>

        {error.digest && (
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--text-tertiary)',
              marginBottom: 32,
              wordBreak: 'break-all',
            }}
          >
            ref: {error.digest}
          </p>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => reset()} className="btn btn-primary">
            Try again
          </button>
          <Link href="/en" className="btn btn-ghost">
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}
