import { setRequestLocale } from 'next-intl/server';
import { ContactForm } from '@/sections/contact/ContactForm';
import { CONTENT, t } from '@/content/static';
import { routing, type Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { mergedPageCopy } from '@/lib/pageCopy';

export function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

async function nestedCopy() {
  const c = await mergedPageCopy('contact');
  return c ? { contact: c } : undefined;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Locale;
  const copy = await nestedCopy();
  return pageMetadata({
    lang: l,
    path: '/contact',
    title: t(l, 'contact.headline', copy),
    description: t(l, 'contact.intro', copy),
  });
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  const l = lang as Locale;
  const copy = await nestedCopy();

  // Offices: pages.contact may override the office list; fall back to static.
  const offices =
    (copy && copy.contact && typeof copy.contact === 'object' && 'offices' in copy.contact
      ? ((copy.contact as { offices?: typeof CONTENT.contact.offices }).offices)
      : null) ?? CONTENT.contact.offices;

  return (
    <div className="page-enter">
      <section style={{ paddingTop: 168, paddingBottom: 64 }}>
        <div
          className="container-x"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}
        >
          <div>
            <div className="eyebrow" style={{ marginBottom: 24 }}>
              {t(l, 'contact.eyebrow', copy)}
            </div>
            <h1 className="h-display" style={{ marginBottom: 28, fontSize: 'clamp(40px, 5vw, 64px)' }}>
              {t(l, 'contact.headline', copy)}
            </h1>
            <p className="lead" style={{ marginBottom: 40 }}>
              {t(l, 'contact.intro', copy)}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {offices.map((o, i) => (
                <div
                  key={i}
                  style={{
                    padding: '24px 0',
                    borderTop: '1px solid var(--border)',
                    borderBottom: i === offices.length - 1 ? '1px solid var(--border)' : 'none',
                    display: 'grid',
                    gridTemplateColumns: '140px 1fr auto',
                    gap: 24,
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18 }}>
                      {o.city[l]}
                    </div>
                    <div
                      style={{
                        color: 'var(--text-tertiary)',
                        fontSize: 12,
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {o.role[l]}
                    </div>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.5 }}>
                    {o.address[l]}
                  </div>
                  <a
                    href={`tel:${o.phone}`}
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontSize: 14 }}
                  >
                    {o.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 40 }}>
            <ContactForm lang={l} />
          </div>
        </div>
      </section>
    </div>
  );
}
