'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { LangSwitch } from './LangSwitch';
import { ThemeSwitch } from './ThemeSwitch';
import { CONTENT, t } from '@/content/static';
import type { Locale } from '@/i18n/routing';

const NAV_KEYS = ['home', 'about', 'services', 'projects', 'news', 'careers', 'contact'] as const;
const ROUTE_MAP: Record<(typeof NAV_KEYS)[number], string> = {
  home: '',
  about: '/about',
  services: '/services',
  projects: '/projects',
  news: '/news',
  careers: '/careers',
  contact: '/contact',
};

export function Navbar({ lang }: { lang: Locale }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() ?? `/${lang}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string): boolean => {
    if (href === `/${lang}`) return pathname === `/${lang}` || pathname === `/${lang}/`;
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: scrolled ? 'color-mix(in oklab, var(--bg) 88%, transparent)' : 'transparent',
        backdropFilter: scrolled ? 'saturate(140%) blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'saturate(140%) blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 250ms var(--ease-out)',
      }}
    >
      <div className="container-x" style={{ display: 'flex', alignItems: 'center', gap: 32, height: 72 }}>
        <Logo lang={lang} />
        <nav style={{ display: 'flex', gap: 4, marginLeft: 16 }}>
          {NAV_KEYS.map((k) => {
            const href = `/${lang}${ROUTE_MAP[k]}`;
            const active = isActive(href);
            return (
              <Link
                key={k}
                href={href}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 500,
                  fontSize: 14,
                  color: active ? 'var(--primary)' : 'var(--text-secondary)',
                  background: active ? 'var(--primary-soft)' : 'transparent',
                  transition: 'color 150ms, background 150ms',
                  // Keep multi-word labels on a single line — Georgian
                  // "ჩვენ შესახებ" otherwise wraps on the space.
                  whiteSpace: 'nowrap',
                }}
              >
                {CONTENT.nav[k][lang]}
              </Link>
            );
          })}
        </nav>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <LangSwitch lang={lang} />
          <ThemeSwitch />
          <Link className="btn btn-primary btn-sm" href={`/${lang}/contact`}>
            {t(lang, 'cta.talk')}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M3 8h10m0 0L9 4m4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
