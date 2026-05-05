/**
 * Drizzle schema for softgen.ge.
 *
 * Source of truth: handoff/pages.md §"Database schema". Bilingual strings
 * are stored as JSONB `{ en, ka }`. Long-form bodies (TipTap JSON) are
 * stored as JSONB too. Slugs are the natural key for content tables.
 */

import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  date,
} from 'drizzle-orm/pg-core';

/* ─────────────────────────── Users ─────────────────────────── */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  name: text('name'),
  role: text('role').notNull(), // 'admin' | 'editor'
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

/* ─────────────────────────── Projects ─────────────────────────── */
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').unique().notNull(),
  title: jsonb('title').notNull(),                  // { en, ka }
  category: text('category').notNull(),             // FinTech | Government | Security | Enterprise
  year: integer('year').notNull(),
  client: text('client'),
  duration: jsonb('duration'),                      // { en, ka }
  scope: jsonb('scope'),                            // { en, ka }
  team: text('team'),
  summary: jsonb('summary'),                        // { en, ka }
  body: jsonb('body'),                              // { en: BodyBlock[], ka: BodyBlock[] }
  coverUrl: text('cover_url'),
  accent: text('accent'),                           // indigo | violet | plum
  coverStyle: text('cover_style').default('dashboard').notNull(), // dashboard | network | ledger | identity | workflow
  tags: text('tags').array(),
  related: text('related').array(),                 // slugs
  featured: boolean('featured').default(false).notNull(),
  published: boolean('published').default(false).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

/* ─────────────────────────── Articles ─────────────────────────── */
export const articles = pgTable('articles', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').unique().notNull(),
  category: text('category').notNull(),             // engineering | company | security | case
  title: jsonb('title').notNull(),
  excerpt: jsonb('excerpt'),
  body: jsonb('body'),
  authorId: uuid('author_id').references(() => users.id),
  authorName: text('author_name'),                  // denormalized for seed simplicity
  readTime: integer('read_time'),
  date: date('date'),
  coverUrl: text('cover_url'),
  accent: text('accent'),                           // indigo | violet | plum
  featured: boolean('featured').default(false).notNull(),
  published: boolean('published').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

/* ─────────────────────────── Services ─────────────────────────── */
export const services = pgTable('services', {
  slug: text('slug').primaryKey(),
  num: text('num').notNull(),                       // "01" .. "04"
  title: jsonb('title').notNull(),
  tagline: jsonb('tagline'),
  body: jsonb('body'),
  capabilities: jsonb('capabilities'),              // Bi[]
  related: text('related').array(),
  displayOrder: integer('display_order').default(0).notNull(),
});

/* ─────────────────────────── Team members ─────────────────────────── */
export const teamMembers = pgTable('team_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  role: jsonb('role').notNull(),
  since: integer('since'),
  bio: jsonb('bio'),
  avatarUrl: text('avatar_url'),
  displayOrder: integer('display_order').default(0).notNull(),
  visible: boolean('visible').default(true).notNull(),
});

/* ─────────────────────────── Partners ─────────────────────────── */
export const partners = pgTable('partners', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  logoUrl: text('logo_url'),
  displayOrder: integer('display_order').default(0).notNull(),
});

/* ─────────────────────────── Jobs ─────────────────────────── */
export const jobs = pgTable('jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').unique().notNull(),
  title: jsonb('title').notNull(),
  department: text('department').notNull(),         // Engineering | Design | Operations
  type: text('type').notNull(),                     // full_time | part_time | contract
  location: text('location'),
  description: jsonb('description'),
  body: jsonb('body'),
  open: boolean('open').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

/* ─────────────────────────── Leads (CRM) ─────────────────────────── */
export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email'),
  phone: text('phone'),
  company: text('company'),
  message: text('message'),
  source: text('source'),                            // 'contact_form' | 'careers' | 'manual'
  status: text('status').default('new').notNull(),  // new | contacted | qualified | lost
  notes: jsonb('notes').default([]).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

/* ─────────────────────────── Job applications ─────────────────────────── */
export const jobApplications = pgTable('job_applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobSlug: text('job_slug').references(() => jobs.slug),
  name: text('name'),
  email: text('email'),
  phone: text('phone'),
  cvUrl: text('cv_url'),
  coverNote: text('cover_note'),
  status: text('status').default('new').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

/* ─────────────────────────── Pages (static copy) ─────────────────────────── */
export const pages = pgTable('pages', {
  slug: text('slug').primaryKey(),                  // 'home' | 'about' | 'services' | 'contact'
  content: jsonb('content').notNull(),
});

/* ─────────────────────────── Type exports ─────────────────────────── */
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type Service = typeof services.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type JobApplication = typeof jobApplications.$inferSelect;
export type User = typeof users.$inferSelect;
