import Link from 'next/link';
import { Placeholder } from '@/components/visual/Placeholder';
import { CONTENT, type Article } from '@/content/static';
import type { Locale } from '@/i18n/routing';

export function formatDate(iso: string, lang: Locale): string {
  const d = new Date(iso);
  const months: Record<Locale, string[]> = {
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    ka: ['იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ', 'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ'],
  };
  return `${months[lang][d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function NewsCard({
  a,
  lang,
  large = false,
}: {
  a: Article;
  lang: Locale;
  large?: boolean;
}) {
  const cat = CONTENT.news.categories.find((c) => c.id === a.category);
  return (
    <Link
      href={`/${lang}/news/${a.slug}`}
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        overflow: 'hidden',
        height: '100%',
      }}
    >
      <Placeholder accent={a.accent} aspect={large ? '16/9' : '16/10'} />
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        <div
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            color: 'var(--text-tertiary)',
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
          }}
        >
          {cat && <span style={{ color: 'var(--primary)' }}>{cat.label[lang]}</span>}
          <span>·</span>
          <span>{formatDate(a.date, lang)}</span>
          <span>·</span>
          <span>
            {a.readTime} {lang === 'en' ? 'min' : 'წთ'}
          </span>
        </div>
        <h3 className="h3" style={{ fontSize: large ? 30 : 21, lineHeight: 1.2 }}>{a.title[lang]}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14.5, lineHeight: 1.55 }}>{a.excerpt[lang]}</p>
      </div>
    </Link>
  );
}
