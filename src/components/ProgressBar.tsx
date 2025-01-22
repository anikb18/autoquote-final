'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ProgressBarProps {
  total: number
  remaining: number
  className?: string
}

export function ProgressBar({ total, remaining, className = '' }: ProgressBarProps) {
  const { t } = useTranslation('common')
  const [width, setWidth] = useState(0)
  
  useEffect(() => {
    const percentage = ((total - remaining) / total) * 100
    setWidth(percentage)
  }, [total, remaining])

  return (
    <div className={`mt-4 ${className}`}>
      <div className="flex justify-between text-sm text-slate-400 mb-2">
        <span>{t('spotsRemaining', { count: remaining })}</span>
        <span>{t('totalSpots', { count: total })}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-emerald-400 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}