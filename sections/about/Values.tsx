'use client';

import { useReveal } from '@/components/hooks/useReveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CONTENT, t } from '@/content/static';
import type { Locale } from '@/i18n/routing';

export function Values({ lang, pageContent }: { lang: Locale; pageContent?: unknown }) {
  const ref = useReveal<HTMLElement>();
  const overrideValues =
    pageContent && typeof pageContent === 'object' && 'about' in pageContent
      ? (pageContent as { about?: { values?: typeof CONTENT.about.values } }).about?.values
      : null;
  const values = overrideValues ?? CONTENT.about.values;
  return (
    <section ref={ref} className="reveal section">
      <div className="container-x">
        <SectionHeader
          eyebrow={t(lang, 'about.valuesEyebrow', pageContent)}
          title={t(lang, 'about.valuesTitle', pageContent)}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {values.map((v, i) => (
            <div
              key={i}
              className="card"
              style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--primary)',
                  letterSpacing: '0.08em',
                }}
              >
                {v.num}
              </div>
              <h3 className="h3" style={{ fontSize: 22 }}>{v.title[lang]}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.55 }}>{v.body[lang]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
