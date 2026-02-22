'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { PawTrail } from '@/components/ui/paw-trail'
import { useUIStore } from '@/stores/ui-store'
import { cn } from '@/lib/utils'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useUIStore()

  return (
    <div className="relative min-h-screen bg-warm-25">
      {/* Paw prints scattered across the dashboard background */}
      <PawTrail variant="scattered" opacity={0.035} color="text-orange-300" />

      <Sidebar />
      <Header />

      {/* Main content area */}
      <main
        className={cn(
          'relative z-10 pt-14 transition-all duration-300',
          sidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'
        )}
      >
        <div className="px-6 py-6">
          {children}
        </div>
      </main>
    </div>
  )
}
