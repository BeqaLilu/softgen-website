# Softgen Website

Production-ready Next.js website and admin CMS for softgen.ge.

## Quick Start

```bash
pnpm install
pnpm dev
```

The dev server runs on http://localhost:3005.

## Production Handoff

Use these files for deployment:

- `DEPLOY.md` - server runbook and go-live checklist
- `.env.production.example` - required production environment variables
- `docker-compose.prod.yml` - production Postgres + Next.js services
- `Dockerfile` - standalone Next.js production image

The production container does not include the full dev toolchain. Run database setup inside the app container with:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production exec app node db/migrate.mjs
docker compose -f docker-compose.prod.yml --env-file .env.production exec app node db/seed.mjs
```

Do not commit real `.env` files, tokens, database dumps, or local backup folders.
