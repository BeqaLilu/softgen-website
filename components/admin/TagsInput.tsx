'use client';

import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';

/** Pill-list input. Add on Enter or comma; remove via X on each pill. */
export function TagsInput({
  label,
  value,
  onChange,
  placeholder = 'Add tag…',
}: {
  label?: string;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');

  const commit = () => {
    const t = draft.trim().replace(/,$/, '');
    if (!t) return;
    if (value.includes(t)) {
      setDraft('');
      return;
    }
    onChange([...value, t]);
    setDraft('');
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 13,
            color: 'var(--text-secondary)',
          }}
        >
          {label}
        </span>
      )}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          padding: 8,
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--surface)',
          minHeight: 44,
        }}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="chip"
            style={{ paddingRight: 6, gap: 4 }}
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              aria-label={`Remove ${tag}`}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'inherit',
                padding: 0,
                display: 'inline-flex',
                cursor: 'pointer',
              }}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          onBlur={commit}
          placeholder={value.length === 0 ? placeholder : ''}
          style={{
            flex: 1,
            minWidth: 100,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'var(--text-primary)',
            font: 'inherit',
            padding: '4px 6px',
          }}
        />
      </div>
    </label>
  );
}
