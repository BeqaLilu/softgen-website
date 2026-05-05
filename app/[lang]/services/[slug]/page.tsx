import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { LinkUnderline } from '@/components/ui/LinkUnderline';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Chip } from '@/components/ui/Chip';
import { Placeholder } from '@/components/visual/Placeholder';
import { FinalCTA } from '@/sections/common/FinalCTA';
import { t } from '@/content/static';
import { routing, type Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { getServices, getServiceDetail, getProjects } from '@/lib/dbContent';

export async function generateStaticParams() {
  const services = await getServices();
  return routing.locales.flatMap((lang) => services.map((s) => ({ lang, slug: s.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const l = lang as Locale;
  const detail = await getServiceDetail(slug);
  if (!detail) return pageMetadata({ lang: l, path: `/services/${slug}` });
  return pageMetadata({ lang: l, path: `/services/${slug}`, title: detail.title[l], description: detail.tagline[l] });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  setRequestLocale(lang);
  const l = lang as Locale;

  const [detail, allServices, allProjects] = await Promise.all([
    getServiceDetail(slug),
    getServices(),
    getProjects(),
  ]);
  if (!detail) notFound();

  const num = allServices.findIndex((s) => s.slug === slug);
  const numStr = String(num + 1).padStart(2, '0');
  const related = (detail.related ?? [])
    .map((s) => allProjects.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="page-enter">
      <section style={{ paddingTop: 144, paddingBottom: 64 }}>
        <div className="container-x">
          <LinkUnderline href={`/${l}/services`} arrow="left" style={{ marginBottom: 32 }}>
            {l === 'en' ? 'All services' : 'ყველა სერვისი'}
          </LinkUnderline>
          <div className="eyebrow" style={{ marginTop: 16, marginBottom: 24 }}>
            {numStr} · {t(l, 'servicesPage.eyebrow')}
          </div>
          <h1
            className="h-display"
            style={{ maxWidth: 980, marginBottom: 24, fontSize: 'clamp(40px, 5vw, 64px)' }}
          >
            {detail.title[l]}
          </h1>
          <p className="lead" style={{ maxWidth: 720 }}>
            {detail.tagline[l]}
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container-x" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 24 }}>
              {l === 'en' ? 'Capabilities' : 'შესაძლებლობები'}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {detail.capabilities.map((c, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 14,
                    padding: '16px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--primary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      paddingTop: 4,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: 16, lineHeight: 1.5 }}>{c[l]}</span>
                </li>
              ))}
            </ul>
          </div>
          <Placeholder accent="indigo" aspect="4/5" label={detail.title.en} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-tight" style={{ background: 'var(--bg-soft)' }}>
          <div className="container-x">
            <SectionHeader
              eyebrow={l === 'en' ? 'Related work' : 'შესაბამისი პროექტები'}
              title={l === 'en' ? 'Where this practice has shipped.' : 'სად მუშაობს ეს მიმართულება.'}
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.min(related.length, 3)}, 1fr)`,
                gap: 24,
              }}
            >
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/${l}/projects/${p.slug}`}
                  className="card"
                  style={{ padding: 16, display: 'flex', flexDirection: 'column' }}
                >
                  <Placeholder accent={p.accent} aspect="16/10" />
                  <div style={{ padding: '20px 8px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <Chip>{p.category[l]}</Chip>
                    <h3 className="h3" style={{ fontSize: 22 }}>{p.title[l]}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <FinalCTA lang={l} />
    </div>
  );
}
