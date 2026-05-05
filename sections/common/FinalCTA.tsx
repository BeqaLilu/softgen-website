'use client';

import Link from 'next/link';
import { useReveal } from '@/components/hooks/useReveal';
import { t } from '@/content/static';
import type { Locale } from '@/i18n/routing';

export function FinalCTA({ lang, pageContent }: { lang: Locale; pageContent?: unknown }) {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="reveal section">
      <div className="container-x">
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '88px 64px',
            borderRadius: 'var(--radius-2xl)',
            background:
              'linear-gradient(135deg, var(--purple-700) 0%, var(--purple-500) 60%, #6B4FE8 100%)',
            color: 'white',
          }}
        >
          {/* Decoration: ringed circles, top-right */}
          <svg
            width="540"
            height="540"
            viewBox="0 0 540 540"
            style={{ position: 'absolute', right: -120, top: -120, opacity: 0.3 }}
            aria-hidden
          >
            <g fill="none" stroke="white" strokeWidth="1">
              {Array.from({ length: 14 }).map((_, i) => (
                <circle key={i} cx="270" cy="270" r={40 + i * 18} strokeOpacity={0.2 + i * 0.04} />
              ))}
            </g>
          </svg>

          <div style={{ position: 'relative', maxWidth: 720 }}>
            <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 24 }}>
              hello@softgen.ge · +995 32 240 0080
            </div>
            <h2 className="h2" style={{ color: 'white', marginBottom: 20 }}>
              {t(lang, 'cta_band.title', pageContent)}
            </h2>
            <p
              style={{
                fontSize: 18,
                lineHeight: 1.55,
                color: 'rgba(255,255,255,0.85)',
                marginBottom: 32,
                maxWidth: 540,
              }}
            >
              {t(lang, 'cta_band.subtext', pageContent)}
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link
                className="btn btn-lg"
                href={`/${lang}/contact`}
                style={{ background: 'white', color: 'var(--primary)' }}
              >
                {t(lang, 'cta.talk')}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8h10m0 0L9 4m4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                className="btn btn-lg btn-ghost"
                href={`/${lang}/about`}
                style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
              >
                {lang === 'en' ? 'About Softgen' : 'ჩვენ შესახებ'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
