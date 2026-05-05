'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';

/**
 * Pill toggle that swaps the leading `/en` ↔ `/ka` segment on the URL,
 * preserving the rest of the path. (next-intl's createSharedPathnamesNavigation
 * helpers exist but for our use we just rewrite the prefix.)
 */
export function LangSwitch({ lang }: { lang: Locale }) {
  const pathname = usePathname() ?? `/${lang}`;

  const swap = (target: Locale): string => {
    const parts = pathname.split('/');
    // pathname always starts with "/", so parts[0] === '', parts[1] === locale
    if (parts[1] && (routing.locales as readonly string[]).includes(parts[1])) {
      parts[1] = target;
      return parts.join('/') || `/${target}`;
    }
    return `/${target}`;
  };

  return (
    <div
      style={{
        display: 'flex',
        padding: 3,
        borderRadius: 999,
        background: 'var(--bg-deep)',
        border: '1px solid var(--border)',
      }}
    >
      {(['en', 'ka'] as const).map((l) => {
        const active = lang === l;
        return (
          <Link
            key={l}
            href={swap(l)}
            aria-current={active ? 'page' : undefined}
            style={{
              padding: '5px 11px',
              borderRadius: 999,
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              background: active ? 'var(--surface)' : 'transparent',
              color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
              boxShadow: active ? 'var(--shadow-xs)' : 'none',
              transition: 'all 200ms var(--ease-out)',
            }}
          >
            {l === 'en' ? 'EN' : 'ქა'}
          </Link>
        );
      })}
    </div>
  );
}
