'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Chip } from '@/components/ui/Chip';
import { CONTENT, type Job } from '@/content/static';
import type { Locale } from '@/i18n/routing';

export function JobsList({ lang, jobs: all }: { lang: Locale; jobs: Job[] }) {
  const [dept, setDept] = useState<string>('all');
  const jobs = dept === 'all' ? all : all.filter((j) => j.department === dept);

  return (
    <>
      <div className="container-x">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: '1px solid var(--border)' }}>
          {CONTENT.careers.departments.map((d) => {
            const active = d.id === dept;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setDept(d.id)}
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
                  cursor: 'pointer',
                }}
              >
                {d.label[lang]}
              </button>
            );
          })}
        </div>
      </div>

      <section className="section-tight" style={{ paddingTop: 24 }}>
        <div className="container-x" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {jobs.map((j, i) => (
            <Link
              key={j.slug}
              href={`/${lang}/careers/${j.slug}`}
              style={{
                padding: '28px 4px',
                display: 'grid',
                gridTemplateColumns: '1fr 200px 160px auto',
                alignItems: 'center',
                gap: 24,
                borderTop: '1px solid var(--border)',
                borderBottom: i === jobs.length - 1 ? '1px solid var(--border)' : 'none',
                transition: 'background 150ms',
              }}
            >
              <div>
                <h3 className="h3" style={{ fontSize: 22, marginBottom: 6 }}>{j.title[lang]}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14.5, lineHeight: 1.5, maxWidth: 600 }}>
                  {j.description[lang]}
                </p>
              </div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
                {j.department}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Chip variant="outline" style={{ fontSize: 11 }}>
                  {CONTENT.careers.types[j.type][lang]}
                </Chip>
                <Chip variant="outline" style={{ fontSize: 11 }}>
                  {j.location}
                </Chip>
              </div>
              <span style={{ color: 'var(--primary)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          ))}
          {jobs.length === 0 && (
            <div style={{ padding: 64, textAlign: 'center', color: 'var(--text-tertiary)' }}>
              {lang === 'en'
                ? 'No open roles in this team. Email careers@softgen.ge anyway.'
                : 'ამ გუნდში ღია პოზიციები ჯერ არ არის.'}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
