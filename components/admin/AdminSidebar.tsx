'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  FolderKanban,
  Newspaper,
  Users,
  Building2,
  FileText,
  Inbox,
  Briefcase,
  Settings,
  UserCog,
  LogOut,
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';

const GROUPS: Array<{
  label: string;
  items: Array<{ href: string; icon: React.ComponentType<{ size?: number }>; label: string }>;
}> = [
  {
    label: 'CONTENT',
    items: [
      { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/admin/projects', icon: FolderKanban, label: 'Projects' },
      { href: '/admin/news', icon: Newspaper, label: 'News' },
      { href: '/admin/jobs', icon: Briefcase, label: 'Jobs' },
      { href: '/admin/team', icon: Users, label: 'Team' },
      { href: '/admin/partners', icon: Building2, label: 'Partners' },
      { href: '/admin/pages', icon: FileText, label: 'Pages' },
    ],
  },
  {
    label: 'ENGAGEMENT',
    items: [
      { href: '/admin/leads', icon: Inbox, label: 'Leads' },
      { href: '/admin/applications', icon: Briefcase, label: 'Applications' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { href: '/admin/users', icon: UserCog, label: 'Users' },
      { href: '/admin/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname() ?? '/admin';
  const { data: session } = useSession();

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Logo lang="en" />
        <span
          className="chip"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            padding: '3px 8px',
            letterSpacing: '0.08em',
          }}
        >
          ADMIN
        </span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
        {GROUPS.map((g) => (
          <div key={g.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-tertiary)',
                letterSpacing: '0.12em',
                marginBottom: 4,
                paddingLeft: 8,
              }}
            >
              {g.label}
            </div>
            {g.items.map((it) => {
              const Icon = it.icon;
              const active = isActive(it.href);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 500,
                    fontSize: 14,
                    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: active ? 'var(--primary-soft)' : 'transparent',
                    borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent',
                    paddingLeft: active ? 9 : 12,
                    transition: 'background 150ms, color 150ms',
                  }}
                >
                  <Icon size={16} />
                  {it.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div
        style={{
          borderTop: '1px solid var(--border)',
          paddingTop: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 999,
            background: 'linear-gradient(135deg, var(--primary), var(--purple-400))',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 12,
          }}
        >
          {(session?.user?.name ?? 'A')[0]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 13,
              color: 'var(--text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {session?.user?.name ?? 'Admin'}
          </div>
          <div style={{ color: 'var(--text-tertiary)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
            {session?.user?.role ?? 'admin'}
          </div>
        </div>
        <button
          suppressHydrationWarning
          type="button"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          aria-label="Sign out"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-tertiary)',
            padding: 6,
            borderRadius: 'var(--radius-md)',
            display: 'inline-flex',
            cursor: 'pointer',
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
