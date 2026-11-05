"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { usePathname } from "next/navigation"
import { settingsAPI, SaleBannerSettings } from "@/lib/api"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function SaleTimer() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [bannerSettings, setBannerSettings] = useState<SaleBannerSettings | null>(null)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    setScrolled(window.scrollY > 20)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])


  useEffect(() => {
    // Fetch banner settings from API
    settingsAPI.getSaleBanner()
      .then(settings => setBannerSettings(settings))
      .catch(() => {
        // Use defaults if API fails
        setBannerSettings({
          enabled: true,
          text: "LIMITED TIME OFFER - UP TO 50% OFF",
          end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        })
      })
  }, [])

  useEffect(() => {
    if (!bannerSettings) return

    const endDate = new Date(bannerSettings.end_date)

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const distance = endDate.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [bannerSettings])

  // Don't show if not loaded, disabled, dismissed, or on the homepage
  if (!bannerSettings || !bannerSettings.enabled || !isVisible || pathname === "/") return null

  const isHome = pathname === "/"

  return (
    <div className={`text-[#D4AF37] py-1.5 sm:py-2 px-4 relative overflow-hidden transition-all duration-500 ${
      isHome
        ? "absolute top-0 left-0 w-full z-[60] bg-black/40 backdrop-blur-sm border-b border-white/5"
        : "bg-black border-b border-[#D4AF37]/20"
    }`}>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-[#D4AF37]/5 to-black" />

      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 text-center relative">
        <span className="text-[10px] sm:text-xs font-medium tracking-widest uppercase" style={{ fontFamily: "var(--font-body)" }}>
          {bannerSettings.text}
        </span>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <TimeBlock value={timeLeft.days} label="Days" />
          <span className="text-xs sm:text-sm font-bold text-[#D4AF37]/40">:</span>
          <TimeBlock value={timeLeft.hours} label="Hrs" />
          <span className="text-xs sm:text-sm font-bold text-[#D4AF37]/40">:</span>
          <TimeBlock value={timeLeft.minutes} label="Min" />
          <span className="text-xs sm:text-sm font-bold text-[#D4AF37]/40">:</span>
          <TimeBlock value={timeLeft.seconds} label="Sec" />
        </div>
        <button onClick={() => setIsVisible(false)} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors p-1">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center bg-[#D4AF37]/10 rounded-none border border-[#D4AF37]/20 px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 min-w-[32px] sm:min-w-[44px]">
      <span className="text-xs sm:text-sm font-bold tabular-nums text-[#D4AF37]">{value.toString().padStart(2, "0")}</span>
      <span className="text-[7px] sm:text-[9px] uppercase tracking-wider text-[#D4AF37]/60" style={{ fontFamily: "var(--font-body)" }}>
        {label}
      </span>
    </div>
  )
}
