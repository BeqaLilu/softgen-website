ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "cover_style" text DEFAULT 'dashboard' NOT NULL;
