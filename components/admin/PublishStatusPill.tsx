/** Tiny variant of StatusPill for content tables (Published / Draft). */
export function PublishStatusPill({ published }: { published: boolean }) {
  const fg = published ? 'var(--primary)' : 'var(--text-tertiary)';
  const bg = published ? 'var(--primary-soft)' : 'rgba(138, 130, 168, 0.15)';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 999,
        background: bg,
        color: fg,
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: 12,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 999, background: fg }} />
      {published ? 'Published' : 'Draft'}
    </span>
  );
}
