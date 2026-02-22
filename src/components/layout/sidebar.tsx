'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  PawPrint,
  FileText,
  Calendar,
  BarChart3,
  Share2,
  Palette,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/ui-store'
import { useAppStore } from '@/stores/app-store'

const navItems = [
  { label: 'Content', href: '/content', icon: FileText },
  { label: 'Schedule', href: '/schedule', icon: Calendar },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Accounts', href: '/accounts', icon: Share2 },
  { label: 'Brand', href: '/brand', icon: Palette },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { user, currentWorkspace, logout } = useAppStore()

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}
        onClick={toggleSidebar}
      />

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-warm-200 bg-warm-50 transition-all duration-300 ease-in-out',
          sidebarCollapsed ? 'w-[72px]' : 'w-[260px]',
          // Mobile: slide-over drawer
          'max-lg:-translate-x-full max-lg:shadow-elevated',
          !sidebarCollapsed && 'max-lg:translate-x-0'
        )}
      >
        {/* Logo block */}
        <div className="flex h-14 items-center gap-2.5 border-b border-warm-200 px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500">
            <PawPrint className="h-4.5 w-4.5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <span className="text-lg font-bold text-warm-800 font-display">OpenPaws</span>
          )}
        </div>

        {/* Workspace switcher */}
        {!sidebarCollapsed && (
          <div className="border-b border-warm-200 px-3 py-3">
            <button className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-warm-100">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-[11px] font-bold text-orange-700">
                {currentWorkspace?.name?.[0]?.toUpperCase() || 'M'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-warm-800">
                  {currentWorkspace?.name || 'My Brand'}
                </p>
                <p className="text-[11px] text-warm-400">Workspace</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-warm-400" />
            </button>
          </div>
        )}

        {/* Main navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3 scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-orange-50 text-orange-700 font-semibold border-l-[3px] border-orange-500 pl-[9px]'
                    : 'text-warm-600 hover:bg-warm-100 hover:text-warm-800'
                )}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className={cn(
                  'h-[18px] w-[18px] shrink-0',
                  isActive ? 'text-orange-600' : 'text-warm-400 group-hover:text-warm-600'
                )} />
                {!sidebarCollapsed && item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-warm-200 p-2 space-y-1">
          <Link
            href="/settings"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-warm-600 transition-colors hover:bg-warm-100 hover:text-warm-800',
              pathname === '/settings' && 'bg-orange-50 text-orange-700 font-semibold border-l-[3px] border-orange-500 pl-[9px]'
            )}
            title={sidebarCollapsed ? 'Settings' : undefined}
          >
            <Settings className="h-[18px] w-[18px] shrink-0 text-warm-400" />
            {!sidebarCollapsed && 'Settings'}
          </Link>

          {/* User info */}
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[12px] font-bold text-orange-700">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-warm-800">
                  {user?.full_name || 'User'}
                </p>
                <p className="truncate text-[11px] text-warm-400">
                  {user?.role || 'owner'}
                </p>
              </div>
              <button
                onClick={() => logout()}
                className="rounded-md p-1 text-warm-400 transition-colors hover:bg-warm-100 hover:text-warm-600"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Collapse toggle */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-warm-500 transition-colors hover:bg-warm-100 hover:text-warm-700"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="h-[18px] w-[18px] shrink-0" />
            ) : (
              <>
                <PanelLeftClose className="h-[18px] w-[18px] shrink-0" />
                Collapse
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
