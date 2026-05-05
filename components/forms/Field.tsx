import type { CSSProperties } from 'react';

/**
 * Light-weight controlled-or-uncontrolled field. The build-prompt §5
 * locks form behavior to react-hook-form + zod (Phase 4); until those
 * deps land we ship the prototype's native FormData submit, identical
 * UX, just no schema validation library wrapper.
 */
export function Field({
  name,
  type = 'text',
  label,
  error,
  required,
}: {
  name: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'textarea';
  label: string;
  error?: boolean;
  required?: boolean;
}) {
  const errStyle: CSSProperties | undefined = error ? { borderColor: 'var(--danger)' } : undefined;

  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 500,
          fontSize: 13,
          color: 'var(--text-secondary)',
        }}
      >
        {label}
        {required && <span style={{ color: 'var(--danger)', marginLeft: 4 }}>*</span>}
      </span>
      {type === 'textarea' ? (
        <textarea className="textarea" name={name} rows={4} style={errStyle} />
      ) : (
        <input className="input" name={name} type={type} style={errStyle} />
      )}
    </label>
  );
}
