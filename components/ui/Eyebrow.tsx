import type { ReactNode, CSSProperties } from 'react';

export function Eyebrow({
  children,
  style,
  className = '',
}: {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <div className={`eyebrow ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
