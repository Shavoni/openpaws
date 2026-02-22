'use client'

import { ExternalLink, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface SetupInfo {
  platform: string
  envVars: string[]
  developerPortalUrl: string
  setupInstructions: string[]
}

interface PlatformSetupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  setupInfo: SetupInfo | null
}

export function PlatformSetupDialog({ open, onOpenChange, setupInfo }: PlatformSetupDialogProps) {
  const [copied, setCopied] = useState<string | null>(null)

  if (!setupInfo) return null

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
  const redirectUri = `${appUrl}/api/accounts/connect/${setupInfo.platform.toLowerCase().replace(' / ', '').replace(' ', '')}/callback`

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Setup {setupInfo.platform}</DialogTitle>
          <DialogDescription>
            OAuth credentials are needed to connect this platform. Follow the steps below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Setup steps */}
          <div className="space-y-2">
            <p className="text-[13px] font-semibold text-warm-700">Steps</p>
            <ol className="list-decimal pl-5 space-y-1.5">
              {setupInfo.setupInstructions.map((step, i) => (
                <li key={i} className="text-[13px] text-warm-600 leading-relaxed">{step}</li>
              ))}
            </ol>
          </div>

          {/* Redirect URI to copy */}
          <div className="space-y-1.5">
            <p className="text-[13px] font-semibold text-warm-700">Redirect URI</p>
            <div className="flex items-center gap-2 rounded-lg border border-warm-200 bg-warm-50 px-3 py-2">
              <code className="flex-1 text-[12px] text-warm-600 break-all">{redirectUri}</code>
              <button
                onClick={() => copyToClipboard(redirectUri, 'uri')}
                className="shrink-0 rounded p-1 hover:bg-warm-100 transition-colors"
              >
                {copied === 'uri' ? (
                  <Check className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-warm-400" />
                )}
              </button>
            </div>
          </div>

          {/* Env vars needed */}
          <div className="space-y-1.5">
            <p className="text-[13px] font-semibold text-warm-700">Environment Variables</p>
            <div className="space-y-1">
              {setupInfo.envVars.map((envVar) => (
                <div
                  key={envVar}
                  className="flex items-center gap-2 rounded-lg border border-warm-200 bg-warm-50 px-3 py-2"
                >
                  <code className="flex-1 text-[12px] text-warm-600">{envVar}=</code>
                  <button
                    onClick={() => copyToClipboard(envVar, envVar)}
                    className="shrink-0 rounded p-1 hover:bg-warm-100 transition-colors"
                  >
                    {copied === envVar ? (
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-warm-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Developer portal link */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open(setupInfo.developerPortalUrl, '_blank')}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open Developer Portal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
