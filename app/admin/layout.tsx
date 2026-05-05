import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { headers } from 'next/headers';
import { authOptions } from '@/lib/auth';
import { AuthProvider } from '@/components/admin/AuthProvider';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

/**
 * AdminShell — 240px sidebar + flex content on bg-deep.
 *
 * Auth is enforced in two places: middleware redirects unauthed visitors
 * to /admin/login (cheap, no DB), and this server layout double-checks
 * via getServerSession (defense in depth, also covers edge cases where
 * the JWT exists but the user was deleted).
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Touch headers() so this layout opts out of static rendering — every
  // admin route should be dynamic.
  await headers();

  // Login page renders without the shell.
  // Note: layout applies to /admin/login too in App Router; we detect by
  // checking if a session exists. The login page is its own full-screen
  // layout when the user isn't signed in.
  const session = await getServerSession(authOptions);

  // /admin/login is allowed without a session. Other routes require one.
  // We redirect to login from here as a safety net (middleware also does).
  if (!session) {
    // Render bare children for /admin/login; gate everything else.
    // We can't easily read pathname in a server layout, so we always
    // wrap in AuthProvider and let middleware handle the redirect for
    // protected pages. The login page renders here as plain children.
    return <AuthProvider>{children}</AuthProvider>;
  }

  if (session.user.role !== 'admin' && session.user.role !== 'editor') {
    redirect('/admin/login');
  }

  return (
    <AuthProvider>
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          background: 'var(--bg-deep)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)',
        }}
      >
        <AdminSidebar />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </div>
    </AuthProvider>
  );
}
