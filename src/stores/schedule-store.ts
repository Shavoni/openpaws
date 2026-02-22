import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SocialPlatform } from '@/types'

export type ScheduleStatus = 'draft' | 'scheduled' | 'published' | 'failed'

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'custom'

export interface ScheduledPost {
  id: string
  platforms: SocialPlatform[]
  content: string
  scheduledAt: string // ISO datetime
  timeOfDay: TimeOfDay
  status: ScheduleStatus
  mediaUrls?: string[]
  createdAt: string
  updatedAt: string
}

interface ScheduleState {
  posts: ScheduledPost[]

  addPost: (post: Omit<ScheduledPost, 'id' | 'createdAt' | 'updatedAt'>) => ScheduledPost
  updatePost: (id: string, updates: Partial<Omit<ScheduledPost, 'id' | 'createdAt'>>) => void
  removePost: (id: string) => void
  getPostById: (id: string) => ScheduledPost | undefined
  getPostsByDate: (dateStr: string) => ScheduledPost[]
  getPostsByMonth: (year: number, month: number) => ScheduledPost[]
  getPostsByStatus: (status: ScheduleStatus) => ScheduledPost[]
}

function generateId(): string {
  return `sp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      posts: [],

      addPost: (postData) => {
        const now = new Date().toISOString()
        const newPost: ScheduledPost = {
          ...postData,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({ posts: [...state.posts, newPost] }))
        return newPost
      },

      updatePost: (id, updates) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        })),

      removePost: (id) =>
        set((state) => ({ posts: state.posts.filter((p) => p.id !== id) })),

      getPostById: (id) =>
        get().posts.find((p) => p.id === id),

      getPostsByDate: (dateStr) => {
        // dateStr format: "YYYY-MM-DD"
        return get().posts.filter((p) => p.scheduledAt.startsWith(dateStr))
      },

      getPostsByMonth: (year, month) => {
        const prefix = `${year}-${String(month + 1).padStart(2, '0')}`
        return get().posts.filter((p) => p.scheduledAt.startsWith(prefix))
      },

      getPostsByStatus: (status) =>
        get().posts.filter((p) => p.status === status),
    }),
    {
      name: 'openpaws-schedule',
    }
  )
)
