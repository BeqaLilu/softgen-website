# Multi-stage build for softgen.ge (Next.js 15 + standalone output).
#
# Final image is ~150 MB, runs `node server.js` as a non-root user.
# Tools shipped alongside the standalone bundle so prod ops stay simple:
#   - node db/migrate.mjs   →  apply pending SQL migrations
#   - node db/seed.mjs      →  load CONTENT into a fresh DB
#
# Sized for a single-instance VPS deploy. Scaling horizontally requires
# (a) replacing the local-disk uploads fallback with Vercel Blob/S3 and
# (b) putting Postgres behind an internal hostname (handled in docker-compose.prod.yml).

# ─── 1. deps stage — install once, share node_modules ─────────────────────────
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ─── 2. builder stage — full build with Next standalone output ────────────────
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Snapshot of bilingual CONTENT — read by db/seed.mjs at runtime.
RUN pnpm exec tsx scripts/build-content-snapshot.mjs

# `next.config.mjs` sets output:'standalone' — emits .next/standalone with
# only the files actually traced from the build.
RUN pnpm build

# ─── 3. runner stage — minimal Linux + Node + standalone artifact ─────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3005
ENV HOSTNAME=0.0.0.0

# Drop root.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 --ingroup nodejs nextjs

# Standalone output — self-contained server bundle.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Migration + seed tools (plain .mjs, no tsx required at runtime).
# Next standalone trace bundles `postgres` + `bcryptjs` into webpack chunks
# inside .next/server, not as discoverable npm packages — so the .mjs
# scripts can't `import` them. Add a minimal node_modules tree alongside
# that has only what the scripts need (~3 MB).
COPY --from=builder --chown=nextjs:nodejs /app/db/migrations ./db/migrations
COPY --from=builder --chown=nextjs:nodejs /app/db/migrate.mjs ./db/migrate.mjs
COPY --from=builder --chown=nextjs:nodejs /app/db/seed.mjs ./db/seed.mjs
COPY --from=builder --chown=nextjs:nodejs /app/content/static.json ./content/static.json

RUN npm install --no-audit --no-fund --omit=dev --prefix=/tmp/dbtools \
      postgres@3.4.9 bcryptjs@3.0.3 \
 && cp -R /tmp/dbtools/node_modules/postgres /app/node_modules/ \
 && cp -R /tmp/dbtools/node_modules/bcryptjs /app/node_modules/ \
 && rm -rf /tmp/dbtools \
 && chown -R nextjs:nodejs /app/node_modules/postgres /app/node_modules/bcryptjs

# Writable directory for the local-disk blob fallback when BLOB_READ_WRITE_TOKEN
# is not set. docker-compose.prod.yml mounts a named volume here so uploads
# survive container restarts.
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public/uploads

USER nextjs

EXPOSE 3005

# Lightweight healthcheck — `/api/health` is a JSON probe (200 = OK).
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3005/api/health >/dev/null || exit 1

CMD ["node", "server.js"]
