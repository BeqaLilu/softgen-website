import Link from 'next/link';
import type { Locale } from '@/i18n/routing';

/**
 * Brand mark used in the navbar, footer, admin sidebar, and login page.
 *
 * The mark is the file at /public/logo.webp, served from /logo.webp.
 * Plain <img> rather than next/image — the file is small, displayed at
 * a fixed ~28px on every page, and the optimizer's lazy-loading +
 * srcset machinery is overhead we don't need.
 *
 * `alt=""` because the surrounding <Link> already carries
 * aria-label="Softgen home"; repeating the brand name in alt would
 * make screen readers announce it twice.
 */
export function Logo({ size = 28, lang = 'en' }: { size?: number; lang?: Locale }) {
  return (
    <Link
      href={`/${lang}`}
      aria-label="Softgen home"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        color: 'var(--text-primary)',
      }}
    >
      <img
        src="/logo.webp"
        alt=""
        width={size}
        height={size}
        style={{ display: 'block', flexShrink: 0 }}
      />
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: '-0.02em',
        }}
      >
        Softgen<span style={{ color: 'var(--primary)' }}>.</span>
      </span>
    </Link>
  );
}
