'use client';

import { useState, useTransition, type FormEvent } from 'react';
import { appendLeadNote } from '@/app/admin/leads/actions';

export type Note = { body: string; by: string; at: string };

export function NotesPanel({
  id,
  notes,
}: {
  id: string;
  notes: Note[];
}) {
  const [pending, start] = useTransition();
  const [text, setText] = useState('');

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return;
    const value = text;
    setText('');
    start(async () => {
      await appendLeadNote(id, value);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h3
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-tertiary)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        Notes
      </h3>

      {notes.length === 0 ? (
        <p style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>No notes yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[...notes].reverse().map((n, i) => (
            <li
              key={i}
              style={{
                padding: 12,
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-soft)',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ fontSize: 14, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{n.body}</div>
              <div
                style={{
                  marginTop: 8,
                  display: 'flex',
                  gap: 8,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--text-tertiary)',
                }}
              >
                <span>{n.by}</span>
                <span>·</span>
                <span>{new Date(n.at).toLocaleString()}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <textarea
          className="textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a note (e.g. called, sent intro, asked for budget)…"
          rows={3}
          disabled={pending}
        />
        <button
          type="submit"
          className="btn btn-primary btn-sm"
          style={{ alignSelf: 'flex-start' }}
          disabled={pending || !text.trim()}
        >
          {pending ? 'Adding…' : 'Add note'}
        </button>
      </form>
    </div>
  );
}
