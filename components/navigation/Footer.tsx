import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { CONTENT, t, type Bi } from '@/content/static';
import type { Locale } from '@/i18n/routing';

type Group = {
  title: Bi;
  links: Array<[keyof typeof CONTENT.nav, string]>;
};

const GROUPS: Group[] = [
  { title: { en: 'Company', ka: 'კომპანია' }, links: [['about', '/about'], ['news', '/news'], ['careers', '/careers']] },
  { title: { en: 'Work',    ka: 'სამუშაო' },  links: [['services', '/services'], ['projects', '/projects']] },
  { title: { en: 'Contact', ka: 'კონტაქტი' }, links: [['contact', '/contact']] },
];

export function Footer({ lang }: { lang: Locale }) {
  return (
    <footer
      style={{
        marginTop: 120,
        paddingBottom: 48,
        paddingTop: 80,
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-soft)',
      }}
    >
      <div className="container-x footer-grid">
        <div>
          <Logo lang={lang} />
          <p style={{ marginTop: 20, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, maxWidth: 320 }}>
            {lang === 'en'
              ? 'Enterprise software, built in Tbilisi since 2008. We deliver, then we maintain.'
              : 'საწარმოო პროგრამები, აშენებული თბილისში 2008 წლიდან. ვუშვებთ და ვუვლით.'}
          </p>
          <p style={{ marginTop: 20, color: 'var(--text-tertiary)', fontSize: 13 }}>
            {t(lang, 'footer.address')}
            <br />
            <a href="mailto:hello@softgen.ge" style={{ color: 'var(--text-secondary)' }}>
              hello@softgen.ge
            </a>
          </p>
        </div>

        {GROUPS.map((g, i) => (
          <div key={i}>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 13,
                color: 'var(--text-primary)',
                marginBottom: 16,
                letterSpacing: '0.02em',
              }}
            >
              {g.title[lang]}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {g.links.map(([k, href]) => (
                <Link key={k} href={`/${lang}${href}`} style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                  {CONTENT.nav[k][lang]}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        className="container-x footer-copy"
        style={{
          marginTop: 64,
          paddingTop: 24,
          borderTop: '1px solid var(--border)',
          fontSize: 13,
          color: 'var(--text-tertiary)',
        }}
      >
        <span>© 2026 Softgen LLC. {t(lang, 'footer.rights')}</span>
        <span style={{ fontFamily: 'var(--font-mono)' }}>v.2026.04 · Tbilisi · Yerevan · Baku</span>
      </div>
    </footer>
  );
}
