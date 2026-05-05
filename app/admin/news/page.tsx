import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { articles } from '@/db/schema';
import { ArticlesClient } from '@/components/admin/ArticlesClient';
import { AdminTopbar } from '@/components/admin/AdminTopbar';

export const dynamic = 'force-dynamic';

export default async function AdminNewsPage() {
  let rows;
  try {
    rows = await db
      .select({
        id: articles.id,
        slug: articles.slug,
        category: articles.category,
        title: articles.title,
        excerpt: articles.excerpt,
        body: articles.body,
        authorName: articles.authorName,
        readTime: articles.readTime,
        date: articles.date,
        coverUrl: articles.coverUrl,
        accent: articles.accent,
        featured: articles.featured,
        published: articles.published,
      })
      .from(articles)
      .orderBy(sql`${articles.date} desc nulls last, ${articles.createdAt} desc`);
  } catch (err) {
    return (
      <>
        <AdminTopbar title="News" />
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

  return <ArticlesClient rows={rows} />;
}
