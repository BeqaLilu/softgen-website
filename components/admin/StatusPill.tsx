/**
 * Lead status pill — colored dot + label.
 * Palettes per design-tokens.md §1.4 (Status colors). All colors come
 * from CSS variables defined in globals.css so light/dark switch is
 * automatic. The "lost" status uses `--text-tertiary` as fg.
 */

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost';

const PALETTE: Record<LeadStatus, { fg: string; bg: string; label: string }> = {
  new:        { fg: 'var(--primary)',              bg: 'var(--primary-soft)',          label: 'New' },
  contacted:  { fg: 'var(--status-contacted-fg)',  bg: 'var(--status-contacted-bg)',   label: 'Contacted' },
  qualified:  { fg: 'var(--status-qualified-fg)',  bg: 'var(--status-qualified-bg)',   label: 'Qualified' },
  lost:       { fg: 'var(--status-lost-fg)',       bg: 'var(--status-lost-bg)',        label: 'Lost' },
};

export function StatusPill({ status }: { status: LeadStatus | string | null | undefined }) {
  const key = (status && status in PALETTE ? status : 'new') as LeadStatus;
  const p = PALETTE[key];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 999,
        background: p.bg,
        color: p.fg,
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: 12,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 999, background: p.fg }} />
      {p.label}
    </span>
  );
}

export const STATUS_OPTIONS: LeadStatus[] = ['new', 'contacted', 'qualified', 'lost'];
