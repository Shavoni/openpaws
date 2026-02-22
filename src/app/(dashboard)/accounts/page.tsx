'use client'

import { Share2, Instagram, Linkedin, Twitter, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const availablePlatforms = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F', bgColor: 'bg-pink-50' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0A66C2', bgColor: 'bg-blue-50' },
  { id: 'twitter', name: 'Twitter / X', icon: Twitter, color: '#1DA1F2', bgColor: 'bg-sky-50' },
]

export default function AccountsPage() {
  return (
    <div className="space-y-8">
      {/* Connected accounts — empty for now */}
      <div>
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-warm-500 mb-4">
          Connected
        </h3>
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-warm-200 bg-warm-50/50 py-12 text-center animate-fade-in-up">
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
      </div>

      {/* Available to connect */}
      <div>
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-warm-500 mb-4">
          Available to Connect
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {availablePlatforms.map((platform) => {
            const Icon = platform.icon
            return (
              <Card
                key={platform.id}
                className="p-5 transition-all duration-200 hover:border-warm-300 hover:shadow-md animate-fade-in-up"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${platform.bgColor}`}>
                      <Icon className="h-6 w-6" style={{ color: platform.color }} />
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-warm-800">{platform.name}</p>
                      <p className="text-[13px] text-warm-400">Not connected</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-4 w-full">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Connect
                </Button>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
