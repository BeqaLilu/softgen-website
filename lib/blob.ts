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
export type UploadFolder = 'projects' | 'articles' | 'team' | 'partners' | 'editor' | 'cvs' | 'pages' | 'misc';

const IMAGE_FOLDERS = new Set<UploadFolder>(['projects', 'articles', 'team', 'partners', 'editor', 'pages', 'misc']);
const IMAGE_EXTENSIONS = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.webp']);

export const UPLOAD_FOLDERS: UploadFolder[] = ['projects', 'articles', 'team', 'partners', 'editor', 'cvs', 'pages', 'misc'];

function extension(file: File): string {
  return path.extname(file.name).toLowerCase();
}

export async function validateUploadFile(file: File, folder: UploadFolder): Promise<string | null> {
  if (IMAGE_FOLDERS.has(folder)) {
    if (!file.type.startsWith('image/') || !IMAGE_EXTENSIONS.has(extension(file))) {
      return 'file_type_not_allowed';
    }
    return null;
  }

  if (folder === 'cvs') {
    if (file.type !== 'application/pdf' || extension(file) !== '.pdf') {
      return 'cv_must_be_pdf';
    }

    const signature = Buffer.from(await file.slice(0, 5).arrayBuffer()).toString('utf8');
    if (signature !== '%PDF-') {
      return 'cv_invalid_pdf';
    }
  }

  return null;
}

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
