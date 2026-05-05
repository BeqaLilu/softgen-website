'use client';

import { useState } from 'react';
import type { Bi } from '@/content/static';

/**
 * Field with EN | KA tab strip at the top-right of the label row.
 * Both values stay in component state; switching tabs swaps which input
 * is rendered. The parent receives a single Bi via onChange.
 *
 * Per components.md §`BilingualField`.
 */
export function BilingualField({
  label,
  value,
  onChange,
  type = 'text',
  rows = 4,
  required,
}: {
  label: string;
  value: Bi;
  onChange: (v: Bi) => void;
  type?: 'text' | 'textarea';
  rows?: number;
  required?: boolean;
}) {
  const [tab, setTab] = useState<'en' | 'ka'>('en');

  const setSide = (side: 'en' | 'ka', v: string) => {
    onChange({ ...value, [side]: v });
  };

  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        <div
          role="tablist"
          aria-label={`${label} language`}
          style={{
            display: 'flex',
            padding: 2,
            borderRadius: 999,
            background: 'var(--bg-deep)',
            border: '1px solid var(--border)',
          }}
        >
          {(['en', 'ka'] as const).map((s) => {
            const active = tab === s;
            return (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(s)}
                style={{
                  padding: '3px 9px',
                  borderRadius: 999,
                  border: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  fontSize: 11,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  background: active ? 'var(--surface)' : 'transparent',
                  color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  cursor: 'pointer',
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>
      {type === 'textarea' ? (
        <textarea
          className="textarea"
          rows={rows}
          value={value[tab] ?? ''}
          onChange={(e) => setSide(tab, e.target.value)}
          lang={tab}
        />
      ) : (
        <input
          className="input"
          type="text"
          value={value[tab] ?? ''}
          onChange={(e) => setSide(tab, e.target.value)}
          lang={tab}
        />
      )}
    </label>
  );
}
