import type { ReactNode } from 'react';

type Accent = 'indigo' | 'violet' | 'plum';
export type CoverStyle = 'dashboard' | 'network' | 'ledger' | 'identity' | 'workflow';

const PALETTES: Record<Accent, [string, string, string]> = {
  indigo: ['#4F3EDB', '#8E78F0', '#EDE9FF'],
  violet: ['#6B4FE8', '#A89BFF', '#F0EBFF'],
  plum:   ['#3F2FB0', '#7261E0', '#E8E2FF'],
};

/**
 * Abstract gradient cover for project / article / hero figures.
 * Swap to <Image> with the same aspect when real photography arrives —
 * the wrapper's aspect-ratio + radius are unchanged.
 */
export function Placeholder({
  label,
  accent = 'indigo',
  coverStyle = 'dashboard',
  imageUrl,
  aspect = '16/10',
  subtle = false,
  children,
}: {
  label?: string;
  accent?: Accent;
  coverStyle?: CoverStyle;
  imageUrl?: string | null;
  aspect?: string;
  subtle?: boolean;
  children?: ReactNode;
}) {
  const [c1, c2, c3] = PALETTES[accent];
  const gradId = `g-${accent}-${coverStyle}`;
  return (
    <div
      className="glow-hover"
      style={{
        position: 'relative',
        aspectRatio: aspect,
        overflow: 'hidden',
        borderRadius: 'var(--radius-lg)',
        background: `linear-gradient(135deg, ${c3} 0%, ${c2}55 60%, ${c1}33 100%)`,
        border: subtle ? '1px solid var(--border)' : 'none',
      }}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={label ?? ''}
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
      {imageUrl && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, rgba(14,11,26,0.08), rgba(79,62,219,0.16)), radial-gradient(circle at 78% 18%, rgba(255,255,255,0.2), transparent 26%)',
            mixBlendMode: 'multiply',
          }}
        />
      )}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 250"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: imageUrl ? 0.42 : 0.85,
          mixBlendMode: imageUrl ? 'screen' : 'normal',
        }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={c1} stopOpacity="0.0" />
            <stop offset="100%" stopColor={c1} stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <circle cx="320" cy="60" r="120" fill={c2} fillOpacity="0.35" />
        <circle cx="80" cy="220" r="160" fill={c1} fillOpacity="0.25" />
        <rect x="0" y="0" width="400" height="250" fill={`url(#${gradId})`} />
        <g stroke={c1} strokeOpacity="0.35" strokeWidth="1" fill="none">
          <circle cx="200" cy="125" r="40" />
          <circle cx="200" cy="125" r="60" />
          <circle cx="200" cy="125" r="80" />
        </g>
        {coverStyle === 'dashboard' && (
          <g transform="translate(72 62)">
            <rect x="0" y="0" width="178" height="110" rx="16" fill="white" fillOpacity="0.22" stroke={c1} strokeOpacity="0.26" />
            <rect x="18" y="22" width="52" height="12" rx="6" fill={c1} fillOpacity="0.32" />
            <rect x="18" y="48" width="132" height="8" rx="4" fill={c1} fillOpacity="0.22" />
            <rect x="18" y="66" width="98" height="8" rx="4" fill={c2} fillOpacity="0.42" />
            <path d="M22 92c28-28 44 8 72-18s42-4 66-30" stroke={c1} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
          </g>
        )}
        {coverStyle === 'network' && (
          <g fill="none" stroke={c1} strokeWidth="2" opacity="0.62">
            <path d="M86 82 146 138 226 76 304 156" />
            <path d="M146 138 180 186 226 76" strokeOpacity="0.5" />
            {[86, 146, 226, 304, 180].map((x, i) => (
              <circle key={x} cx={x} cy={[82, 138, 76, 156, 186][i]} r="10" fill={c3} stroke={c1} />
            ))}
          </g>
        )}
        {coverStyle === 'ledger' && (
          <g transform="translate(74 54)" opacity="0.72">
            {[0, 1, 2, 3].map((row) => (
              <g key={row} transform={`translate(0 ${row * 34})`}>
                <rect x="0" y="0" width="210" height="22" rx="11" fill="white" fillOpacity={row === 0 ? '0.28' : '0.18'} />
                <rect x="18" y="7" width={row === 2 ? 86 : 52} height="8" rx="4" fill={c1} fillOpacity="0.45" />
                <rect x="136" y="7" width="48" height="8" rx="4" fill={c2} fillOpacity="0.55" />
              </g>
            ))}
          </g>
        )}
        {coverStyle === 'identity' && (
          <g transform="translate(154 54)" opacity="0.72">
            <rect x="0" y="0" width="92" height="132" rx="24" fill="white" fillOpacity="0.22" stroke={c1} strokeOpacity="0.3" />
            <circle cx="46" cy="45" r="22" fill={c1} fillOpacity="0.28" />
            <path d="M24 94c10-20 34-20 44 0" stroke={c1} strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M46 18v18M46 58v18M19 47h18M55 47h18" stroke={c1} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          </g>
        )}
        {coverStyle === 'workflow' && (
          <g transform="translate(64 78)" opacity="0.72">
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(${i * 104} ${i % 2 ? 42 : 0})`}>
                <rect x="0" y="0" width="72" height="46" rx="14" fill="white" fillOpacity="0.22" stroke={c1} strokeOpacity="0.24" />
                <rect x="16" y="15" width="40" height="6" rx="3" fill={c1} fillOpacity="0.45" />
                <rect x="16" y="27" width="28" height="5" rx="2.5" fill={c2} fillOpacity="0.5" />
              </g>
            ))}
            <path d="M74 24c34 0 36 44 66 44M178 68c34 0 36-44 66-44" stroke={c1} strokeWidth="3" strokeLinecap="round" strokeDasharray="5 8" fill="none" />
          </g>
        )}
      </svg>
      {children}
      {label && !imageUrl && (
        <div
          style={{
            position: 'absolute',
            left: 16,
            bottom: 14,
            right: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: c1,
            opacity: 0.7,
          }}
        >
          <span>{label}</span>
          <span>placeholder</span>
        </div>
      )}
    </div>
  );
}
