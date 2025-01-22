'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface CountdownTimerProps {
  endTime: Date
  onComplete?: () => void
}

export function CountdownTimer({ endTime, onComplete }: CountdownTimerProps) {
  const { t } = useTranslation()
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  function calculateTimeLeft() {
    const difference = +endTime - +new Date()
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return timeLeft
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)

      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        clearInterval(timer)
        if (onComplete) {
          onComplete()
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime, onComplete])

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center bg-white/5 rounded-lg ring-1 ring-inset ring-white/10">
          <span className="font-mono text-2xl sm:text-3xl font-bold text-white">
            {value.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="absolute inset-0 rounded-lg bg-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <span className="mt-2 text-xs sm:text-sm text-slate-400">{t(`time.${label}`)}</span>
    </div>
  )

  const Separator = () => (
    <div className="flex items-center justify-center w-4 sm:w-8 h-16 sm:h-20">
      <span className="text-xl sm:text-2xl font-bold text-emerald-400">:</span>
    </div>
  )

  return (
    <div className="inline-flex flex-col items-center">
      <div className="text-sm sm:text-base text-slate-400 mb-4">
        {t('title')}
      </div>
      <div className="group flex items-center justify-center gap-1 sm:gap-2">
        <TimeUnit value={timeLeft.days} label="days" />
        <Separator />
        <TimeUnit value={timeLeft.hours} label="hours" />
        <Separator />
        <TimeUnit value={timeLeft.minutes} label="minutes" />
        <Separator />
        <TimeUnit value={timeLeft.seconds} label="seconds" />
      </div>
      <div className="mt-4 text-xs sm:text-sm text-emerald-400 font-medium">
        {t('subtitle')}
      </div>
    </div>
  )
}