import type { ReactNode } from 'react';

export function AdminTopbar({
  title,
  right,
}: {
  title: string;
  right?: ReactNode;
}) {
  return (
    <div
      style={{
        height: 80,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'var(--bg-deep)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        {title}
      </h1>
      {right && <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>{right}</div>}
    </div>
  );
}
