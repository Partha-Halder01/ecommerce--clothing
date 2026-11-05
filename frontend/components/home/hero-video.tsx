"use client"

import { useEffect, useRef, useState } from "react"
import { Volume2, VolumeX, ChevronDown } from "lucide-react"

export function HeroVideo({ onEnded }: { onEnded?: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [muted, setMuted] = useState(true) // start muted for autoplay policy
  const [ready, setReady] = useState(false)

  // Auto-play on mount
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const tryPlay = () => {
      // Try with sound first
      video.muted = false
      video.play()
        .then(() => {
          setMuted(false)
          setReady(true)
        })
        .catch(() => {
          // Browser blocked — fall back to muted autoplay
          video.muted = true
          setMuted(true)
          video.play().then(() => setReady(true)).catch(() => {})
        })
    }

    if (video.readyState >= 3) {
      tryPlay()
    } else {
      video.addEventListener("canplay", tryPlay, { once: true })
    }
  }, [])

  // Pause + mute when scrolled away, resume when back
  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video) return

    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries[0].isIntersecting
        if (inView) {
          video.muted = muted
          video.play().catch(() => {})
        } else {
          video.pause()
          video.muted = true
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [muted])

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    const next = !muted
    video.muted = next
    setMuted(next)
    if (!video.paused) return
    video.play().catch(() => {})
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#0D0A09] overflow-hidden aspect-[16/9] md:aspect-auto h-auto md:h-[100svh]"
    >
      {/* Pure video — no text, no overlays */}
      <video
        ref={videoRef}
        src="/hero section video.mp4"
        onEnded={onEnded}
        playsInline
        muted
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Faded white line removed for clean bottom view */}

      {/* Scroll Down Arrow */}
      <button
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth"
          })
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 animate-bounce group cursor-pointer hidden md:flex"
        aria-label="Scroll down"
      >
        <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-white/50 group-hover:text-white transition-colors">Scroll</span>
        <ChevronDown className="h-4 sm:h-5 w-4 sm:w-5 text-white/60 group-hover:text-white transition-colors" />
      </button>


    </section>
  )
}
