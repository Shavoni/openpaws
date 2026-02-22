import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SocialAccount, SocialPlatform } from '@/types'

interface SocialAccountsState {
  accounts: SocialAccount[]
  addAccount: (account: SocialAccount) => void
  removeAccount: (id: string) => void
  getByPlatform: (platform: SocialPlatform) => SocialAccount | undefined
  isConnected: (platform: SocialPlatform) => boolean
}

export const useSocialAccountsStore = create<SocialAccountsState>()(
  persist(
    (set, get) => ({
      accounts: [],

      addAccount: (account) =>
        set((state) => ({
          accounts: [
            // Replace existing account for same platform, or append
            ...state.accounts.filter((a) => a.platform !== account.platform),
            account,
          ],
        })),

      removeAccount: (id) =>
        set((state) => ({
          accounts: state.accounts.filter((a) => a.id !== id),
        })),

      getByPlatform: (platform) =>
        get().accounts.find((a) => a.platform === platform),

      isConnected: (platform) =>
        get().accounts.some((a) => a.platform === platform && a.is_active),
    }),
    {
      name: 'openpaws-social-accounts',
    }
  )
)
