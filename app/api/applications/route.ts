import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { jobApplications, jobs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendEmail, esc } from '@/lib/email';
import { uploadFile } from '@/lib/blob';
import { getSettings } from '@/lib/settings';

export const runtime = 'nodejs';

const TextFields = z.object({
  job_slug: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  cover: z.string().min(20),
});

/**
 * Multipart form: text fields + optional `cv` File. CV is stored via
 * lib/blob (Vercel Blob in prod, local disk in dev). Confirmation
 * email goes to applicant + notification email to careers@.
 */
export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_multipart' }, { status: 400 });
  }

  const fields = TextFields.safeParse({
    job_slug: form.get('job_slug'),
    name: form.get('name'),
    email: form.get('email'),
    phone: form.get('phone') ?? undefined,
    cover: form.get('cover'),
  });
  if (!fields.success) {
    return NextResponse.json(
      { ok: false, error: 'validation', issues: fields.error.issues },
      { status: 422 }
    );
  }
  const data = fields.data;

  // Optional CV upload (per components.md the field can be a URL or a file).
  let cvUrl: string | null = (form.get('cv_url') as string) || null;
  const cv = form.get('cv');
  if (cv instanceof File && cv.size > 0) {
    if (cv.size > 10 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: 'cv_too_large' }, { status: 413 });
    }
    try {
      const up = await uploadFile(cv, 'cvs');
      cvUrl = up.url;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[api/applications] cv upload failed', err);
      return NextResponse.json({ ok: false, error: 'cv_upload_failed' }, { status: 500 });
    }
  }

  try {
    // Verify the job exists; if not we still accept the application but
    // we don't FK it. Leaving job_slug nullable in schema covers it.
    const job = (await db.select({ slug: jobs.slug, title: jobs.title }).from(jobs).where(eq(jobs.slug, data.job_slug)))[0];

    const [row] = await db
      .insert(jobApplications)
      .values({
        jobSlug: job ? data.job_slug : null,
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        cvUrl,
        coverNote: data.cover,
        status: 'new',
      })
      .returning({ id: jobApplications.id });

    const jobTitle =
      job && typeof job.title === 'object' && job.title && 'en' in (job.title as Record<string, unknown>)
        ? ((job.title as { en: string }).en)
        : data.job_slug;

    // Notify careers — address from /admin/settings, env-var fallback.
    const settings = await getSettings();
    const careersTo =
      settings.general.careersEmail || process.env.APPLICATION_NOTIFY_TO || 'careers@softgen.ge';
    void sendEmail({
      to: careersTo,
      replyTo: data.email,
      subject: `New application: ${data.name} → ${jobTitle}`,
      html: `
        <h2>New application — ${esc(jobTitle)}</h2>
        <p><strong>Name:</strong> ${esc(data.name)}<br/>
           <strong>Email:</strong> ${esc(data.email)}<br/>
           ${data.phone ? `<strong>Phone:</strong> ${esc(data.phone)}<br/>` : ''}
           ${cvUrl ? `<strong>CV:</strong> <a href="${esc(cvUrl)}">${esc(cvUrl)}</a><br/>` : ''}
        </p>
        <h3>Cover note</h3>
        <p style="white-space:pre-wrap">${esc(data.cover)}</p>
        <p><a href="${process.env.NEXTAUTH_URL ?? ''}/admin/applications/${row.id}">Open in admin</a></p>
      `,
    });

    // Confirmation to applicant
    void sendEmail({
      to: data.email,
      subject: `Got your application — ${jobTitle}`,
      html: `
        <p>Hi ${esc(data.name.split(' ')[0])},</p>
        <p>We received your application for <strong>${esc(jobTitle)}</strong> at Softgen.</p>
        <p>We respond within one business day. If you don't hear back, write directly to careers@softgen.ge.</p>
        <p>— Softgen</p>
      `,
    });

    return NextResponse.json({ ok: true, id: row.id }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
    if (msg.includes('DATABASE_URL')) {
      return NextResponse.json({ ok: false, error: 'database_not_configured', message: msg }, { status: 503 });
    }
    // eslint-disable-next-line no-console
    console.error('[api/applications] failed', err);
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 });
  }
}
