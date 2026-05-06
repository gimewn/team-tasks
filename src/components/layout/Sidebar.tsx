'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboardIcon,
  ClipboardListIcon,
  UsersIcon,
  BarChart3Icon,
  LeafIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', icon: LayoutDashboardIcon, label: '대시보드' },
  { href: '/tasks', icon: ClipboardListIcon, label: '일감 관리' },
  { href: '/members', icon: UsersIcon, label: '팀원', disabled: true },
  { href: '/reports', icon: BarChart3Icon, label: '리포트', disabled: true },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <aside className="flex flex-col w-64 shrink-0 bg-sidebar text-sidebar-foreground h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="size-8 rounded-lg bg-sidebar-accent flex items-center justify-center">
          <LeafIcon className="size-4 text-olive-300" />
        </div>
        <div>
          <div className="text-sm font-bold text-white leading-none">Team Tasks</div>
          <div className="text-[11px] text-olive-300 mt-0.5">일감 관리 시스템</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label, disabled }) => (
          <Link
            key={href}
            href={disabled ? '#' : href}
            onClick={(e) => disabled && e.preventDefault()}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
              disabled
                ? 'text-sidebar-foreground/30 cursor-not-allowed'
                : isActive(href)
                ? 'bg-sidebar-accent text-white'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white'
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span>{label}</span>
            {disabled && (
              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-sidebar-border text-sidebar-foreground/40">
                준비 중
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="size-7 rounded-full bg-vpink-400 flex items-center justify-center text-white text-xs font-bold">
            YJ
          </div>
          <div>
            <div className="text-xs font-semibold text-white leading-none">YJ Team</div>
            <div className="text-[11px] text-olive-300 mt-0.5">5명의 팀원</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
