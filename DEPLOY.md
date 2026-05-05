# Softgen.ge — Deploy Runbook

**Audience:** the engineer deploying this on Softgen's server.

This document is the only thing you need to bring softgen.ge live on a real domain. Everything below assumes a Linux host with Docker + Docker Compose installed and the repo cloned. There is no separate build server, no CI, no Vercel — it's a plain `docker compose up -d` deploy.

---

## What you're deploying

| | |
|---|---|
| App | Next.js 15 (App Router, TypeScript strict, standalone output) |
| DB | Postgres 16 (Drizzle ORM) |
| Auth | next-auth credentials provider, JWT sessions |
| Public site | `/[lang]/...` for `en` (default) and `ka` |
| Admin panel | `/admin/*`, gated by middleware + server actions |
| File uploads | Local disk by default (`public/uploads`, mounted volume), Vercel Blob optional |
| Email | Resend optional — falls back to stdout logging |

---

## 1. First-time deploy

```bash
# 1. Clone + cd
git clone <repo> softgen-web && cd softgen-web

# 2. Copy + fill the env
cp .env.production.example .env.production
# Edit .env.production. At minimum:
#   - POSTGRES_PASSWORD
#   - NEXTAUTH_SECRET (generate: openssl rand -base64 32)
#   - NEXTAUTH_URL    (e.g. https://softgen.ge)
#   - SEED_ADMIN_PASSWORD

# 3. Build + start
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# 4. Wait for the app to be healthy
docker compose -f docker-compose.prod.yml --env-file .env.production ps
# expected: softgen-pg-prod (healthy), softgen-web-prod (healthy)

# 5. Apply schema + seed initial content
#    The runner image ships the .mjs versions (no pnpm/tsx in prod).
docker compose -f docker-compose.prod.yml --env-file .env.production exec app node db/migrate.mjs
docker compose -f docker-compose.prod.yml --env-file .env.production exec app node db/seed.mjs

# 6. Verify
curl http://localhost:3005/api/health
# {"ok":true,"db":"up", ...}

curl -I http://localhost:3005/en
# HTTP/1.1 200 OK
```

The app is now live on port 3005. Front it with nginx/Caddy/Traefik for TLS + the real domain (snippets below).

---

## 2. Reverse proxy + TLS

You'll terminate TLS at a reverse proxy and forward to `localhost:3005`. Two common options:

### Option A — Caddy (recommended, automatic Let's Encrypt)

Add to `/etc/caddy/Caddyfile`:

```caddy
softgen.ge {
    reverse_proxy localhost:3005
    encode gzip zstd
}

www.softgen.ge {
    redir https://softgen.ge{uri} permanent
}
```

Then `sudo systemctl reload caddy`. Caddy auto-fetches a TLS certificate via Let's Encrypt. Done.

### Option B — nginx (if you already run it)

```nginx
server {
    listen 80;
    server_name softgen.ge www.softgen.ge;
    return 301 https://softgen.ge$request_uri;
}

server {
    listen 443 ssl http2;
    server_name softgen.ge;

    ssl_certificate     /etc/letsencrypt/live/softgen.ge/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/softgen.ge/privkey.pem;

    # Next.js bumps client connections frequently; keep the upstream pool warm.
    location / {
        proxy_pass http://127.0.0.1:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }
}
```

Run `certbot --nginx -d softgen.ge -d www.softgen.ge` to get the cert.

---

## 3. Routine operations

### Logs

```bash
# Tail app logs (Next.js stdout)
docker compose -f docker-compose.prod.yml --env-file .env.production logs -f app

# Tail Postgres logs
docker compose -f docker-compose.prod.yml --env-file .env.production logs -f postgres
```

### Update to a new release

```bash
git pull
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build app
# Migrations on every deploy (idempotent — does nothing if schema unchanged).
docker compose -f docker-compose.prod.yml --env-file .env.production exec app node db/migrate.mjs
```

> The Postgres container is **not** rebuilt by `up -d --build app` — only the `app` service is. Data persists in the `softgen-pg-prod-data` volume.

### Backup the database

```bash
# Snapshot to a file on the host
docker compose -f docker-compose.prod.yml --env-file .env.production exec -T postgres \
  pg_dump -U softgen softgen | gzip > softgen-$(date +%F).sql.gz

# Restore (DESTRUCTIVE — only on a fresh DB)
gunzip -c softgen-2026-05-03.sql.gz | \
  docker compose -f docker-compose.prod.yml --env-file .env.production exec -T postgres \
    psql -U softgen softgen
```

Wire this into cron:

```cron
0 3 * * *  cd /opt/softgen-web && docker compose -f docker-compose.prod.yml --env-file .env.production exec -T postgres pg_dump -U softgen softgen | gzip > /var/backups/softgen/db-$(date +\%F).sql.gz
```

### Backup uploaded files

If running with the disk fallback (no `BLOB_READ_WRITE_TOKEN`), the named volume `softgen-uploads` holds CVs and images. Back up via:

```bash
docker run --rm -v softgen-web_softgen-uploads:/data -v $(pwd):/backup alpine \
  tar czf /backup/uploads-$(date +%F).tar.gz -C /data .
```

For zero-effort backups, switch to Vercel Blob (set `BLOB_READ_WRITE_TOKEN` in `.env.production` and rebuild — uploads then bypass the volume).

### Open a psql shell

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production exec postgres \
  psql -U softgen -d softgen
```

### Reset an admin password

```bash
# Generate a bcrypt hash on the host (cost 10 matches lib/auth.ts)
docker compose -f docker-compose.prod.yml --env-file .env.production exec app \
  node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 10))" 'NewPassword123'
# Copy the printed hash, then:
docker compose -f docker-compose.prod.yml --env-file .env.production exec postgres \
  psql -U softgen -d softgen -c "UPDATE users SET password_hash='<paste>' WHERE email='levan@softgen.ge';"
```

---

## 4. Things to do before go-live

- [ ] Set strong `POSTGRES_PASSWORD` in `.env.production`
- [ ] Generate `NEXTAUTH_SECRET` with `openssl rand -base64 32`
- [ ] Set `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to the real https URL
- [ ] Set `SEED_ADMIN_PASSWORD` to something strong, sign in once, then change it from `/admin/users` and remove `SEED_ADMIN_PASSWORD` from `.env.production`
- [ ] Get a `RESEND_API_KEY` (free tier: 3 000 emails/month). Without it, contact-form / job-application emails are only logged to stdout.
- [ ] Verify domain ownership in Resend so emails go from `hello@softgen.ge` not the resend.dev sandbox domain.
- [ ] (Optional) Set `BLOB_READ_WRITE_TOKEN` if you'll run multiple app instances behind a load balancer. Single-instance deploys can keep the disk fallback.
- [ ] Adjust the daily backup cron to a path that's actually backed up off-host.
- [ ] Confirm `https://softgen.ge/api/health` returns `{"ok":true,"db":"up"}` from outside the network.
- [ ] Confirm `https://softgen.ge/sitemap.xml` and `https://softgen.ge/robots.txt` return the right hosts.
- [ ] Submit `https://softgen.ge/sitemap.xml` to Google Search Console.

---

## 5. Troubleshooting

| Symptom | Fix |
|---|---|
| `softgen-web-prod` is `unhealthy`, logs say `DATABASE_URL is not set` | Check `.env.production` exists and `--env-file .env.production` is in the compose command |
| 500 on every page after a deploy | `docker compose -f docker-compose.prod.yml --env-file .env.production logs app \| tail -50` — usually a missing env var |
| Login at `/admin/login` gives "Invalid credentials" but you're sure of the password | Either the seed didn't run (`pnpm db:seed`), or the user really has a different hash. See "Reset an admin password" above |
| `/api/health` returns 503 with `db_error` | Postgres container is down or unreachable. Check `docker compose ps postgres` and its logs |
| New articles edited in admin don't show up on `/news` immediately | Per-list pages are cached for 60 s in `lib/dbContent.ts`. Either wait, or wire a `revalidateTag('articles')` call into the admin save action |
| Container can't write to `/app/public/uploads` | Volume permissions — ensure the named volume isn't bound to a host path with restrictive ownership |
| Image too large / build slow | The `.next/cache` is in the build context; if the local repo has a stale `.next/`, run `rm -rf .next` before `docker compose up --build` |

---

## 6. Architecture quick-reference

```
┌─────────────────────────────────────────────────────────────────┐
│                        softgen.ge (TLS)                         │
│                              │                                  │
│                  Caddy / nginx (host network)                   │
│                              │ http://localhost:3005            │
│  ┌───────────────────────────┴──────────────────────────────┐   │
│  │  docker network: softgen-web_default (internal only)     │   │
│  │                                                          │   │
│  │   ┌─────────────────┐         ┌──────────────────────┐  │   │
│  │   │ softgen-web-prod │  ───►  │ softgen-pg-prod      │  │   │
│  │   │  (Next.js)       │  5432  │  (postgres:16)       │  │   │
│  │   │  port 3005       │        │  vol: softgen-pg-... │  │   │
│  │   │  vol: uploads    │        └──────────────────────┘  │   │
│  │   └─────────────────┘                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Outbound from softgen-web-prod:                                │
│   - api.resend.com  (transactional email, when key is set)      │
│   - blob.vercel-storage.com (file uploads, when token is set)   │
└─────────────────────────────────────────────────────────────────┘
```

Code locations the dev cares about:
- `app/[lang]/*` — public pages, all RSC + Drizzle queries via `lib/dbContent.ts`
- `app/admin/*` — admin panel, all server actions in `actions.ts` next to each page
- `lib/auth.ts` — next-auth config + JWT shape (sessions are JWT, not DB-backed)
- `lib/email.ts`, `lib/blob.ts` — Resend + Vercel Blob with the dev fallbacks
- `lib/settings.ts` — runtime accessor for `pages.settings` (notify-to, SEO defaults)
- `db/schema.ts` — Drizzle schema; edit + `pnpm db:push` to migrate
- `Dockerfile`, `docker-compose.prod.yml` — what you're reading this doc for

For anything else, see [`NEXT_STEPS.md`](./NEXT_STEPS.md) which catalogues every Phase of the build.
