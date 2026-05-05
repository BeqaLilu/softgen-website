'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useReveal } from '@/components/hooks/useReveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { LinkUnderline } from '@/components/ui/LinkUnderline';
import { Chip } from '@/components/ui/Chip';
import { Placeholder } from '@/components/visual/Placeholder';
import { t, type Project } from '@/content/static';
import type { Locale } from '@/i18n/routing';

function ProjectCard({
  p,
  lang,
  colSpan,
  large,
}: {
  p: Project;
  lang: Locale;
  colSpan: number;
  large: boolean;
}) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={`/${lang}/projects/${p.slug}`}
      className="card featured-project-card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        gridColumn: `span ${colSpan}`,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hover ? 'var(--shadow-md)' : 'none',
        transition: 'transform 250ms var(--ease-out), box-shadow 250ms var(--ease-out), border-color 250ms',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <Placeholder
          label={p.title.en}
          accent={p.accent}
          coverStyle={p.coverStyle ?? 'dashboard'}
          imageUrl={p.coverUrl}
          aspect={large ? '16/10' : '16/9'}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.22), transparent 36%), radial-gradient(circle at 78% 18%, rgba(255,255,255,0.35), transparent 24%)',
            mixBlendMode: 'soft-light',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            right: 18,
            bottom: 18,
            width: large ? 172 : 132,
            padding: 12,
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(255,255,255,0.14)',
            border: '1px solid rgba(255,255,255,0.22)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            transform: hover ? 'translateY(0)' : 'translateY(8px)',
            opacity: hover ? 1 : 0.78,
            transition: 'transform 250ms var(--ease-out), opacity 250ms var(--ease-out)',
          }}
        >
          <div style={{ display: 'grid', gap: 6 }}>
            {[72, 92, 58].map((width, i) => (
              <span
                key={width}
                style={{
                  height: 6,
                  width: `${width}%`,
                  borderRadius: 999,
                  background: i === 1 ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.42)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: '20px 8px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Chip>{p.category[lang]}</Chip>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-tertiary)' }}>
            {p.year}
          </span>
          </div>
          <span
            aria-hidden
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: hover ? 'var(--primary)' : 'var(--primary-soft)',
              color: hover ? 'white' : 'var(--primary)',
              transition: 'background 200ms var(--ease-out), color 200ms var(--ease-out)',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M4 12 12 4m0 0H5.5M12 4v6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <h3 className="h3" style={{ fontSize: large ? 28 : 22 }}>{p.title[lang]}</h3>
      </div>
    </Link>
  );
}

export function FeaturedProjects({
  lang,
  projects,
  pageContent,
}: {
  lang: Locale;
  projects: Project[];
  pageContent?: unknown;
}) {
  const ref = useReveal<HTMLElement>();
  // Take the first 4; the asymmetric grid expects exactly that many.
  const items = projects.slice(0, 4);
  return (
    <section ref={ref} className="reveal section" style={{ background: 'var(--bg-soft)' }}>
      <div className="container-x">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56 }}>
          <SectionHeader
            eyebrow={t(lang, 'projectsTeaser.eyebrow', pageContent)}
            title={t(lang, 'projectsTeaser.title', pageContent)}
            marginBottom={0}
          />
          <LinkUnderline href={`/${lang}/projects`}>{t(lang, 'cta.viewAll')}</LinkUnderline>
        </div>
        <div className="featured-project-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20 }}>
          {items.map((p, i) => {
            // Asymmetric grid: 7 + 5 on row 1, 6 + 6 on row 2 (per prototype).
            const span = i === 0 ? 7 : i === 1 ? 5 : 6;
            return <ProjectCard key={p.slug} p={p} lang={lang} colSpan={span} large={i === 0} />;
          })}
        </div>
      </div>
    </section>
  );
}
