import type { ReactNode, CSSProperties } from 'react';

export function Section({
  children,
  tight,
  className = '',
  style,
  id,
}: {
  children: ReactNode;
  tight?: boolean;
  className?: string;
  style?: CSSProperties;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`${tight ? 'section-tight' : 'section'} ${className}`.trim()}
      style={style}
    >
      {children}
    </section>
  );
}
