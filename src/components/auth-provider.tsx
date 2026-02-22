'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/stores/app-store'
import type { Profile } from '@/types'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setOrganization, setWorkspace, setWorkspaces, logout } = useAppStore()

  useEffect(() => {
    // Guard: don't run if env vars are missing (build time)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return
    }

    // Dynamic import to avoid SSR issues
    import('@/lib/supabase').then(({ createClient }) => {
      const maybeSupabase = createClient()
      if (!maybeSupabase) return
      const supabase = maybeSupabase

      async function loadUserData(userId: string) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (!profile) return

        setUser(profile as Profile)

        if (profile.organization_id) {
          const { data: org } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', profile.organization_id)
            .single()

          if (org) setOrganization(org)

          const { data: workspaces } = await supabase
            .from('workspaces')
            .select('*')
            .eq('organization_id', profile.organization_id)
            .eq('is_active', true)
            .order('created_at', { ascending: true })

          if (workspaces && workspaces.length > 0) {
            setWorkspaces(workspaces)
            const currentWs = useAppStore.getState().currentWorkspace
            if (!currentWs || !workspaces.find(w => w.id === currentWs.id)) {
              setWorkspace(workspaces[0])
            }
          }
        }
      }

      // Check initial session
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          loadUserData(user.id)
        }
      })

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            loadUserData(session.user.id)
          } else if (event === 'SIGNED_OUT') {
            logout()
          }
        }
      )

      return () => {
        subscription.unsubscribe()
      }
    })
  }, [setUser, setOrganization, setWorkspace, setWorkspaces, logout])

  return <>{children}</>
}
