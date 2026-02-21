import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  organization_id: string
}

interface Workspace {
  id: string
  name: string
  organization_id: string
}

interface AppState {
  user: User | null
  currentWorkspace: Workspace | null
  isAuthenticated: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setWorkspace: (workspace: Workspace | null) => void
  logout: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      currentWorkspace: null,
      isAuthenticated: false,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setWorkspace: (workspace) => set({ currentWorkspace: workspace }),
      logout: () => set({ user: null, currentWorkspace: null, isAuthenticated: false }),
    }),
    {
      name: 'openpaws-storage',
    }
  )
)
