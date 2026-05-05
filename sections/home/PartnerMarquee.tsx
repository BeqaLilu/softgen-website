'use client';

import { useReveal } from '@/components/hooks/useReveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { t } from '@/content/static';
import type { Locale } from '@/i18n/routing';

function PartnerLogo({ name }: { name: string }) {
  return (
    <div
      style={{
        flex: '0 0 auto',
        padding: '20px 32px',
        display: 'flex',
        alignItems: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: 22,
        letterSpacing: '-0.02em',
        color: 'var(--text-tertiary)',
        transition: 'color 200ms',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.color = 'var(--text-primary)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.color = 'var(--text-tertiary)';
      }}
    >
      {name}
    </div>
  );
}

export function PartnerMarquee({
  lang,
  partners,
  pageContent,
}: {
  lang: Locale;
  partners: string[];
  pageContent?: unknown;
}) {
  const ref = useReveal<HTMLElement>();
  const doubled = [...partners, ...partners];

  return (
    <section ref={ref} className="reveal section-tight" style={{ overflow: 'hidden' }}>
      <div className="container-x" style={{ marginBottom: 40 }}>
        <SectionHeader
          eyebrow={t(lang, 'partners.eyebrow', pageContent)}
          title={t(lang, 'partners.title', pageContent)}
          center
          marginBottom={0}
        />
      </div>
      <div
        style={{
          position: 'relative',
          maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 60,
            width: 'max-content',
            animation: 'marquee 60s linear infinite',
          }}
        >
          {doubled.map((name, i) => (
            <PartnerLogo key={i} name={name} />
          ))}
        </div>
      </div>
    </section>
  );
}
