'use client';

import { useState, type FormEvent } from 'react';
import { Field } from '@/components/forms/Field';
import { t } from '@/content/static';
import type { Locale } from '@/i18n/routing';

type Errors = Partial<Record<'name' | 'email' | 'message' | 'submit', string | true>>;

export function ContactForm({ lang }: { lang: Locale }) {
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(
      new FormData(e.currentTarget) as unknown as Iterable<[string, string]>
    );

    const errs: Errors = {};
    if (!data.name) errs.name = true;
    if (!data.email || !/.+@.+\..+/.test(data.email)) errs.email = true;
    if (!data.message || data.message.length < 10) errs.message = true;
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setPending(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'contact_form' }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (json.ok) {
        setSubmitted(true);
      } else if (json.error === 'database_not_configured') {
        setErrors({ submit: lang === 'en'
          ? 'Backend not configured yet — set DATABASE_URL in .env.local.'
          : 'სერვერი ჯერ არ არის კონფიგურირებული — დააყენე DATABASE_URL.' });
      } else {
        setErrors({ submit: lang === 'en' ? 'Send failed. Try again or email hello@softgen.ge.' : 'გაგზავნა ვერ მოხერხდა.' });
      }
    } catch {
      setErrors({ submit: lang === 'en' ? 'Network error. Try again.' : 'ქსელის შეცდომა.' });
    } finally {
      setPending(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            background: 'var(--primary-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            color: 'var(--primary)',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="h3" style={{ fontSize: 22 }}>
          {lang === 'en' ? 'Message received' : 'შეტყობინება მიღებულია'}
        </h3>
        <p style={{ color: 'var(--text-secondary)' }}>{t(lang, 'contact.form.success')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h3 className="h3" style={{ fontSize: 22, marginBottom: 8 }}>
        {lang === 'en' ? 'Send us a message' : 'მოგვწერეთ'}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field name="name" type="text" label={t(lang, 'contact.form.name')} error={!!errors.name} required />
        <Field name="email" type="email" label={t(lang, 'contact.form.email')} error={!!errors.email} required />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field name="phone" type="tel" label={t(lang, 'contact.form.phone')} />
        <Field name="company" type="text" label={t(lang, 'contact.form.company')} />
      </div>
      <Field name="message" type="textarea" label={t(lang, 'contact.form.message')} error={!!errors.message} required />
      {errors.submit && (
        <div style={{ color: 'var(--danger)', fontSize: 14 }}>{String(errors.submit)}</div>
      )}
      <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: 8 }} disabled={pending}>
        {pending
          ? (lang === 'en' ? 'Sending…' : 'იგზავნება…')
          : t(lang, 'contact.form.submit')}
      </button>
    </form>
  );
}
