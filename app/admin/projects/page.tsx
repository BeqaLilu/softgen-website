import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { ProjectsClient } from '@/components/admin/ProjectsClient';
import { AdminTopbar } from '@/components/admin/AdminTopbar';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  let rows;
  try {
    rows = await db
      .select({
        id: projects.id,
        slug: projects.slug,
        title: projects.title,
        category: projects.category,
        year: projects.year,
        client: projects.client,
        duration: projects.duration,
        scope: projects.scope,
        team: projects.team,
        summary: projects.summary,
        body: projects.body,
        coverUrl: projects.coverUrl,
        accent: projects.accent,
        coverStyle: projects.coverStyle,
        tags: projects.tags,
        featured: projects.featured,
        published: projects.published,
      })
      .from(projects)
      .orderBy(sql`${projects.displayOrder} asc, ${projects.year} desc`);
  } catch (err) {
    return (
      <>
        <AdminTopbar title="Projects" />
        <div style={{ padding: 32 }}>
          <div
            className="card"
            style={{
              padding: 24,
              background: 'rgba(232, 123, 111, 0.08)',
              borderColor: 'rgba(232, 123, 111, 0.3)',
            }}
          >
            <h3 className="h3" style={{ fontSize: 18, marginBottom: 8 }}>
              Database not connected
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              {err instanceof Error ? err.message : 'unknown'}
            </p>
          </div>
        </div>
      </>
    );
  }

  return <ProjectsClient rows={rows} />;
}
