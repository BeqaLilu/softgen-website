import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { FinalCTA } from '@/sections/common/FinalCTA';
import { t } from '@/content/static';
import { routing, type Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { getServices } from '@/lib/dbContent';
import { mergedPageCopy } from '@/lib/pageCopy';

export function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

// pages.services holds { eyebrow, headline, intro }; nest under
// `servicesPage.` so the existing `t(lang, "servicesPage.headline")` keys hit.
async function nestedCopy() {
  const c = await mergedPageCopy('services');
  return c ? { servicesPage: c } : undefined;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Locale;
  const copy = await nestedCopy();
  return pageMetadata({
    lang: l,
    path: '/services',
    title: t(l, 'servicesPage.headline', copy),
    description: t(l, 'servicesPage.intro', copy),
  });
}

export default async function ServicesIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  const l = lang as Locale;
  const [items, copy] = await Promise.all([getServices(), nestedCopy()]);

  return (
    <div className="page-enter">
      <section style={{ paddingTop: 168, paddingBottom: 64, position: 'relative', overflow: 'hidden' }}>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(60% 60% at 80% 0%, var(--primary-soft), transparent 70%)',
          }}
        />
        <div className="container-x" style={{ position: 'relative' }}>
          <div className="eyebrow" style={{ marginBottom: 24 }}>
            {t(l, 'servicesPage.eyebrow', copy)}
          </div>
          <h1
            className="h-display"
            style={{ maxWidth: 1100, marginBottom: 28, fontSize: 'clamp(44px, 5.5vw, 76px)' }}
          >
            {t(l, 'servicesPage.headline', copy)}
          </h1>
          <p className="lead" style={{ maxWidth: 720 }}>
            {t(l, 'servicesPage.intro', copy)}
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container-x" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {items.map((it) => (
            <Link
              key={it.slug}
              href={`/${l}/services/${it.slug}`}
              className="card"
              style={{
                padding: 40,
                display: 'grid',
                gridTemplateColumns: '120px 1fr 1fr auto',
                alignItems: 'center',
                gap: 32,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  color: 'var(--primary)',
                  letterSpacing: '0.08em',
                }}
              >
                {it.num}
              </div>
              <h3 className="h3" style={{ fontSize: 26 }}>{it.title[l]}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.55 }}>
                {it.tagline[l]}
              </p>
              <span style={{ color: 'var(--primary)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <FinalCTA lang={l} />
    </div>
  );
}
