'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useReveal } from '@/components/hooks/useReveal';
import { useCountUp } from '@/components/hooks/useCountUp';
import { CONTENT, type TrustMetric, type TrustMetricIcon } from '@/content/static';
import type { Locale } from '@/i18n/routing';

const ICONS: Record<TrustMetricIcon, ReactNode> = {
  building: (
    <>
      <path d="M6 18V7.5L18 4v14" />
      <path d="M10 18v-4h4v4M9 9h1M14 8h1M9 12h1M14 11h1" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 8v4l3 2" />
    </>
  ),
  ship: (
    <>
      <path d="M5 15.5c2 1.2 4 1.2 6 0s4-1.2 6 0" />
      <path d="M7 14 5.5 9.5h13L17 14M9 9.5V6h6v3.5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 4 18 6.5v5.2c0 3.4-2.4 6.2-6 7.3-3.6-1.1-6-3.9-6-7.3V6.5L12 4Z" />
      <path d="m9.5 12 1.8 1.8 3.5-4" />
    </>
  ),
  server: (
    <>
      <rect x="5" y="6" width="14" height="5" rx="2" />
      <rect x="5" y="13" width="14" height="5" rx="2" />
      <path d="M8 8.5h.01M8 15.5h.01M11 8.5h5M11 15.5h5" />
    </>
  ),
  users: (
    <>
      <path d="M9.5 11.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4.5 18c.8-3 2.5-4.5 5-4.5s4.2 1.5 5 4.5" />
      <path d="M15 11a2.4 2.4 0 1 0 0-4.8M16 13.6c1.8.5 3 1.9 3.5 4.4" />
    </>
  ),
};

function formatStat(orig: string, n: number): string {
  // 24/7 — don't animate slashes.
  if (orig.includes('/')) return orig;
  const intPart = Math.round(n);
  return orig.replace(/\d+/, String(intPart));
}

function StatCell({
  s,
  lang,
  trigger,
  divider,
}: {
  s: TrustMetric;
  lang: Locale;
  trigger: boolean;
  divider: boolean;
}) {
  const num = parseFloat(String(s.value).replace(/[^\d.]/g, '')) || 0;
  const v = useCountUp(num, 1500, trigger);
  const display = trigger ? formatStat(s.value, v) : s.value.replace(/\d+/g, '0');
  const icon = s.icon && s.icon in ICONS ? s.icon : 'server';

  return (
    <div
      className="trust-metric-card"
      style={{
        padding: 24,
        borderLeft: divider ? '1px solid var(--border)' : 'none',
        background:
          'linear-gradient(135deg, color-mix(in srgb, var(--surface) 92%, transparent), color-mix(in srgb, var(--primary-soft) 34%, transparent))',
        minHeight: 190,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 'var(--radius-lg)',
          display: 'grid',
          placeItems: 'center',
          background: 'var(--primary-soft)',
          color: 'var(--primary)',
          marginBottom: 22,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            {ICONS[icon]}
          </g>
        </svg>
      </div>
      <div
        className="font-display"
        style={{
          fontSize: 'clamp(38px, 4vw, 58px)',
          fontWeight: 700,
          letterSpacing: '-0.035em',
          lineHeight: 1,
          color: 'var(--text-primary)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {display}
        {s.suffix && (
          <span style={{ fontSize: '0.5em', color: 'var(--text-tertiary)', marginLeft: 4 }}>{s.suffix[lang]}</span>
        )}
      </div>
      <div style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.4 }}>
        {s.label[lang]}
      </div>
    </div>
  );
}

export function StatsBand({ lang, pageContent }: { lang: Locale; pageContent?: unknown }) {
  const ref = useReveal<HTMLElement>();
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setTrigger(true)),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  // pages.home overrides stats[]; fall back to the static CONTENT.stats.
  const stats =
    (pageContent && typeof pageContent === 'object' && 'stats' in pageContent
      ? ((pageContent as { stats?: typeof CONTENT.stats }).stats)
      : null) ?? CONTENT.stats;

  return (
    <section
      ref={ref}
      className="reveal section-tight"
      style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
    >
      <div
        className="container-x trust-metric-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(stats.length || 1, 4)}, 1fr)`,
          borderLeft: '1px solid var(--border)',
          borderRight: '1px solid var(--border)',
        }}
      >
        {stats.map((s, i) => (
          <StatCell key={i} s={s} lang={lang} trigger={trigger} divider={i > 0} />
        ))}
      </div>
    </section>
  );
}
