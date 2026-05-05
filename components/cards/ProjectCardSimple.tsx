import Link from 'next/link';
import { Chip } from '@/components/ui/Chip';
import { Placeholder } from '@/components/visual/Placeholder';
import type { Project } from '@/content/static';
import type { Locale } from '@/i18n/routing';

export function ProjectCardSimple({ p, lang }: { p: Project; lang: Locale }) {
  return (
    <Link
      href={`/${lang}/projects/${p.slug}`}
      className="card"
      style={{ padding: 16, display: 'flex', flexDirection: 'column' }}
    >
      <Placeholder accent={p.accent} coverStyle={p.coverStyle ?? 'dashboard'} imageUrl={p.coverUrl} aspect="16/10" />
      <div style={{ padding: '20px 8px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Chip>{p.category[lang]}</Chip>
        <h3 className="h3" style={{ fontSize: 22 }}>{p.title[lang]}</h3>
      </div>
    </Link>
  );
}
