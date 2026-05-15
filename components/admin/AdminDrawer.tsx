'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * 640px-wide drawer that slides in from the right.
 * - Backdrop: black at 40% opacity
 * - Header: title + close X, 1px bottom border
 * - Footer (optional): sticky with 1px top border, holds Cancel/Save
 * - Body scrolls; header + footer stay
 *
 * Per components.md §`AdminDrawer`.
 */
export function AdminDrawer({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            zIndex: 100,
            animation: 'pageEnter 200ms var(--ease-out)',
          }}
        />
        <Dialog.Content
          aria-describedby={description ? 'admin-drawer-desc' : undefined}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: 640,
            maxWidth: '95vw',
            background: 'var(--surface)',
            color: 'var(--text-primary)',
            borderLeft: '1px solid var(--border)',
            zIndex: 101,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexShrink: 0,
            }}
          >
            <Dialog.Title
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 20,
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 6,
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-tertiary)',
                  display: 'inline-flex',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          {description && (
            <Dialog.Description
              id="admin-drawer-desc"
              style={{ position: 'absolute', left: -9999, top: -9999 }}
            >
              {description}
            </Dialog.Description>
          )}

          {/* Body */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 24 }}>{children}</div>

          {/* Footer */}
          {footer && (
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid var(--border)',
                background: 'var(--surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                flexShrink: 0,
              }}
            >
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
