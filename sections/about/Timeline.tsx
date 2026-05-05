'use client';

import { useReveal } from '@/components/hooks/useReveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CONTENT } from '@/content/static';
import type { Locale } from '@/i18n/routing';

export function Timeline({ lang, pageContent }: { lang: Locale; pageContent?: unknown }) {
  const ref = useReveal<HTMLElement>();
  // pages.about.timeline if present, else fall back to the static seed.
  const overrideItems =
    pageContent && typeof pageContent === 'object' && 'about' in pageContent
      ? (pageContent as { about?: { timeline?: typeof CONTENT.about.timeline } }).about?.timeline
      : null;
  const items = overrideItems ?? CONTENT.about.timeline;
  return (
    <section ref={ref} className="reveal section" style={{ background: 'var(--bg-soft)' }}>
      <div className="container-x">
        <SectionHeader
          eyebrow={lang === 'en' ? 'Eighteen years, briefly' : 'თვრამეტი წელი, მოკლედ'}
          title={lang === 'en' ? 'How we got here.' : 'როგორ მივედით აქამდე.'}
        />
        <div style={{ position: 'relative' }}>
          {/* Vertical spine — sits behind year markers */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: 96,
              top: 0,
              bottom: 0,
              width: 1,
              background: 'var(--border)',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
            {items.map((it, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr 1fr',
                  gap: 40,
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 14,
                    color: 'var(--primary)',
                    letterSpacing: '0.04em',
                    paddingTop: 4,
                    position: 'relative',
                  }}
                >
                  {it.year}
                  <span
                    aria-hidden
                    style={{
                      position: 'absolute',
                      right: -28,
                      top: 9,
                      width: 12,
                      height: 12,
                      borderRadius: 999,
                      background: 'var(--primary)',
                      boxShadow: '0 0 0 4px var(--bg-soft), 0 0 0 5px var(--primary)',
                    }}
                  />
                </div>
                <h3 className="h3" style={{ fontSize: 24 }}>{it.title[lang]}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 15.5, lineHeight: 1.6, maxWidth: 480 }}>
                  {it.body[lang]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
