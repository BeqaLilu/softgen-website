import Link from 'next/link';

/** Root not-found — used for unmatched paths outside [lang]. */
export default function NotFound() {
  return (
    <html lang="en" data-theme="dark">
      <body
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)',
        }}
      >
        <div style={{ textAlign: 'center', padding: 32 }}>
          <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: 24 }}>
            404
          </div>
          <h1 className="h1" style={{ marginBottom: 16 }}>
            Page not found
          </h1>
          <Link className="btn btn-primary" href="/en">
            Back home
          </Link>
        </div>
      </body>
    </html>
  );
}
