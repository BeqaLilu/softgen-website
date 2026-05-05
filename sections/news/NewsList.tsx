'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Placeholder } from '@/components/visual/Placeholder';
import { NewsCard, formatDate } from '@/components/cards/NewsCard';
import { CONTENT, type Article } from '@/content/static';
import type { Locale } from '@/i18n/routing';

export function NewsList({ lang, articles: all }: { lang: Locale; articles: Article[] }) {
  const [filter, setFilter] = useState<string>('all');

  const articles = filter === 'all' ? all : all.filter((a) => a.category === filter);
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => a !== featured);
  const featuredCat = featured ? CONTENT.news.categories.find((c) => c.id === featured.category) : undefined;

  return (
    <>
      <div className="container-x">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: '1px solid var(--border)' }}>
          {CONTENT.news.categories.map((c) => {
            const active = c.id === filter;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                style={{
                  padding: '12px 18px',
                  border: 'none',
                  background: 'transparent',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 14,
                  color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
                  marginBottom: -1,
                  transition: 'all 150ms',
                  cursor: 'pointer',
                }}
              >
                {c.label[lang]}
              </button>
            );
          })}
        </div>
      </div>

      <section className="section-tight" style={{ paddingTop: 32 }}>
        <div className="container-x" style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
          {featured && (
            <Link
              href={`/${lang}/news/${featured.slug}`}
              className="card"
              style={{
                display: 'grid',
                gridTemplateColumns: '1.1fr 1fr',
                gap: 0,
                padding: 0,
                overflow: 'hidden',
              }}
            >
              <Placeholder accent={featured.accent} aspect="4/3" />
              <div
                style={{
                  padding: 48,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18,
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                    color: 'var(--text-tertiary)',
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {featuredCat && (
                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                      {featuredCat.label[lang]}
                    </span>
                  )}
                  <span>·</span>
                  <span>{formatDate(featured.date, lang)}</span>
                  <span>·</span>
                  <span>
                    {featured.readTime} {lang === 'en' ? 'min' : 'წთ'}
                  </span>
                </div>
                <h2 className="h2" style={{ fontSize: 'clamp(28px, 3vw, 38px)' }}>{featured.title[lang]}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.55 }}>
                  {featured.excerpt[lang]}
                </p>
                <div style={{ marginTop: 8, color: 'var(--text-tertiary)', fontSize: 13 }}>
                  {lang === 'en' ? 'By ' : 'ავტორი: '}
                  {featured.author}
                </div>
              </div>
            </Link>
          )}

          {rest.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {rest.map((a) => (
                <NewsCard key={a.slug} a={a} lang={lang} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
