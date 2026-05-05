'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { useReveal } from '@/components/hooks/useReveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { t } from '@/content/static';
import type { ServiceItem } from '@/lib/dbContent';
import type { Locale } from '@/i18n/routing';

type ServiceVisualIcon = 'cube' | 'portal' | 'shield' | 'workflow';
type ServiceCardItem = ServiceItem & { visualIcon?: ServiceVisualIcon };
type ServiceOverride = Partial<ServiceCardItem> & { slug: string };

const SERVICE_ICONS: Record<ServiceVisualIcon, ReactNode> = {
  cube: (
    <>
      <path className="service-icon-pulse" d="M9 28V14l12-7 12 7v14l-12 7-12-7Z" stroke="currentColor" strokeWidth="1.6" opacity="0.45" />
      <path d="M21 7v14l12 7M21 21 9 14M21 21v14" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="21" cy="21" r="4" fill="currentColor" opacity="0.16" />
      <circle className="service-icon-pulse" cx="21" cy="21" r="2.5" fill="currentColor" />
    </>
  ),
  portal: (
    <>
      <rect x="9" y="10" width="24" height="20" rx="6" stroke="currentColor" strokeWidth="1.6" opacity="0.45" />
      <path className="service-icon-flow" d="M15 18h12M15 23h8M21 7v6M14 7h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="12 12" />
      <circle className="service-icon-pulse" cx="29" cy="25" r="3" fill="currentColor" opacity="0.22" />
    </>
  ),
  shield: (
    <>
      <path d="M21 7 32 11.5v9.3c0 6.2-4.4 11.2-11 13.2-6.6-2-11-7-11-13.2v-9.3L21 7Z" stroke="currentColor" strokeWidth="1.6" opacity="0.6" />
      <path className="service-icon-flow" d="m16 21 3.2 3.2L26.5 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="24 24" />
    </>
  ),
  workflow: (
    <>
      <rect className="service-icon-pulse" x="7" y="10" width="10" height="10" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <rect x="25" y="10" width="10" height="10" rx="3" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
      <rect className="service-icon-pulse" x="16" y="25" width="10" height="10" rx="3" stroke="currentColor" strokeWidth="1.6" opacity="0.75" />
      <path className="service-icon-flow" d="M17 15h8M21 20v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="10 10" />
    </>
  ),
};

function homeServiceOverrides(pageContent: unknown): Map<string, ServiceOverride> {
  if (!pageContent || typeof pageContent !== 'object') return new Map();
  const services = (pageContent as { services?: { items?: unknown } }).services;
  if (!services || !Array.isArray(services.items)) return new Map();
  return new Map(
    services.items
      .filter((item): item is ServiceOverride => Boolean(item && typeof item === 'object' && 'slug' in item))
      .map((item) => [String(item.slug), item])
  );
}

function ServiceCell({
  item,
  lang,
}: {
  item: ServiceCardItem;
  lang: Locale;
}) {
  const [hover, setHover] = useState(false);
  const capabilityPreview = item.capabilities?.slice(0, 2) ?? [];
  const visualIcon = item.visualIcon && item.visualIcon in SERVICE_ICONS ? item.visualIcon : 'cube';
  return (
    <Link
      href={`/${lang}/services/${item.slug}`}
      className="service-card glow-hover"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '44px 40px 40px',
        background: hover ? 'var(--bg-soft)' : 'var(--surface)',
        transition: 'background 200ms var(--ease-out)',
        position: 'relative',
        minHeight: 240,
        display: 'block',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: 'var(--primary)',
            letterSpacing: '0.08em',
            marginBottom: 28,
          }}
        >
          {item.num}
        </div>
        <div
          aria-hidden
          style={{
            width: 74,
            height: 74,
            borderRadius: 20,
            border: '1px solid var(--border)',
            background:
              'radial-gradient(circle at 28% 24%, var(--primary-soft), transparent 45%), var(--surface-elev)',
            display: 'grid',
            placeItems: 'center',
            transform: hover ? 'rotate(-2deg) scale(1.04)' : 'rotate(0deg) scale(1)',
            transition: 'transform 250ms var(--ease-out), border-color 250ms var(--ease-out)',
          }}
        >
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" style={{ color: 'var(--primary)' }}>
            {SERVICE_ICONS[visualIcon]}
          </svg>
        </div>
      </div>
      <h3 className="h3" style={{ marginBottom: 12, maxWidth: 380 }}>{item.title[lang]}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.55, maxWidth: 460 }}>
        {item.body[lang]}
      </p>
      {capabilityPreview.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 22, maxWidth: 480 }}>
          {capabilityPreview.map((capability) => (
            <span
              key={capability[lang]}
              style={{
                padding: '7px 10px',
                borderRadius: 'var(--radius-full)',
                background: hover ? 'var(--surface)' : 'var(--bg-soft)',
                border: '1px solid var(--border)',
                color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                transition: 'background 200ms var(--ease-out)',
              }}
            >
              {capability[lang]}
            </span>
          ))}
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          right: 32,
          bottom: 32,
          opacity: hover ? 1 : 0,
          transform: hover ? 'translateX(0)' : 'translateX(-8px)',
          transition: 'all 250ms var(--ease-out)',
          color: 'var(--primary)',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  );
}

export function ServicesSection({
  lang,
  services,
  pageContent,
}: {
  lang: Locale;
  services: ServiceItem[];
  pageContent?: unknown;
}) {
  const ref = useReveal<HTMLElement>();
  const overrides = homeServiceOverrides(pageContent);
  const items = services.map((service) => ({
    ...service,
    ...(overrides.get(service.slug) ?? {}),
  }));

  return (
    <section ref={ref} className="reveal section">
      <div className="container-x">
        <SectionHeader eyebrow={t(lang, 'services.eyebrow', pageContent)} title={t(lang, 'services.title', pageContent)} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1,
            background: 'var(--border)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            border: '1px solid var(--border)',
          }}
        >
          {items.map((it) => (
            <ServiceCell key={it.slug} item={it} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}
