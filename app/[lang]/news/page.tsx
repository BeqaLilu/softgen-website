import { setRequestLocale } from 'next-intl/server';
import { NewsList } from '@/sections/news/NewsList';
import { t } from '@/content/static';
import { routing, type Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { getArticles } from '@/lib/dbContent';
import { mergedPageCopy } from '@/lib/pageCopy';

export function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

async function nestedCopy() {
  const c = await mergedPageCopy('news');
  return c ? { news: c } : undefined;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Locale;
  const copy = await nestedCopy();
  return pageMetadata({
    lang: l,
    path: '/news',
    title: t(l, 'news.headline', copy),
    description: t(l, 'news.intro', copy),
  });
}

export default async function NewsIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  const l = lang as Locale;
  const [articles, copy] = await Promise.all([getArticles(), nestedCopy()]);

  return (
    <div className="page-enter">
      <section style={{ paddingTop: 168, paddingBottom: 64 }}>
        <div className="container-x">
          <div className="eyebrow" style={{ marginBottom: 24 }}>
            {t(l, 'news.eyebrow', copy)}
          </div>
          <h1
            className="h-display"
            style={{ maxWidth: 1100, marginBottom: 28, fontSize: 'clamp(44px, 5.5vw, 76px)' }}
          >
            {t(l, 'news.headline', copy)}
          </h1>
          <p className="lead" style={{ maxWidth: 680, marginBottom: 56 }}>
            {t(l, 'news.intro', copy)}
          </p>
        </div>
      </section>

      <NewsList lang={l} articles={articles} />
    </div>
  );
}
