'use client';

import { useReveal } from '@/components/hooks/useReveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AvatarPH } from '@/components/visual/AvatarPH';
import { t } from '@/content/static';
import type { TeamMember } from '@/lib/dbContent';
import type { Locale } from '@/i18n/routing';

const ACCENTS = ['indigo', 'violet', 'plum'] as const;

export function TeamGrid({
  lang,
  team,
  pageContent,
}: {
  lang: Locale;
  team: TeamMember[];
  pageContent?: unknown;
}) {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="reveal section" style={{ background: 'var(--bg-soft)' }}>
      <div className="container-x">
        <SectionHeader
          eyebrow={t(lang, 'about.teamEyebrow', pageContent)}
          title={t(lang, 'about.teamTitle', pageContent)}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {team.map((m, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <AvatarPH name={m.name} accent={ACCENTS[i % 3]} />
              <div>
                <h4
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 19,
                    marginBottom: 4,
                  }}
                >
                  {m.name}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{m.role[lang]}</span>
                  <span
                    style={{
                      color: 'var(--text-tertiary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                    }}
                  >
                    {lang === 'en' ? 'since ' : '-დან '}
                    {m.since}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
