import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'ai'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

const buttonVariants: Record<string, string> = {
  default: 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 shadow-sm hover:shadow-md',
  destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  outline: 'bg-white border border-warm-200 hover:border-warm-300 text-warm-700 hover:bg-warm-50 active:bg-warm-100',
  secondary: 'bg-warm-100 text-warm-700 hover:bg-warm-200 active:bg-warm-300',
  ghost: 'bg-transparent hover:bg-warm-100 active:bg-warm-200 text-warm-600 hover:text-warm-800',
  link: 'text-orange-500 underline-offset-4 hover:underline',
  ai: 'bg-gradient-to-r from-orange-500 to-ai-500 hover:from-orange-600 hover:to-ai-600 text-white shadow-ai-glow hover:shadow-ai-glow-hover',
}

const sizeVariants: Record<string, string> = {
  default: 'h-10 px-4 py-2.5 text-sm',
  sm: 'h-9 px-3 py-1.5 text-[13px]',
  lg: 'h-11 px-6 py-3 text-base',
  icon: 'h-9 w-9',
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          buttonVariants[variant],
          sizeVariants[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
