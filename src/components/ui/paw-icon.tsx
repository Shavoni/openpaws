import { cn } from '@/lib/utils'

interface PawIconProps {
  /** Width & height in pixels (default: 16) */
  size?: number
  /** Opacity 0-1 (default: 1) */
  opacity?: number
  /** Tailwind color class override — applies to fill via currentColor */
  className?: string
  /** Inline style overrides */
  style?: React.CSSProperties
  /** Accessible label — set to '' for decorative */
  label?: string
}

/**
 * Reusable paw print icon — single SVG used across the entire app.
 * Brand color: text-orange-500 (#f97316) by default.
 */
export function PawIcon({
  size = 16,
  opacity = 1,
  className,
  style,
  label,
}: PawIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('text-orange-500 shrink-0', className)}
      style={{ opacity, ...style }}
      role={label ? 'img' : 'presentation'}
      aria-label={label || undefined}
      aria-hidden={!label}
    >
      {/* Main pad */}
      <ellipse cx="12" cy="16" rx="4" ry="3.5" />
      {/* Toe beans */}
      <circle cx="7.5" cy="10" r="2" />
      <circle cx="16.5" cy="10" r="2" />
      <circle cx="5" cy="14" r="1.8" />
      <circle cx="19" cy="14" r="1.8" />
    </svg>
  )
}

/** Filled variant — solid paw for emphasis (today indicator, active states) */
export function PawIconFilled({
  size = 16,
  opacity = 1,
  className,
  style,
  label,
}: PawIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      stroke="none"
      className={cn('text-orange-500 shrink-0', className)}
      style={{ opacity, ...style }}
      role={label ? 'img' : 'presentation'}
      aria-label={label || undefined}
      aria-hidden={!label}
    >
      <ellipse cx="12" cy="16" rx="4" ry="3.5" />
      <circle cx="7.5" cy="10" r="2" />
      <circle cx="16.5" cy="10" r="2" />
      <circle cx="5" cy="14" r="1.8" />
      <circle cx="19" cy="14" r="1.8" />
    </svg>
  )
}

/** Spinning paw — replaces generic loading spinners */
export function PawSpinner({
  size = 16,
  className,
}: Pick<PawIconProps, 'size' | 'className'>) {
  return (
    <PawIconFilled
      size={size}
      className={cn('animate-spin', className)}
    />
  )
}

/** Paw with checkmark overlay — success state */
export function PawCheck({
  size = 20,
  className,
}: Pick<PawIconProps, 'size' | 'className'>) {
  return (
    <span className={cn('relative inline-flex items-center justify-center', className)}>
      <PawIconFilled size={size} className="text-green-500" />
      <svg
        viewBox="0 0 24 24"
        width={size * 0.5}
        height={size * 0.5}
        fill="none"
        stroke="white"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  )
}
