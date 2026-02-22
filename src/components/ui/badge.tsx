import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' | 'draft' | 'scheduled' | 'published' | 'failed' | 'pending' | 'ai'
}

const badgeVariants: Record<string, string> = {
  default: 'bg-orange-500 text-white',
  secondary: 'bg-warm-100 text-warm-600',
  destructive: 'bg-red-50 text-red-700',
  outline: 'text-warm-700 border border-warm-200',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-yellow-50 text-yellow-700',
  info: 'bg-blue-50 text-blue-700',
  draft: 'bg-warm-100 text-warm-600',
  scheduled: 'bg-blue-50 text-blue-700',
  published: 'bg-green-50 text-green-700',
  failed: 'bg-red-50 text-red-700',
  pending: 'bg-yellow-50 text-yellow-700',
  ai: 'bg-ai-50 text-ai-700 border border-ai-100',
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide transition-colors',
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
