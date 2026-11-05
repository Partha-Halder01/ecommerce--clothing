"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Loader2 } from "lucide-react"
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
  const [isMobile, setIsMobile] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Parallax the video slower than the page scroll on desktop
  const videoY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"])

  useEffect(() => {
    fetchSettings()
    
    // Check mobile screens for responsive parallax handling
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Auto Play/Pause when scrolled into view
  useEffect(() => {
    const video = videoRef.current
    const container = containerRef.current
    if (!video || !container || !settings?.video_url) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          // Play when in viewport (must start muted for browser policy)
          video.play()
            .then(() => setIsPlaying(true))
            .catch((err) => {
              console.log("Autoplay blocked or interrupted:", err)
              // Force mute if blocked, then play
              video.muted = true
              setIsMuted(true)
              video.play().then(() => setIsPlaying(true)).catch(() => {})
            })
        } else {
          // Pause when out of viewport
          video.pause()
          setIsPlaying(false)
        }
      },
      {
        threshold: 0.2, // Trigger when 20% of the component is visible
      }
    )

    observer.observe(container)
    return () => {
      observer.disconnect()
    }
  }, [settings?.video_url])

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
        setIsPlaying(false)
      } else {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            videoRef.current!.muted = true
            setIsMuted(true)
            videoRef.current!.play().then(() => setIsPlaying(true))
          })
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMute = !isMuted
      videoRef.current.muted = nextMute
      setIsMuted(nextMute)
    }
  }

  const renderDescription = () => {
    if (!settings?.description) return null
    
    // On desktop view, we always show the full description
    if (!isMobile) {
      return (
        <p className="text-sm lg:text-base text-[#6B635E] leading-relaxed tracking-wide font-light">
          {settings.description}
        </p>
      )
    }
    
    // On mobile view, show truncation with a Read More toggle button
    const isLongText = settings.description.length > 200
    if (isLongText && !isExpanded) {
      return (
        <div>
          <p className="text-xs text-[#6B635E] leading-relaxed tracking-wide font-light">
            {settings.description.slice(0, 200)}...
          </p>
          <button 
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(true)
            }}
            className="text-[10px] uppercase tracking-widest font-bold text-[#D8B4A0] hover:text-[#1C1615] transition-colors mt-2"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Read More
          </button>
        </div>
      )
    }
    
    return (
      <div>
        <p className="text-xs text-[#6B635E] leading-relaxed tracking-wide font-light">
          {settings.description}
        </p>
        {isLongText && isExpanded && (
          <button 
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(false)
            }}
            className="text-[10px] uppercase tracking-widest font-bold text-[#D8B4A0] hover:text-[#1C1615] transition-colors mt-2"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Read Less
          </button>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <section ref={containerRef} className="py-24 bg-[#FCFBF8] flex justify-center items-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#D8B4A0]" />
      </section>
    )
  }

  if (!settings?.enabled || !settings?.video_url) return null

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-[#FCFBF8] border-t border-[#D8B4A0]/10 overflow-hidden" ref={containerRef}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center">
          
          {/* Video Container (At top on mobile (order-1), on the left on desktop (md:order-1)) */}
          <motion.div
            onClick={togglePlay}
            className="order-1 md:order-1 md:col-span-6 w-full relative aspect-video overflow-hidden shadow-[0_12px_40px_rgba(28,22,21,0.15)] border border-[#D8B4A0]/20 cursor-pointer group"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <motion.div 
              style={{ y: isMobile ? "0%" : videoY, willChange: "transform" }} 
              className="absolute inset-0 w-full h-full md:h-[124%] md:-top-[12%]"
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                preload="metadata"
                loop
                muted={isMuted}
                playsInline
              >
                <source src={settings.video_url} type="video/mp4" />
              </video>
            </motion.div>

            {/* Dark Overlay when paused */}
            <div className={`absolute inset-0 bg-[#1C1615]/30 transition-opacity duration-700 pointer-events-none ${isPlaying ? "opacity-0" : "opacity-100"}`} />

            {/* Play/Pause center overlay indicator */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`w-14 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FCFBF8]/15 backdrop-blur-md border border-[#FCFBF8]/20 text-[#FCFBF8] flex items-center justify-center transition-all duration-500 scale-100 group-hover:scale-105 ${isPlaying ? "opacity-0 scale-75 group-hover:opacity-100" : "opacity-100"}`}>
                {isPlaying ? (
                  <Pause className="h-6 w-6 sm:h-8 sm:w-8" />
                ) : (
                  <Play className="h-6 w-6 sm:h-8 sm:w-8 ml-1" />
                )}
              </div>
            </div>

            {/* Persistent Volume Control Button */}
            <button
              onClick={(e) => {
                e.stopPropagation() // Prevent play/pause toggle when muting
                toggleMute()
              }}
              className="absolute bottom-4 right-4 z-20 p-2.5 sm:p-3 bg-[#1C1615]/60 backdrop-blur-md rounded-full text-[#FCFBF8] hover:bg-[#D8B4A0] hover:text-[#1C1615] transition-all duration-300 shadow-lg"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          </motion.div>

          {/* Text Content Column (Below video on mobile (order-2), on the right on desktop (md:order-2)) */}
          <motion.div
            className="order-2 md:order-2 md:col-span-6 w-full text-left flex flex-col justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center justify-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <p
                className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#D8B4A0] font-semibold"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Behind The Scenes
              </p>
              <div className="h-[1px] w-8 sm:w-12 bg-[#D8B4A0]"></div>
            </div>
            
            <h2 
              className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#1C1615] tracking-widest uppercase mb-4 sm:mb-6 leading-tight" 
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {settings.title || "Elegance and Luxury Redefined"}
            </h2>
            
            <div className="mt-2 text-[#6B635E]" style={{ fontFamily: "var(--font-body)" }}>
              {renderDescription()}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
