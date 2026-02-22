import { create } from 'zustand'

interface UIState {
  sidebarCollapsed: boolean
  activeModal: string | null

  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  openModal: (modal: string) => void
  closeModal: () => void
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarCollapsed: false,
  activeModal: null,

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
}))
