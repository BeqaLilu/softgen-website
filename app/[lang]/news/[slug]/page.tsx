import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { LinkUnderline } from '@/components/ui/LinkUnderline';
import { Placeholder } from '@/components/visual/Placeholder';
import { NewsCard, formatDate } from '@/components/cards/NewsCard';
import { CONTENT, t } from '@/content/static';
import { routing, type Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { getArticles, getArticleDetail } from '@/lib/dbContent';
import { RenderBody } from '@/lib/renderBody';

export async function generateStaticParams() {
  const articles = await getArticles();
  return routing.locales.flatMap((lang) => articles.map((a) => ({ lang, slug: a.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const l = lang as Locale;
  const a = await getArticleDetail(slug);
  if (!a) return pageMetadata({ lang: l, path: `/news/${slug}` });
  return pageMetadata({ lang: l, path: `/news/${slug}`, title: a.title[l], description: a.excerpt?.[l] });
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  setRequestLocale(lang);
  const l = lang as Locale;

  const [article, all] = await Promise.all([getArticleDetail(slug), getArticles()]);
  if (!article) notFound();

  const cat = CONTENT.news.categories.find((c) => c.id === article.category);
  const more = all.filter((a) => a.slug !== slug).slice(0, 3);

  // Body resolution: prefer the requested locale; fall back to EN; finally
  // a single helpful note explaining the body is editable.
  const bodyForLang = article.body?.[l] ?? article.body?.en ?? null;
  const body = bodyForLang ?? [
    {
      type: 'p' as const,
      text:
        l === 'en'
          ? "This article's body is editable from the admin panel."
          : 'ამ სტატიის ტექსტი იცვლება ადმინ-პანელიდან.',
    },
  ];

  return (
    <div className="page-enter">
      <section style={{ paddingTop: 144, paddingBottom: 56 }}>
        <div className="container-x" style={{ maxWidth: 880 }}>
          <LinkUnderline href={`/${l}/news`} arrow="left" style={{ marginBottom: 32 }}>
            {t(l, 'cta.backToNews')}
          </LinkUnderline>
          <div
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'center',
              color: 'var(--text-tertiary)',
              fontSize: 13,
              fontFamily: 'var(--font-mono)',
              marginBottom: 24,
              marginTop: 16,
            }}
          >
            {cat && <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{cat.label[l]}</span>}
            <span>·</span>
            <span>{formatDate(article.date, l)}</span>
            <span>·</span>
            <span>
              {article.readTime} {l === 'en' ? 'min read' : 'წუთი'}
            </span>
          </div>
          <h1
            className="h-display"
            style={{
              fontSize: 'clamp(36px, 4.4vw, 56px)',
              marginBottom: 28,
              textWrap: 'balance' as const,
            }}
          >
            {article.title[l]}
          </h1>
          <div
            style={{
              display: 'flex',
              gap: 16,
              alignItems: 'center',
              paddingBottom: 32,
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 999,
                background: 'linear-gradient(135deg, var(--primary), var(--purple-400))',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              {article.author.split(' ').map((s) => s[0]).slice(0, 2).join('')}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15 }}>
                {article.author}
              </div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>
                {l === 'en' ? 'Engineering' : 'ინჟინერია'} · Softgen
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 64 }}>
        <div className="container-x" style={{ maxWidth: 880 }}>
          <Placeholder accent={article.accent} aspect="16/8" />
        </div>
      </section>

      <article style={{ paddingBottom: 96 }}>
        <div className="container-x" style={{ maxWidth: 720 }}>
          {article.excerpt?.[l] && (
            <p
              style={{
                fontSize: 19,
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                marginBottom: 32,
                marginTop: 0,
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                letterSpacing: '-0.005em',
              }}
            >
              {article.excerpt[l]}
            </p>
          )}
          <RenderBody body={body} />
        </div>
      </article>

      {more.length > 0 && (
        <section
          className="section-tight"
          style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-soft)' }}
        >
          <div className="container-x">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
              <h3 className="h3" style={{ fontSize: 24 }}>
                {l === 'en' ? 'Continue reading' : 'გააგრძელე კითხვა'}
              </h3>
              <LinkUnderline href={`/${l}/news`}>{t(l, 'cta.viewAll')}</LinkUnderline>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {more.map((a) => (
                <NewsCard key={a.slug} a={a} lang={l} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
