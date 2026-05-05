'use client';

import { useReveal } from '@/components/hooks/useReveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { LinkUnderline } from '@/components/ui/LinkUnderline';
import { NewsCard } from '@/components/cards/NewsCard';
import { t, type Article } from '@/content/static';
import type { Locale } from '@/i18n/routing';

export function NewsTeaser({
  lang,
  articles: all,
  pageContent,
}: {
  lang: Locale;
  articles: Article[];
  pageContent?: unknown;
}) {
  const ref = useReveal<HTMLElement>();
  const articles = all.slice(0, 3);

  return (
    <section ref={ref} className="reveal section">
      <div className="container-x">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56 }}>
          <SectionHeader
            eyebrow={t(lang, 'newsTeaser.eyebrow', pageContent)}
            title={t(lang, 'newsTeaser.title', pageContent)}
            marginBottom={0}
          />
          <LinkUnderline href={`/${lang}/news`}>{t(lang, 'cta.viewAll')}</LinkUnderline>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {articles.map((a) => (
            <NewsCard key={a.slug} a={a} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}
