'use client'

import { Settings } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/app-store'

export default function SettingsPage() {
  const { user, organization } = useAppStore()

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile */}
      <Card className="p-5 space-y-4">
        <h3 className="text-lg font-semibold font-display text-warm-800">Profile</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-warm-700">Full Name</label>
            <Input defaultValue={user?.full_name || ''} placeholder="Your name" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-warm-700">Email</label>
            <Input defaultValue={user?.email || ''} disabled className="opacity-60" />
          </div>
        </div>
        <Button size="sm">Update Profile</Button>
      </Card>

      {/* Organization */}
      <Card className="p-5 space-y-4">
        <h3 className="text-lg font-semibold font-display text-warm-800">Organization</h3>
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-warm-700">Organization Name</label>
          <Input defaultValue={organization?.name || ''} placeholder="Organization name" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-warm-700">Plan</label>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-orange-50 px-3 py-1 text-[13px] font-semibold text-orange-700 capitalize">
              {organization?.plan || 'starter'}
            </span>
            <Button variant="link" size="sm" className="text-[13px]">Upgrade</Button>
          </div>
        </div>
        <Button size="sm">Save Changes</Button>
      </Card>

      {/* Danger zone */}
      <Card className="border-red-200 p-5 space-y-4">
        <h3 className="text-lg font-semibold font-display text-red-700">Danger Zone</h3>
        <p className="text-sm text-warm-500">
          Deleting your account will remove all data permanently. This action cannot be undone.
        </p>
        <Button variant="destructive" size="sm">Delete Account</Button>
      </Card>
    </div>
  )
}
