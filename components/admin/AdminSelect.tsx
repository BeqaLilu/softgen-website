'use client';

import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';

/**
 * Native-feeling select styled to match `.input`. Used in admin drawers
 * for category / department / type fields.
 *
 * Per components.md §`Select` — chevron in `--text-tertiary` 16px.
 */
export function AdminSelect<T extends string>({
  value,
  onValueChange,
  options,
  placeholder = 'Select…',
  label,
  required,
}: {
  value: T | undefined;
  onValueChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
  placeholder?: string;
  label?: string;
  required?: boolean;
}) {
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
          {required && <span style={{ color: 'var(--danger)', marginLeft: 4 }}>*</span>}
        </span>
      )}
      <Select.Root value={value} onValueChange={(v) => onValueChange(v as T)}>
        <Select.Trigger
          className="input"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
          }}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <ChevronDown size={16} color="var(--text-tertiary)" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={6}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)',
              zIndex: 200,
              minWidth: 'var(--radix-select-trigger-width)',
              overflow: 'hidden',
            }}
          >
            <Select.Viewport style={{ padding: 4 }}>
              {options.map((o) => (
                <Select.Item
                  key={o.value}
                  value={o.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 14,
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                  className="admin-select-item"
                >
                  <Select.ItemText>{o.label}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check size={14} color="var(--primary)" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      <style jsx global>{`
        .admin-select-item[data-highlighted] { background: var(--primary-soft); color: var(--primary); }
      `}</style>
    </label>
  );
}
