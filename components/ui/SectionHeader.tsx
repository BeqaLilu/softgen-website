import { Eyebrow } from './Eyebrow';

export function SectionHeader({
  eyebrow,
  title,
  center = false,
  marginBottom = 56,
  maxWidth = 720,
}: {
  eyebrow: string;
  title: string;
  center?: boolean;
  marginBottom?: number;
  maxWidth?: number;
}) {
  return (
    <div
      style={{
        marginBottom,
        textAlign: center ? 'center' : 'left',
        display: center ? 'flex' : 'block',
        flexDirection: 'column',
        alignItems: center ? 'center' : undefined,
      }}
    >
      <Eyebrow style={{ marginBottom: 20 }}>{eyebrow}</Eyebrow>
      <h2 className="h2" style={{ maxWidth, textWrap: 'balance' as const }}>{title}</h2>
    </div>
  );
}
