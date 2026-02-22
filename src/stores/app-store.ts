import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile, Workspace, Organization } from '@/types'

interface AppState {
  user: Profile | null
  organization: Organization | null
  currentWorkspace: Workspace | null
  workspaces: Workspace[]
  isAuthenticated: boolean

  setUser: (user: Profile | null) => void
  setOrganization: (org: Organization | null) => void
  setWorkspace: (workspace: Workspace | null) => void
  setWorkspaces: (workspaces: Workspace[]) => void
  logout: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      organization: null,
      currentWorkspace: null,
      workspaces: [],
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setOrganization: (organization) => set({ organization }),
      setWorkspace: (workspace) => set({ currentWorkspace: workspace }),
      setWorkspaces: (workspaces) => set({ workspaces }),
      logout: () => set({
        user: null,
        organization: null,
        currentWorkspace: null,
        workspaces: [],
        isAuthenticated: false,
      }),
    }),
    {
      name: 'openpaws-storage',
    }
  )
)
