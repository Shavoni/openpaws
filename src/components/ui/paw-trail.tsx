'use client'

import { PawPrint } from 'lucide-react'

interface PawTrailProps {
  /** Number of paw prints */
  count?: number
  /** Base opacity (0-1) */
  opacity?: number
  /** Color class */
  color?: string
  /** Layout variant */
  variant?: 'scattered' | 'diagonal' | 'trail' | 'corner'
}

// Deterministic positions so they don't shift on re-render
const scatteredPositions = [
  { top: '8%', left: '5%', rotate: -25, scale: 0.7 },
  { top: '15%', right: '12%', rotate: 40, scale: 0.5 },
  { top: '35%', left: '88%', rotate: -10, scale: 0.6 },
  { top: '55%', left: '3%', rotate: 30, scale: 0.55 },
  { top: '70%', right: '8%', rotate: -35, scale: 0.8 },
  { top: '85%', left: '15%', rotate: 15, scale: 0.5 },
  { top: '45%', left: '50%', rotate: -20, scale: 0.45 },
  { top: '92%', right: '25%', rotate: 45, scale: 0.6 },
]

const diagonalPositions = [
  { top: '5%', left: '10%', rotate: 35, scale: 0.6 },
  { top: '20%', left: '25%', rotate: 40, scale: 0.55 },
  { top: '35%', left: '40%', rotate: 35, scale: 0.65 },
  { top: '50%', left: '55%', rotate: 30, scale: 0.5 },
  { top: '65%', left: '70%', rotate: 38, scale: 0.6 },
  { top: '80%', left: '85%', rotate: 42, scale: 0.55 },
]

const trailPositions = [
  { top: '10%', left: '20%', rotate: -15, scale: 0.5 },
  { top: '10%', left: '30%', rotate: 15, scale: 0.5 },
  { top: '25%', left: '38%', rotate: -15, scale: 0.55 },
  { top: '25%', left: '48%', rotate: 15, scale: 0.55 },
  { top: '40%', left: '55%', rotate: -15, scale: 0.6 },
  { top: '40%', left: '65%', rotate: 15, scale: 0.6 },
]

const cornerPositions = [
  { bottom: '8%', right: '3%', rotate: -20, scale: 0.8 },
  { bottom: '18%', right: '8%', rotate: 15, scale: 0.6 },
  { bottom: '5%', right: '16%', rotate: -35, scale: 0.5 },
]

const positionSets = {
  scattered: scatteredPositions,
  diagonal: diagonalPositions,
  trail: trailPositions,
  corner: cornerPositions,
}

export function PawTrail({
  count,
  opacity = 0.06,
  color = 'text-orange-400',
  variant = 'scattered',
}: PawTrailProps) {
  const positions = positionSets[variant]
  const paws = positions.slice(0, count ?? positions.length)

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none" aria-hidden="true">
      {paws.map((pos, i) => {
        const style: React.CSSProperties = {
          opacity,
          transform: `rotate(${pos.rotate}deg) scale(${pos.scale})`,
          width: '3rem',
          height: '3rem',
        }
        if ('top' in pos) style.top = pos.top
        if ('bottom' in pos) style.bottom = pos.bottom
        if ('left' in pos) style.left = pos.left
        if ('right' in pos) style.right = pos.right

        return (
          <PawPrint
            key={i}
            className={`absolute ${color}`}
            style={style}
          />
        )
      })}
    </div>
  )
}
