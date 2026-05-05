import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { SettingsClient } from '@/components/admin/SettingsClient';
import { loadSettings } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');
  // Settings are admin-only.
  if (session.user.role !== 'admin') redirect('/admin');

  const settings = await loadSettings();

  return (
    <>
      <AdminTopbar title="Settings" />
      <SettingsClient initial={settings} />
    </>
  );
}
