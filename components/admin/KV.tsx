import type { ReactNode } from 'react';

/**
 * Key-value row used in admin detail drawers.
 * `key` mono-uppercase tertiary; `value` body or mono per the spec.
 * 12px vertical padding, 1px bottom border.
 */
export function KV({ k, children }: { k: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '140px 1fr',
        gap: 16,
        padding: '12px 0',
        borderBottom: '1px solid var(--border)',
        alignItems: 'baseline',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-tertiary)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        {k}
      </div>
      <div style={{ color: 'var(--text-primary)', fontSize: 14, lineHeight: 1.55, wordBreak: 'break-word' }}>
        {children}
      </div>
    </div>
  );
}
