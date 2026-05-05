'use client';

import { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';

/**
 * Dashed-border drop zone. Posts the file to /api/admin/upload (auth-gated)
 * and writes the returned public URL into the parent state.
 *
 * Per components.md §`FileUpload`/`ImageDropzone`:
 * 100% width, dashed 1.5px border-strong, radius-lg, padding 40, centered
 * content; on hover border becomes solid primary, bg primary-soft.
 */
export function FileUpload({
  value,
  onChange,
  folder,
  accept = 'image/png,image/jpeg,image/webp',
  maxMB = 4,
  hint,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
  accept?: string;
  maxMB?: number;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [hover, setHover] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    if (file.size > maxMB * 1024 * 1024) {
      setError(`File too large (max ${maxMB}MB).`);
      return;
    }
    setError(null);
    setPending(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const json = (await res.json()) as { ok: boolean; url?: string; error?: string };
      if (json.ok && json.url) {
        onChange(json.url);
      } else {
        setError(json.error ?? 'Upload failed.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setPending(false);
    }
  };

  const onPick = () => inputRef.current?.click();

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setHover(false);
    const f = e.dataTransfer.files?.[0];
    if (f) void upload(f);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {value ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: 12,
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-soft)',
          }}
        >
          {accept.includes('image') && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="upload preview"
              style={{
                width: 80,
                height: 60,
                objectFit: 'cover',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-deep)',
              }}
            />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {value}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
              <button
                type="button"
                onClick={onPick}
                className="link-underline"
                style={{ fontSize: 13, padding: 0, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => onChange(null)}
                style={{ fontSize: 13, color: 'var(--danger)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={onPick}
          onDragOver={(e) => {
            e.preventDefault();
            setHover(true);
          }}
          onDragLeave={() => setHover(false)}
          onDrop={onDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onPick();
          }}
          style={{
            width: '100%',
            border: `1.5px dashed ${hover ? 'var(--primary)' : 'var(--border-strong)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: 40,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            background: hover ? 'var(--primary-soft)' : 'transparent',
            cursor: pending ? 'wait' : 'pointer',
            transition: 'background 150ms, border-color 150ms',
          }}
        >
          <UploadCloud size={32} color="var(--primary)" />
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center' }}>
            {pending ? (
              'Uploading…'
            ) : (
              <>
                {hint ?? `Drop a file up to ${maxMB}MB, or `}
                <span className="link-underline" style={{ display: 'inline' }}>
                  browse
                </span>
              </>
            )}
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void upload(f);
          // reset so re-picking the same file fires onChange
          e.target.value = '';
        }}
      />

      {error && <div style={{ fontSize: 13, color: 'var(--danger)' }}>{error}</div>}
    </div>
  );
}
