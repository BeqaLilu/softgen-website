type Accent = 'indigo' | 'violet' | 'plum';

const PALETTES: Record<Accent, [string, string]> = {
  indigo: ['#4F3EDB', '#EDE9FF'],
  violet: ['#6B4FE8', '#F0EBFF'],
  plum:   ['#3F2FB0', '#E8E2FF'],
};

export function AvatarPH({
  name,
  accent = 'indigo',
}: {
  name: string;
  accent?: Accent;
}) {
  const [c1, c3] = PALETTES[accent];
  const initials = name.split(' ').map((s) => s[0]).slice(0, 2).join('');
  return (
    <div
      className="glow-hover"
      style={{
        aspectRatio: '1/1.15',
        borderRadius: 'var(--radius-lg)',
        background: `linear-gradient(160deg, ${c3} 0%, ${c1}22 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: 56,
        color: c1,
        letterSpacing: '-0.02em',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 115"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, opacity: 0.4 }}
        aria-hidden
      >
        <circle cx="50" cy="42" r="22" fill={c1} fillOpacity="0.25" />
        <ellipse cx="50" cy="115" rx="38" ry="34" fill={c1} fillOpacity="0.25" />
      </svg>
      <span style={{ position: 'relative' }}>{initials}</span>
    </div>
  );
}
