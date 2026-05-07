"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface VideoItem {
  name: string
  video_url: string
}

interface TestimonialsSettings {
  enabled: boolean
  title: string
  videos: VideoItem[]
}

export function VideoCarousel() {
  const [playingIdx, setPlayingIdx] = useState<number | null>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [settings, setSettings] = useState<TestimonialsSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map())

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/settings/testimonials`)
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error("Failed to fetch testimonials:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlay = (idx: number) => {
    // Pause any currently playing video
    if (playingIdx !== null && playingIdx !== idx) {
      const prevVideo = videoRefs.current.get(playingIdx)
      if (prevVideo) {
        prevVideo.pause()
        prevVideo.currentTime = 0
      }
    }

    const video = videoRefs.current.get(idx)
    if (video) {
      if (playingIdx === idx) {
        video.pause()
        setPlayingIdx(null)
      } else {
        video.play()
        setPlayingIdx(idx)
      }
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft)
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Don't render if disabled or no videos
  if (isLoading) return null
  if (!settings?.enabled || !settings?.videos?.length) return null

  const videos = settings.videos
  const canScrollLeft = scrollPosition > 0
  const canScrollRight = containerRef.current
    ? scrollPosition < containerRef.current.scrollWidth - containerRef.current.clientWidth - 10
    : true

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-[#FCFBF8]">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          className="flex flex-col items-center text-center gap-4 mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-8 bg-[#D8B4A0]"></div>
              <p
                className="text-xs uppercase tracking-[0.4em] text-[#D8B4A0] font-semibold"
                style={{ fontFamily: "var(--font-body)" }}
              >
                The Experience
              </p>
              <div className="h-[1px] w-8 bg-[#D8B4A0]"></div>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl text-[#1C1615] tracking-widest uppercase font-light" style={{ fontFamily: "var(--font-playfair)" }}>{settings.title || "What Our Fellows Say"}</h2>
          </div>
        </motion.div>

        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FCFBF8] border border-[#D8B4A0] shadow-xl flex items-center justify-center transition-all duration-300 hover:bg-[#1C1615] hover:text-[#FCFBF8] -translate-x-1/2 ${canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Video Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            ref={containerRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-8"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {videos.map((video, idx) => (
              <div
                key={idx}
                className="relative flex-shrink-0 w-[220px] sm:w-[240px] lg:w-[280px] aspect-[9/14] rounded-xl sm:rounded-2xl overflow-hidden bg-black group cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
                onClick={() => handlePlay(idx)}
              >
                <video
                  ref={(el) => {
                    if (el) videoRefs.current.set(idx, el)
                  }}
                  className="w-full h-full object-cover"
                  loop
                  muted
                  playsInline
                  onEnded={() => setPlayingIdx(null)}
                >
                  <source src={video.video_url} type="video/mp4" />
                </video>

                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity ${playingIdx === idx ? "opacity-0" : "opacity-100"}`}
                />

                {/* Play button */}
                <button
                  className={`absolute bottom-4 left-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all hover:scale-110 hover:bg-white ${playingIdx === idx ? "opacity-0" : "opacity-100"
                    }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePlay(idx)
                  }}
                >
                  {playingIdx === idx ? (
                    <Pause className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                  ) : (
                    <Play className="h-5 w-5 sm:h-6 sm:w-6 text-black ml-1" />
                  )}
                </button>

                {/* Pause button when playing */}
                {playingIdx === idx && (
                  <button
                    className="absolute bottom-4 left-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePlay(idx)
                    }}
                  >
                    <Pause className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </button>
                )}

                {/* Name overlay */}
                <div
                  className={`absolute bottom-4 left-20 sm:left-24 right-4 transition-opacity ${playingIdx === idx ? "opacity-0" : "opacity-100"}`}
                >
                  <p
                    className="text-white text-sm sm:text-base font-medium truncate"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {video.name}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FCFBF8] border border-[#D8B4A0] shadow-xl flex items-center justify-center transition-all duration-300 hover:bg-[#1C1615] hover:text-[#FCFBF8] translate-x-1/2 ${canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Scroll indicators for mobile */}
        <div className="flex justify-center gap-2 mt-6 sm:hidden">
          {videos.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${Math.floor(scrollPosition / 280) === index ? "bg-black" : "bg-black/20"
                }`}
            />
          ))}
        </div>
      </div>
    </section >
  )
}
