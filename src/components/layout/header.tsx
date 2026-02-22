'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  Search,
  Plus,
  Bell,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/ui-store'
import { useAppStore } from '@/stores/app-store'
import { Button } from '@/components/ui/button'
import { useState, useRef, useEffect } from 'react'

const pageTitles: Record<string, string> = {
  '/content': 'Content',
  '/content/create': 'Create Post',
  '/schedule': 'Schedule',
  '/analytics': 'Analytics',
  '/accounts': 'Connected Accounts',
  '/brand': 'Brand Voice',
  '/settings': 'Settings',
}

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { user, logout } = useAppStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Derive page title from path
  const title = pageTitles[pathname] || 'Dashboard'

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U'

  // Close user menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }
  }, [showUserMenu])

  async function handleLogout() {
    setShowUserMenu(false)
    logout()
    // Dynamic import to avoid SSR issues
    const { createClient } = await import('@/lib/supabase')
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-40 flex h-14 items-center justify-between border-b border-warm-200 bg-white px-6 transition-all duration-300',
        sidebarCollapsed ? 'left-[72px]' : 'left-[260px]',
        'max-lg:left-0'
      )}
    >
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Mobile hamburger */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden rounded-lg p-2 text-warm-500 hover:bg-warm-100 hover:text-warm-700 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="text-[28px] font-bold font-display text-warm-800 leading-tight">
          {title}
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-warm-500 transition-colors hover:bg-warm-100 hover:text-warm-700">
          <Search className="h-[18px] w-[18px]" />
        </button>

        {/* Create Post CTA */}
        <Button
          size="sm"
          onClick={() => router.push('/content/create')}
          className="hidden sm:inline-flex"
        >
          <Plus className="h-4 w-4" />
          Create Post
        </Button>
        <Button
          size="icon"
          onClick={() => router.push('/content/create')}
          className="sm:hidden h-9 w-9"
        >
          <Plus className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-warm-500 transition-colors hover:bg-warm-100 hover:text-warm-700">
          <Bell className="h-[18px] w-[18px]" />
          {/* Unread indicator dot */}
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-500" />
        </button>

        {/* User avatar + dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-warm-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-[12px] font-bold text-orange-700">
              {initials}
            </div>
            <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-warm-400" />
          </button>

          {/* Dropdown menu */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-warm-200 bg-white p-1 shadow-elevated animate-scale-in">
              <div className="border-b border-warm-100 px-3 py-2.5 mb-1">
                <p className="text-[13px] font-semibold text-warm-800">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-[12px] text-warm-400 truncate">
                  {user?.email || ''}
                </p>
              </div>
              <button
                onClick={() => { setShowUserMenu(false); router.push('/settings') }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-warm-600 transition-colors hover:bg-warm-100 hover:text-warm-800"
              >
                <Settings className="h-4 w-4 text-warm-400" />
                Settings
              </button>
              <button
                onClick={() => { setShowUserMenu(false); router.push('/settings') }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-warm-600 transition-colors hover:bg-warm-100 hover:text-warm-800"
              >
                <User className="h-4 w-4 text-warm-400" />
                Profile
              </button>
              <div className="my-1 border-t border-warm-100" />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
