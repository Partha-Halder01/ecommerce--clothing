"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface OurStorySettings {
  enabled: boolean
  title: string
  description: string
  video_url: string
}

export function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [settings, setSettings] = useState<OurStorySettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Parallax the video slower than the page scroll
  const videoY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"])

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/settings/our-story`)
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error("Failed to fetch our story settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Return hidden section instead of null to allow containerRef to hydrate for Framer Motion
  if (isLoading) return <section ref={containerRef} className="hidden" />
  if (!settings?.enabled || !settings?.video_url) return <section ref={containerRef} className="hidden" />

  return (
    <section className="py-24 sm:py-32 bg-[#FCFBF8] overflow-hidden" ref={containerRef}>
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          className="text-center mb-16 sm:mb-20 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-[1px] w-8 bg-[#D8B4A0]"></div>
            <p
              className="text-xs uppercase tracking-[0.4em] text-[#D8B4A0] font-semibold"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Behind The Scenes
            </p>
            <div className="h-[1px] w-8 bg-[#D8B4A0]"></div>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#1C1615] tracking-widest uppercase mb-8" style={{ fontFamily: "var(--font-playfair)" }}>
            {settings.title || "Our Story"}
          </h2>
          {settings.description && (
            <p className="text-lg text-[#6B635E] leading-relaxed tracking-wide font-light" style={{ fontFamily: "var(--font-body)" }}>
              {settings.description}
            </p>
          )}
        </motion.div>

        <motion.div
          className="relative aspect-video max-w-6xl mx-auto overflow-hidden shadow-2xl border border-[#D8B4A0]/20"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.div style={{ y: videoY }} className="absolute inset-0 w-full h-[130%] -top-[15%]">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              loop
              muted={isMuted}
              playsInline
            >
              <source src={settings.video_url} type="video/mp4" />
            </video>
          </motion.div>

          {/* Overlay when not playing */}
          <div className={`absolute inset-0 bg-[#1C1615]/40 transition-opacity duration-700 pointer-events-none ${isPlaying ? "opacity-0" : "opacity-100"}`} />

          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button
                onClick={togglePlay}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#FCFBF8]/10 backdrop-blur-md border border-[#FCFBF8]/30 text-[#FCFBF8] flex items-center justify-center hover:bg-[#D8B4A0]/90 hover:border-transparent hover:text-[#1C1615] hover:scale-105 transition-all duration-500 shadow-2xl pointer-events-auto"
              >
                <Play className="h-8 w-8 sm:h-10 sm:w-10 ml-2" />
              </button>
            </div>
          )}

          {/* Controls */}
          {isPlaying && (
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={togglePlay}
                className="p-3 sm:p-4 bg-[#1C1615]/60 backdrop-blur-md rounded-full text-[#FCFBF8] hover:bg-[#D8B4A0] hover:text-[#1C1615] transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Play className="h-5 w-5 sm:h-6 sm:w-6 ml-1" />
                )}
              </button>
              <button
                onClick={toggleMute}
                className="p-3 sm:p-4 bg-[#1C1615]/60 backdrop-blur-md rounded-full text-[#FCFBF8] hover:bg-[#D8B4A0] hover:text-[#1C1615] transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Volume2 className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
