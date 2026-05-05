import type { ReactNode, CSSProperties } from 'react';

export function Container({
  children,
  className = '',
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`container-x ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
