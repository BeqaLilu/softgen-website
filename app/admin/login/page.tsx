'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Logo } from '@/components/brand/Logo';

export default function AdminLoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const callback = sp.get('callbackUrl') || '/admin';
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await signIn('credentials', {
      email: String(fd.get('email') ?? ''),
      password: String(fd.get('password') ?? ''),
      redirect: false,
    });
    setPending(false);
    if (res?.ok) {
      router.push(callback);
      router.refresh();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-deep)',
        padding: 32,
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 420,
          padding: 40,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          background: 'var(--surface)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo lang="en" />
          <span
            className="chip"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              padding: '4px 10px',
            }}
          >
            ADMIN
          </span>
        </div>

        <div>
          <h2 className="h2" style={{ fontSize: 26, marginBottom: 8 }}>
            Sign in
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Use the credentials your admin invited you with.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              background: 'rgba(232, 123, 111, 0.12)',
              border: '1px solid rgba(232, 123, 111, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: '#e87b6f',
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                fontSize: 13,
                color: 'var(--text-secondary)',
              }}
            >
              Email
            </span>
            <input
              className="input"
              type="email"
              name="email"
              autoComplete="username"
              required
              autoFocus
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                fontSize: 13,
                color: 'var(--text-secondary)',
              }}
            >
              Password
            </span>
            <input
              className="input"
              type="password"
              name="password"
              autoComplete="current-password"
              required
            />
          </label>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ marginTop: 6 }}
            disabled={pending}
          >
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}
