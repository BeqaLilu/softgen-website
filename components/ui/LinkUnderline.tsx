import Link from 'next/link';
import type { ReactNode, CSSProperties } from 'react';

const ARROW = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M3 8h10m0 0L9 4m4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ARROW_LEFT = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M13 8H3m0 0l4-4m-4 4l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function LinkUnderline({
  href,
  children,
  arrow = 'right',
  style,
  className = '',
}: {
  href: string;
  children: ReactNode;
  arrow?: 'right' | 'left' | 'none';
  style?: CSSProperties;
  className?: string;
}) {
  const inner = (
    <>
      {arrow === 'left' && ARROW_LEFT}
      <span>{children}</span>
      {arrow === 'right' && ARROW}
    </>
  );

  if (/^(https?:|mailto:|tel:)/.test(href)) {
    return (
      <a href={href} className={`link-underline ${className}`.trim()} style={style}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={`link-underline ${className}`.trim()} style={style}>
      {inner}
    </Link>
  );
}
