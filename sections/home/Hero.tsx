import { Fragment } from 'react';
import { HeroBackdrop } from '@/components/visual/HeroBackdrop';
import { LinkButton } from '@/components/ui/Button';
import { t, tArr } from '@/content/static';
import type { Locale } from '@/i18n/routing';

export function Hero({ lang, pageContent }: { lang: Locale; pageContent?: unknown }) {
  const headline = tArr(lang, 'hero.headline', pageContent);
  const healthLabels = tArr(lang, 'hero.health.rowLabels', pageContent);
  const healthValues = ['99.99%', '99.97%', '100.0%', '99.95%'];

  const rows: Array<[string, string]> = [
    [healthLabels[0] ?? 'Banking core', healthValues[0]],
    [healthLabels[1] ?? 'Gov portal', healthValues[1]],
    [healthLabels[2] ?? 'ID platform', healthValues[2]],
    [healthLabels[3] ?? 'Billing', healthValues[3]],
  ];
  const proofPoints = tArr(lang, 'hero.proofPoints', pageContent);

  return (
    <section style={{ position: 'relative', paddingTop: 120, paddingBottom: 96, overflow: 'hidden' }}>
      <HeroBackdrop systemLabels={healthLabels} />
      <div className="container-x" style={{ position: 'relative', zIndex: 1 }}>
        {/* Inner wrapper maxWidth = 860 leaves room for the 320px floating
            card on viewports ≥1100px (where the card is visible). On narrower
            viewports the card is hidden and the headline gets the full width. */}
        <div style={{ maxWidth: 860 }}>
          <div
            className="eyebrow"
            style={{
              marginBottom: 28,
              opacity: 0,
              animation: 'stagIn 600ms var(--ease-out) 100ms forwards',
            }}
          >
            {t(lang, 'hero.eyebrow', pageContent)} ·{' '}
            <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: 0 }}>SOFTGEN.GE</span>
          </div>

          <h1 className="h-display" style={{ marginBottom: 32 }}>
            {headline.map((line, i) => (
              <span
                key={i}
                style={{
                  display: 'block',
                  opacity: 0,
                  animation: `stagIn 800ms var(--ease-out) ${200 + i * 120}ms forwards`,
                  color: i === headline.length - 1 ? 'var(--primary)' : 'var(--text-primary)',
                }}
              >
                {line}
              </span>
            ))}
          </h1>

          <p
            className="lead"
            style={{
              maxWidth: 640,
              marginBottom: 40,
              opacity: 0,
              animation: 'stagIn 700ms var(--ease-out) 600ms forwards',
            }}
          >
            {t(lang, 'hero.subtext', pageContent)}
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              opacity: 0,
              animation: 'stagIn 700ms var(--ease-out) 750ms forwards',
            }}
          >
            <LinkButton href={`/${lang}/contact`} variant="primary" size="lg">
              {t(lang, 'cta.talk')}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8h10m0 0L9 4m4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </LinkButton>
            <LinkButton href={`/${lang}/projects`} variant="ghost" size="lg">
              {t(lang, 'cta.explore')}
            </LinkButton>
          </div>

          <div
            className="hero-proof-strip"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              marginTop: 28,
              opacity: 0,
              animation: 'stagIn 700ms var(--ease-out) 880ms forwards',
            }}
          >
            {proofPoints.map((point) => (
              <span
                key={point}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border)',
                  background: 'color-mix(in srgb, var(--surface) 82%, transparent)',
                  color: 'var(--text-secondary)',
                  fontFamily: lang === 'ka' ? 'var(--font-body)' : 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: lang === 'ka' ? 0 : undefined,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: 'var(--primary)',
                    boxShadow: '0 0 0 4px var(--primary-soft)',
                  }}
                />
                {point}
              </span>
            ))}
          </div>
        </div>

        {/* Floating system-health card (per prototype: ~360×220, top-right, shadow-lg halo).
            Hidden below 1100px viewports via the .hero-float-card class to avoid
            overlapping the headline at common laptop widths. */}
        <div
          className="hero-float-card glow-hover"
          style={{
            position: 'absolute',
            right: 32,
            top: 200,
            width: 320,
            padding: 20,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            opacity: 0,
            animation: 'stagIn 900ms var(--ease-out) 900ms forwards',
            transform: 'translateY(16px)',
            overflow: 'hidden',
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 85% 10%, rgba(79,62,219,0.18), transparent 34%), linear-gradient(135deg, transparent, rgba(79,62,219,0.06))',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: '#22c55e',
                boxShadow: '0 0 0 4px rgba(34,197,94,0.15)',
              }}
            />
            <span
              style={{
                fontFamily: lang === 'ka' ? 'var(--font-body)' : 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--text-tertiary)',
                letterSpacing: lang === 'ka' ? 0 : '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {t(lang, 'hero.health.eyebrow', pageContent)}
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
            {t(lang, 'hero.health.title', pageContent)}
          </div>
          <svg
            viewBox="0 0 280 92"
            aria-hidden
            style={{
              width: '100%',
              height: 92,
              marginBottom: 14,
              color: 'var(--primary)',
            }}
          >
            <defs>
              <linearGradient id="heroPulse" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.12" />
                <stop offset="55%" stopColor="currentColor" stopOpacity="0.6" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.18" />
              </linearGradient>
            </defs>
            <path d="M10 66 C46 38 74 72 106 42 S168 40 198 22 S242 40 270 18" fill="none" stroke="url(#heroPulse)" strokeWidth="2.4" />
            {[28, 96, 154, 218, 266].map((x, i) => (
              <g key={x}>
                <circle cx={x} cy={[52, 48, 36, 26, 20][i]} r="5" fill="var(--surface)" stroke="currentColor" strokeWidth="1.8" />
                <circle cx={x} cy={[52, 48, 36, 26, 20][i]} r="13" fill="currentColor" opacity="0.08" />
              </g>
            ))}
            <path d="M10 78H270" stroke="var(--border)" strokeDasharray="3 6" />
          </svg>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', rowGap: 8, fontSize: 13 }}>
            {rows.map(([k, v], i) => (
              <Fragment key={i}>
                <span style={{ color: 'var(--text-secondary)', fontFamily: lang === 'ka' ? 'var(--font-body)' : undefined }}>{k}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{v}</span>
              </Fragment>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              paddingTop: 14,
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 12,
              color: 'var(--text-tertiary)',
              fontFamily: lang === 'ka' ? 'var(--font-body)' : 'var(--font-mono)',
              letterSpacing: lang === 'ka' ? 0 : undefined,
            }}
          >
            <span>{t(lang, 'hero.health.footerLeft', pageContent)}</span>
            <span>{t(lang, 'hero.health.footerRight', pageContent)}</span>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
