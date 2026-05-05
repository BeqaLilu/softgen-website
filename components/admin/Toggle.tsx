'use client';

import * as TogglePrimitive from '@radix-ui/react-toggle';

/**
 * 44×24 pill. Off → border track. On → primary track. 20px white knob with shadow-sm.
 * Per components.md §`Toggle`.
 */
export function Toggle({
  pressed,
  onPressedChange,
  label,
  disabled,
}: {
  pressed: boolean;
  onPressedChange: (v: boolean) => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <TogglePrimitive.Root
      suppressHydrationWarning
      pressed={pressed}
      onPressedChange={onPressedChange}
      aria-label={label}
      disabled={disabled}
      style={{
        position: 'relative',
        width: 44,
        height: 24,
        borderRadius: 999,
        background: pressed ? 'var(--primary)' : 'var(--border)',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 200ms var(--ease-out)',
        opacity: disabled ? 0.5 : 1,
        padding: 0,
      }}
    >
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: 2,
          left: pressed ? 22 : 2,
          width: 20,
          height: 20,
          borderRadius: 999,
          background: 'white',
          boxShadow: 'var(--shadow-sm)',
          transition: 'left 200ms var(--ease-out)',
        }}
      />
    </TogglePrimitive.Root>
  );
}

/** Labelled wrapper used in admin forms. */
export function ToggleField({
  label,
  hint,
  pressed,
  onPressedChange,
}: {
  label: string;
  hint?: string;
  pressed: boolean;
  onPressedChange: (v: boolean) => void;
}) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '12px 0',
      }}
    >
      <div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 13,
            color: 'var(--text-primary)',
          }}
        >
          {label}
        </div>
        {hint && (
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{hint}</div>
        )}
      </div>
      <Toggle pressed={pressed} onPressedChange={onPressedChange} label={label} />
    </label>
  );
}
