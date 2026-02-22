'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Share2, Instagram, Linkedin, Twitter, Facebook, Youtube, Music, Trash2, PawPrint,
} from 'lucide-react'
import { PawIcon } from '@/components/ui/paw-icon'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ConnectButton } from '@/components/accounts/connect-button'
import { useSocialAccountsStore } from '@/stores/social-accounts-store'
import type { SocialPlatform } from '@/types'

const platformMeta: Record<SocialPlatform, {
  name: string
  icon: typeof Instagram
  color: string
  bgColor: string
}> = {
  instagram: { name: 'Instagram', icon: Instagram, color: '#E4405F', bgColor: 'bg-pink-50' },
  facebook: { name: 'Facebook', icon: Facebook, color: '#1877F2', bgColor: 'bg-blue-50' },
  twitter: { name: 'Twitter / X', icon: Twitter, color: '#1DA1F2', bgColor: 'bg-sky-50' },
  linkedin: { name: 'LinkedIn', icon: Linkedin, color: '#0A66C2', bgColor: 'bg-blue-50' },
  youtube: { name: 'YouTube', icon: Youtube, color: '#FF0000', bgColor: 'bg-red-50' },
  tiktok: { name: 'TikTok', icon: Music, color: '#000000', bgColor: 'bg-gray-50' },
}

const ALL_PLATFORMS: SocialPlatform[] = ['instagram', 'facebook', 'twitter', 'linkedin', 'youtube', 'tiktok']

export default function AccountsPage() {
  const searchParams = useSearchParams()
  const { accounts, removeAccount, isConnected } = useSocialAccountsStore()
  const [justConnected, setJustConnected] = useState<string | null>(null)

  // Handle ?connected=platform from fallback redirect
  useEffect(() => {
    const connected = searchParams.get('connected')
    if (connected) {
      setJustConnected(connected)
      // Try to read account from cookie (fallback path)
      try {
        const cookieMatch = document.cookie.match(new RegExp(`oauth_account_${connected}=([^;]+)`))
        if (cookieMatch) {
          const accountData = JSON.parse(decodeURIComponent(cookieMatch[1]))
          useSocialAccountsStore.getState().addAccount({
            ...accountData,
            workspace_id: '',
            scopes: [],
            platform_metadata: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          // Clear the cookie
          document.cookie = `oauth_account_${connected}=; max-age=0; path=/`
        }
      } catch {
        // Cookie may have expired or been malformed
      }

      // Clear the flash after 3 seconds
      const timer = setTimeout(() => setJustConnected(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  const connectedAccounts = accounts.filter((a) => a.is_active)
  const availablePlatforms = ALL_PLATFORMS.filter((p) => !isConnected(p))

  return (
    <div className="space-y-8">
      {/* Connected accounts */}
      <div>
        <h3 className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wide text-warm-500 mb-4">
          <PawIcon size={12} className="text-orange-400" opacity={0.6} />
          Connected
        </h3>

        {connectedAccounts.length === 0 ? (
          <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-warm-200 bg-warm-50/50 py-12 text-center animate-fade-in-up overflow-hidden">
            {/* Paw prints — mascot was here */}
            <PawPrint className="absolute top-4 left-6 h-6 w-6 text-orange-300 opacity-[0.12] rotate-[-25deg]" aria-hidden="true" />
            <PawPrint className="absolute top-8 left-16 h-5 w-5 text-orange-300 opacity-[0.09] rotate-[20deg]" aria-hidden="true" />
            <PawPrint className="absolute bottom-6 right-8 h-7 w-7 text-orange-300 opacity-[0.1] rotate-[35deg]" aria-hidden="true" />
            <PawPrint className="absolute bottom-10 right-20 h-5 w-5 text-orange-300 opacity-[0.07] rotate-[-10deg]" aria-hidden="true" />
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
              <Share2 className="h-8 w-8 text-orange-400" />
            </div>
            <h2 className="text-lg font-bold font-display text-warm-800">
              No accounts connected
            </h2>
            <p className="mt-2 max-w-sm text-sm text-warm-500">
              Connect your first social account to start posting.
              It takes 30 seconds.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {connectedAccounts.map((account) => {
              const meta = platformMeta[account.platform]
              const Icon = meta.icon
              const isNew = justConnected === account.platform

              return (
                <Card
                  key={account.id}
                  className={`p-5 transition-all duration-200 animate-fade-in-up ${
                    isNew ? 'ring-2 ring-green-400 ring-offset-2' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        {account.avatar_url ? (
                          <AvatarImage src={account.avatar_url} alt={account.account_name} />
                        ) : null}
                        <AvatarFallback>
                          <Icon className="h-5 w-5" style={{ color: meta.color }} />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-[15px] font-semibold text-warm-800">
                          {account.account_name}
                        </p>
                        <div className="flex items-center gap-2">
                          {account.account_username && (
                            <p className="text-[13px] text-warm-400">
                              @{account.account_username}
                            </p>
                          )}
                          <Badge variant="success" className="text-[10px]">Connected</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-md ${meta.bgColor}`}>
                        <Icon className="h-3.5 w-3.5" style={{ color: meta.color }} />
                      </div>
                      <span className="text-[12px] text-warm-500">{meta.name}</span>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-warm-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => removeAccount(account.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Disconnect
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Available to connect */}
      {availablePlatforms.length > 0 && (
        <div>
          <h3 className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wide text-warm-500 mb-4">
            <PawIcon size={12} className="text-orange-400" opacity={0.6} />
            Available to Connect
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {availablePlatforms.map((platformId) => {
              const meta = platformMeta[platformId]
              const Icon = meta.icon

              return (
                <Card
                  key={platformId}
                  className="p-5 transition-all duration-200 hover:border-warm-300 hover:shadow-md animate-fade-in-up"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${meta.bgColor}`}>
                        <Icon className="h-6 w-6" style={{ color: meta.color }} />
                      </div>
                      <div>
                        <p className="text-[15px] font-semibold text-warm-800">{meta.name}</p>
                        <p className="text-[13px] text-warm-400">Not connected</p>
                      </div>
                    </div>
                  </div>
                  <ConnectButton platform={platformId} />
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
