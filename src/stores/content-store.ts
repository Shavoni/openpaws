import { create } from 'zustand'
import type { Post } from '@/types'

interface ContentState {
  posts: Post[]
  selectedPost: Post | null
  isLoading: boolean
  filter: {
    status?: string
    platform?: string
    sourceType?: string
  }

  setPosts: (posts: Post[]) => void
  setSelectedPost: (post: Post | null) => void
  setLoading: (loading: boolean) => void
  setFilter: (filter: Partial<ContentState['filter']>) => void
}

export const useContentStore = create<ContentState>()((set) => ({
  posts: [],
  selectedPost: null,
  isLoading: false,
  filter: {},

  setPosts: (posts) => set({ posts }),
  setSelectedPost: (post) => set({ selectedPost: post }),
  setLoading: (isLoading) => set({ isLoading }),
  setFilter: (filter) => set((state) => ({ filter: { ...state.filter, ...filter } })),
}))
