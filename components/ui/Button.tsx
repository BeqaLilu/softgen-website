import Link from 'next/link';
import type { ReactNode, CSSProperties, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';

type Variant = 'primary' | 'ghost' | 'soft';
type Size = 'sm' | 'md' | 'lg';

function classes(variant: Variant, size: Size, extra = ''): string {
  const v = variant === 'primary' ? 'btn-primary'
    : variant === 'ghost' ? 'btn-ghost'
    : 'btn-soft';
  const s = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  return `btn ${v} ${s} ${extra}`.trim().replace(/\s+/g, ' ');
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button className={classes(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

type LinkButtonProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  style?: CSSProperties;
};

/** Looks like a Button but renders a Next.js Link for in-app navigation. */
export function LinkButton({
  href,
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...rest
}: LinkButtonProps) {
  // External or mailto/tel — render a plain <a>.
  if (/^(https?:|mailto:|tel:)/.test(href)) {
    return (
      <a href={href} className={classes(variant, size, className)} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}
