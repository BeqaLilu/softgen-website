import Link from 'next/link';

/** Locale-aware not-found inside the /[lang]/ route group. */
export default function NotFound() {
  return (
    <section style={{ paddingTop: 200, paddingBottom: 200, textAlign: 'center' }}>
      <div className="container-x">
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
    </section>
  );
}
