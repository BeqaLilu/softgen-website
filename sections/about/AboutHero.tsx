import { t } from '@/content/static';
import type { Locale } from '@/i18n/routing';

export function AboutHero({ lang, pageContent }: { lang: Locale; pageContent?: unknown }) {
  return (
    <section style={{ position: 'relative', paddingTop: 168, paddingBottom: 80, overflow: 'hidden' }}>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(60% 60% at 80% 20%, var(--primary-soft), transparent 70%)',
        }}
      />
      <div className="container-x" style={{ position: 'relative' }}>
        <div className="eyebrow" style={{ marginBottom: 28 }}>
          {t(lang, 'about.eyebrow', pageContent)}
        </div>
        <h1
          className="h-display"
          style={{ maxWidth: 1100, marginBottom: 36, fontSize: 'clamp(44px, 5.5vw, 76px)' }}
        >
          {t(lang, 'about.headline', pageContent)}
        </h1>
        <p className="lead" style={{ maxWidth: 720 }}>
          {t(lang, 'about.intro', pageContent)}
        </p>
      </div>
    </section>
  );
}
