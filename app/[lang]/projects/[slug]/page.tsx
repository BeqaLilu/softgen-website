import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { LinkUnderline } from '@/components/ui/LinkUnderline';
import { Chip } from '@/components/ui/Chip';
import { Placeholder } from '@/components/visual/Placeholder';
import { FinalCTA } from '@/sections/common/FinalCTA';
import { routing, type Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { getProjects, getProjectDetail } from '@/lib/dbContent';
import { RenderBody } from '@/lib/renderBody';

export async function generateStaticParams() {
  const projects = await getProjects();
  return routing.locales.flatMap((lang) => projects.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const l = lang as Locale;
  const detail = await getProjectDetail(slug);
  if (!detail) return pageMetadata({ lang: l, path: `/projects/${slug}` });
  return pageMetadata({
    lang: l,
    path: `/projects/${slug}`,
    title: typeof detail.title === 'object' ? detail.title[l] : String(detail.title),
    description: detail.summary?.[l] ?? undefined,
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  setRequestLocale(lang);
  const l = lang as Locale;

  const p = await getProjectDetail(slug);
  if (!p) notFound();

  // Body lookup: prefer the locale's body; fall back to EN if KA is empty.
  const bodyForLang = p.body?.[l] ?? p.body?.en ?? null;
  const hasBody = bodyForLang && (Array.isArray(bodyForLang) ? bodyForLang.length > 0 : true);

  return (
    <div className="page-enter">
      <section style={{ paddingTop: 144, paddingBottom: 56 }}>
        <div className="container-x">
          <LinkUnderline href={`/${l}/projects`} arrow="left" style={{ marginBottom: 32 }}>
            {l === 'en' ? 'All projects' : 'ყველა პროექტი'}
          </LinkUnderline>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 16, marginBottom: 24 }}>
            <Chip>{p.category[l]}</Chip>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-tertiary)' }}>
              {p.year}
            </span>
          </div>
          <h1
            className="h-display"
            style={{ maxWidth: 1100, marginBottom: 24, fontSize: 'clamp(40px, 5vw, 64px)' }}
          >
            {p.title[l]}
          </h1>
          {p.summary?.[l] && (
            <p className="lead" style={{ maxWidth: 720 }}>
              {p.summary[l]}
            </p>
          )}
        </div>
      </section>

      <section style={{ paddingBottom: 56 }}>
        <div className="container-x">
          <Placeholder accent={p.accent} coverStyle={p.coverStyle ?? 'dashboard'} imageUrl={p.coverUrl} aspect="16/8" />
        </div>
      </section>

      {(p.client || p.duration || p.team) && (
        <section className="section-tight">
          <div className="container-x">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 24,
                padding: '32px 0',
                borderTop: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {(
                [
                  [l === 'en' ? 'Client' : 'კლიენტი', p.client ?? '—'],
                  [l === 'en' ? 'Year' : 'წელი', p.year],
                  [l === 'en' ? 'Duration' : 'ხანგრძლივობა', p.duration?.[l] ?? '—'],
                  [l === 'en' ? 'Team' : 'გუნდი', p.team ?? '—'],
                ] as Array<[string, string]>
              ).map(([k, v], i) => (
                <div key={i}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--text-tertiary)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: 8,
                    }}
                  >
                    {k}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {hasBody && (
        <article className="section-tight">
          <div className="container-x" style={{ maxWidth: 760 }}>
            <RenderBody body={bodyForLang} />
          </div>
        </article>
      )}

      {p.tags && p.tags.length > 0 && (
        <section style={{ paddingBottom: 96 }}>
          <div className="container-x" style={{ maxWidth: 760 }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--text-tertiary)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              {l === 'en' ? 'Stack' : 'ტექნოლოგიები'}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {p.tags.map((tag) => (
                <Chip key={tag} variant="outline">
                  {tag}
                </Chip>
              ))}
            </div>
          </div>
        </section>
      )}

      <FinalCTA lang={l} />
    </div>
  );
}
