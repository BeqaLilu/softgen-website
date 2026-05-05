import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { uploadFile } from '@/lib/blob';

export const runtime = 'nodejs';

/**
 * Auth-gated file upload for admin (project covers, article covers,
 * team avatars, partner logos, TipTap inline images, CVs).
 *
 * Multipart body: `file` (File, required), `folder` (string, required).
 * Returns `{ ok, url, storage }`. 4MB cap unless folder=`cvs` (10MB).
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_multipart' }, { status: 400 });
  }

  const file = form.get('file');
  const folder = (form.get('folder') as string) || 'misc';

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ ok: false, error: 'file_missing' }, { status: 400 });
  }

  // Folders allowed by admin uploads. CVs get a higher cap.
  const allowedFolders = new Set(['projects', 'articles', 'team', 'partners', 'editor', 'cvs', 'pages', 'misc']);
  if (!allowedFolders.has(folder)) {
    return NextResponse.json({ ok: false, error: 'folder_not_allowed' }, { status: 400 });
  }
  const capMB = folder === 'cvs' ? 10 : 4;
  if (file.size > capMB * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: 'file_too_large', maxMB: capMB }, { status: 413 });
  }

  try {
    const r = await uploadFile(file, folder);
    return NextResponse.json({ ok: true, url: r.url, storage: r.storage }, { status: 201 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[api/admin/upload] failed', err);
    return NextResponse.json({ ok: false, error: 'upload_failed' }, { status: 500 });
  }
}
