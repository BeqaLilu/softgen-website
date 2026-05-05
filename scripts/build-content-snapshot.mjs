// Emit content/static.json from content/static.ts so the prod-image seed
// runner (db/seed.mjs) can read it without TypeScript or the standalone
// bundle. Run as part of `pnpm build` and inside the Docker builder stage.
//
// node scripts/build-content-snapshot.mjs

import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');

// Use tsx loader if available; otherwise rely on a direct dynamic import once
// content/static.ts is compiled. We invoke this script from `tsx` in the build
// flow (added as a dep already), so the dynamic import works.
const mod = await import(pathToFileURL(path.join(root, 'content', 'static.ts')).href);
const out = path.join(root, 'content', 'static.json');
writeFileSync(out, JSON.stringify(mod.CONTENT, null, 0));
console.log(`wrote ${out} (${(JSON.stringify(mod.CONTENT).length / 1024).toFixed(1)}kb)`);
