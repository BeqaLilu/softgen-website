import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { leads } from '@/db/schema';
import { sendEmail, esc } from '@/lib/email';
import { getSettings } from '@/lib/settings';

export const runtime = 'nodejs';

const LeadSchema = z.object({
  name: z.string().min(1, 'name is required'),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, 'message is too short'),
  source: z.string().optional(),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'validation', issues: parsed.error.issues },
      { status: 422 }
    );
  }
  const data = parsed.data;

  // Insert. If DATABASE_URL is missing we surface a clear 503 — better
  // than a 500 with no actionable message during pre-deployment dev.
  try {
    const [row] = await db
      .insert(leads)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        company: data.company ?? null,
        message: data.message,
        source: data.source ?? 'contact_form',
        status: 'new',
      })
      .returning({ id: leads.id });

    // Notify sales — fire and don't block on failure.
    // Address comes from /admin/settings (editable at runtime), with env-var
    // fallback for first-boot before settings are populated.
    const settings = await getSettings();
    const notifyTo = settings.general.salesEmail || process.env.LEAD_NOTIFY_TO || 'sales@softgen.ge';
    void sendEmail({
      to: notifyTo,
      replyTo: data.email,
      subject: `New lead: ${data.name}${data.company ? ` (${data.company})` : ''}`,
      html: `
        <h2>New lead</h2>
        <p><strong>Name:</strong> ${esc(data.name)}<br/>
           <strong>Email:</strong> ${esc(data.email)}<br/>
           ${data.phone ? `<strong>Phone:</strong> ${esc(data.phone)}<br/>` : ''}
           ${data.company ? `<strong>Company:</strong> ${esc(data.company)}<br/>` : ''}
        </p>
        <h3>Message</h3>
        <p style="white-space:pre-wrap">${esc(data.message)}</p>
        <p><a href="${process.env.NEXTAUTH_URL ?? ''}/admin/leads/${row.id}">Open in admin</a></p>
      `,
    });

    return NextResponse.json({ ok: true, id: row.id }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
    if (msg.includes('DATABASE_URL')) {
      return NextResponse.json({ ok: false, error: 'database_not_configured', message: msg }, { status: 503 });
    }
    // eslint-disable-next-line no-console
    console.error('[api/leads] failed', err);
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 });
  }
}
