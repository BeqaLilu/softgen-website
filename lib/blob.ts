/**
 * File upload. Per build-prompt §"Stack": Vercel Blob.
 *
 * Detects `BLOB_READ_WRITE_TOKEN` and dynamically imports `@vercel/blob`
 * only if present (so the package is optional in dev). Falls back to a
 * local-disk write under `public/uploads/` so dev works without setup;
 * the disk fallback returns a public path the browser can fetch.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

export type UploadResult = { url: string; storage: 'blob' | 'disk' };

export async function uploadFile(file: File, folder: string): Promise<UploadResult> {
  const safeName = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import('@vercel/blob');
    const blob = await put(safeName, file, {
      access: 'public',
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return { url: blob.url, storage: 'blob' };
  }

  // Disk fallback — writes under public/uploads. Fine for local dev.
  const buffer = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), 'public', 'uploads', folder);
  await fs.mkdir(dir, { recursive: true });
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  await fs.writeFile(path.join(dir, filename), buffer);
  return { url: `/uploads/${folder}/${filename}`, storage: 'disk' };
}
