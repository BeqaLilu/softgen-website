import type { ReactNode, CSSProperties } from 'react';

export function Chip({
  children,
  variant = 'solid',
  style,
  className = '',
}: {
  children: ReactNode;
  variant?: 'solid' | 'outline';
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <span
      className={`chip ${variant === 'outline' ? 'chip-outline' : ''} ${className}`.trim()}
      style={style}
    >
      {children}
    </span>
  );
}
