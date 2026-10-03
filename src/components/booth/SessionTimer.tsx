'use client'

import { useState, useEffect } from 'react'

interface SessionTimerProps {
  expiresAt: Date | string
  onExpired: () => void
}

export function SessionTimer({ expiresAt, onExpired }: SessionTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0)

  useEffect(() => {
    const target = new Date(expiresAt).getTime()

    const updateTimer = () => {
      const now = Date.now()
      const remaining = Math.max(0, target - now)
      setTimeLeft(remaining)

      if (remaining <= 0) {
        onExpired()
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [expiresAt, onExpired])

  const minutes = Math.floor(timeLeft / 60000)
  const seconds = Math.floor((timeLeft % 60000) / 1000)

  const isWarning = timeLeft < 2 * 60 * 1000 // less than 2 minutes
  const isCritical = timeLeft < 30 * 1000 // less than 30 seconds

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${
        isCritical
          ? 'bg-red-500 text-white animate-pulse'
          : isWarning
          ? 'bg-orange-400 text-white'
          : 'bg-white/90 text-gray-700 shadow-md'
      }`}
    >
      <span className="text-lg">⏱️</span>
      <span className="font-mono text-lg">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  )
}
