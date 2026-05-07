"use client"

import { useState, useEffect } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface ScrollingTextSettings {
  enabled: boolean
  text: string
}

export function MarqueeBanner() {
  const [settings, setSettings] = useState<ScrollingTextSettings>({ enabled: true, text: "" })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchScrollingText()
  }, [])

  const fetchScrollingText = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings/scrolling-text`)
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
      }
    } catch (error) {
      console.error("Failed to fetch scrolling text:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render if disabled or no text
  if (!settings.enabled || !settings.text || isLoading) {
    return null
  }

  // Split text by | to get multiple messages
  const messages = settings.text.split('|').map(m => m.trim()).filter(Boolean)
  const displayText = messages.join(' • ') + ' • '

  return (
    <div className="bg-[#1C1615] text-[#D8B4A0] py-3 sm:py-4 overflow-hidden border-y border-[#D8B4A0]/20">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] mx-6"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {displayText}
          </span>
        ))}
      </div>
    </div>
  )
}

