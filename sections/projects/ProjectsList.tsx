'use client';

import { useState } from 'react';
import { ProjectCardSimple } from '@/components/cards/ProjectCardSimple';
import { CONTENT, type Project } from '@/content/static';
import type { Locale } from '@/i18n/routing';

export function ProjectsList({
  lang,
  projects,
}: {
  lang: Locale;
  projects: Project[];
}) {
  const [filter, setFilter] = useState<string>('all');
  const items =
    filter === 'all'
      ? projects
      : projects.filter((p) => p.category.en === filter);

  return (
    <>
      <div className="container-x">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: '1px solid var(--border)' }}>
          {CONTENT.projectsPage.filters.map((f) => {
            const active = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
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
                {f.label[lang]}
              </button>
            );
          })}
        </div>
      </div>

      <section className="section-tight" style={{ paddingTop: 32 }}>
        <div className="container-x">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            {items.map((p) => (
              <ProjectCardSimple key={p.slug} p={p} lang={lang} />
            ))}
            {items.length === 0 && (
              <div
                style={{
                  gridColumn: '1 / -1',
                  padding: 64,
                  textAlign: 'center',
                  color: 'var(--text-tertiary)',
                }}
              >
                {lang === 'en' ? 'No projects in this category yet.' : 'ამ კატეგორიაში პროექტები ჯერ არ არის.'}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
