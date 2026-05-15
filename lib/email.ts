/**
 * Email send. Per build-prompt §"Stack": Resend.
 *
 * Falls back to console.log when RESEND_API_KEY is missing in development.
 * Production must have Resend configured; otherwise callers get `ok: false`
 * and private mail bodies are not written to stdout.
 */

import { Resend } from 'resend';

export type EmailParams = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

const FROM = process.env.EMAIL_FROM ?? 'Softgen <hello@softgen.ge>';
const KEY = process.env.RESEND_API_KEY;

let _client: Resend | null = null;
function client(): Resend | null {
  if (!KEY) return null;
  if (!_client) _client = new Resend(KEY);
  return _client;
}

export async function sendEmail({ to, subject, html, replyTo }: EmailParams): Promise<{ ok: boolean; id?: string }> {
  const c = client();
  if (!c) {
    if (process.env.NODE_ENV === 'production') {
      // eslint-disable-next-line no-console
      console.error('[email] RESEND_API_KEY is required in production');
      return { ok: false };
    }
    // eslint-disable-next-line no-console
    console.log('[email:fallback]', { to, subject, replyTo, htmlPreview: html.slice(0, 200) });
    return { ok: true, id: 'console-fallback' };
  }
  try {
    const result = await c.emails.send({
      from: FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      replyTo,
    });
    if (result.error) {
      // eslint-disable-next-line no-console
      console.error('[email] send failed', result.error);
      return { ok: false };
    }
    return { ok: true, id: result.data?.id };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[email] threw', err);
    return { ok: false };
  }
}

/** Tiny HTML escape for interpolating user input into mail templates. */
export function esc(s: string | null | undefined): string {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
