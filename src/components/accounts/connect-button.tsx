'use client'

import { useState, useEffect, useCallback } from 'react'
import { ExternalLink, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PlatformSetupDialog } from './platform-setup-dialog'
import { useSocialAccountsStore } from '@/stores/social-accounts-store'
import type { SocialPlatform, SocialAccount } from '@/types'

interface ConnectButtonProps {
  platform: SocialPlatform
  onConnected?: (account: SocialAccount) => void
}

export function ConnectButton({ platform, onConnected }: ConnectButtonProps) {
  const [loading, setLoading] = useState(false)
  const [setupOpen, setSetupOpen] = useState(false)
  const [setupInfo, setSetupInfo] = useState<{
    platform: string
    envVars: string[]
    developerPortalUrl: string
    setupInstructions: string[]
  } | null>(null)

  const addAccount = useSocialAccountsStore((s) => s.addAccount)

  const handleOAuthMessage = useCallback(
    (event: MessageEvent) => {
      if (event.data?.type !== 'oauth_callback') return
      if (event.data.platform !== platform) return

      setLoading(false)

      if (event.data.error) {
        console.error(`OAuth error for ${platform}:`, event.data.error)
        return
      }

      if (event.data.account) {
        const account: SocialAccount = {
          ...event.data.account,
          workspace_id: '',
          scopes: [],
          platform_metadata: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        addAccount(account)
        onConnected?.(account)
      }
    },
    [platform, addAccount, onConnected]
  )

  useEffect(() => {
    window.addEventListener('message', handleOAuthMessage)
    return () => window.removeEventListener('message', handleOAuthMessage)
  }, [handleOAuthMessage])

  const handleClick = async () => {
    setLoading(true)

    try {
      // Check if platform credentials are configured
      const res = await fetch(`/api/accounts/connect/${platform}/config`)
      const configData = await res.json()

      if (!configData.configured) {
        // Show setup dialog instead of OAuth
        setSetupInfo({
          platform: configData.platform,
          envVars: configData.envVars,
          developerPortalUrl: configData.developerPortalUrl,
          setupInstructions: configData.setupInstructions,
        })
        setSetupOpen(true)
        setLoading(false)
        return
      }

      // Open OAuth in popup
      const width = 600
      const height = 700
      const left = window.screenX + (window.outerWidth - width) / 2
      const top = window.screenY + (window.outerHeight - height) / 2

      const popup = window.open(
        `/api/accounts/connect/${platform}`,
        `oauth_${platform}`,
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`
      )

      // Poll to detect if popup was closed without completing
      const pollTimer = setInterval(() => {
        if (popup?.closed) {
          clearInterval(pollTimer)
          setLoading(false)
        }
      }, 500)
    } catch (err) {
      console.error('Failed to initiate OAuth:', err)
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="mt-4 w-full"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <ExternalLink className="h-3.5 w-3.5" />
        )}
        {loading ? 'Connecting...' : 'Connect'}
      </Button>

      <PlatformSetupDialog
        open={setupOpen}
        onOpenChange={setSetupOpen}
        setupInfo={setupInfo}
      />
    </>
  )
}
