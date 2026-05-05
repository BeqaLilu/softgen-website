/** Animated SVG backdrop for the homepage hero. */
export function HeroBackdrop({ systemLabels = [] }: { systemLabels?: string[] }) {
  const nodes = [
    { x: 760, y: 198, label: systemLabels[0] ?? 'Banking core', delay: '0s' },
    { x: 940, y: 122, label: systemLabels[1] ?? 'Gov portal', delay: '0.5s' },
    { x: 1112, y: 238, label: systemLabels[2] ?? 'ID platform', delay: '1s' },
    { x: 930, y: 374, label: systemLabels[3] ?? 'Billing', delay: '1.5s' },
  ];

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 720"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8E78F0" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8E78F0" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="grid" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--border)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--border)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* faint grid */}
        {Array.from({ length: 18 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 80} x2={i * 80} y1="0" y2="720" stroke="url(#grid)" strokeWidth="1" />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`h${i}`} y1={i * 80} y2={i * 80} x1="0" x2="1440" stroke="url(#grid)" strokeWidth="1" />
        ))}

        {/* glow blobs */}
        <circle cx="1100" cy="280" r="380" fill="url(#glow1)">
          <animate attributeName="cx" values="1100;1180;1100" dur="14s" repeatCount="indefinite" />
          <animate attributeName="cy" values="280;220;280" dur="18s" repeatCount="indefinite" />
        </circle>
        <circle cx="220" cy="540" r="320" fill="url(#glow2)">
          <animate attributeName="cx" values="220;320;220" dur="16s" repeatCount="indefinite" />
        </circle>

        {/* Animated system map: critical domains pulsing into a Softgen core. */}
        <g className="hero-system-map">
          <path
            d="M760 198 C830 188 858 236 902 264 M940 122 C922 178 918 218 902 264 M1112 238 C1030 236 972 248 902 264 M930 374 C910 338 902 306 902 264"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="1.4"
            strokeOpacity="0.3"
            strokeDasharray="7 10"
          />
          <circle cx="902" cy="264" r="62" fill="var(--surface)" fillOpacity="0.5" stroke="var(--primary)" strokeOpacity="0.22" />
          <circle cx="902" cy="264" r="36" fill="var(--primary)" fillOpacity="0.08" stroke="var(--primary)" strokeOpacity="0.4">
            <animate attributeName="r" values="34;42;34" dur="5s" repeatCount="indefinite" />
            <animate attributeName="fill-opacity" values="0.06;0.14;0.06" dur="5s" repeatCount="indefinite" />
          </circle>
          <text
            x="902"
            y="269"
            textAnchor="middle"
            fill="var(--primary)"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.08em' }}
          >
            SOFTGEN
          </text>
          {nodes.map((node) => (
            <g key={node.label} className="hero-system-node">
              <circle cx={node.x} cy={node.y} r="22" fill="var(--surface)" fillOpacity="0.72" stroke="var(--border)" />
              <circle cx={node.x} cy={node.y} r="6" fill="var(--primary)">
                <animate attributeName="r" values="5;8;5" dur="4s" begin={node.delay} repeatCount="indefinite" />
                <animate attributeName="fill-opacity" values="0.55;1;0.55" dur="4s" begin={node.delay} repeatCount="indefinite" />
              </circle>
              <circle cx={node.x} cy={node.y} r="18" fill="none" stroke="var(--primary)" strokeOpacity="0.18">
                <animate attributeName="r" values="18;34;18" dur="4s" begin={node.delay} repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.25;0;0.25" dur="4s" begin={node.delay} repeatCount="indefinite" />
              </circle>
              <text
                x={node.x}
                y={node.y + 42}
                textAnchor="middle"
                fill="var(--text-tertiary)"
                style={{ fontFamily: 'var(--font-body)', fontSize: 13 }}
              >
                {node.label}
              </text>
            </g>
          ))}
        </g>
      </svg>

      {/* geometric arc cluster (right side) */}
      <svg
        width="640"
        height="640"
        viewBox="0 0 640 640"
        style={{ position: 'absolute', right: -120, top: 40, opacity: 0.5 }}
      >
        <g fill="none" stroke="var(--primary)" strokeWidth="1.2" strokeOpacity="0.55">
          {Array.from({ length: 16 }).map((_, i) => (
            <circle key={i} cx="320" cy="320" r={40 + i * 18}>
              <animate
                attributeName="stroke-opacity"
                values="0.15;0.55;0.15"
                dur={`${6 + i * 0.2}s`}
                repeatCount="indefinite"
                begin={`${i * 0.1}s`}
              />
            </circle>
          ))}
        </g>
        <circle cx="320" cy="320" r="6" fill="var(--primary)" />
      </svg>
    </div>
  );
}
