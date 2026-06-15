"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { settingsAPI, HeroSlide } from "@/lib/api"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"

const defaultSlides: HeroSlide[] = [
  {
    title: "Le Voyage",
    subtitle: "The Signature Collection",
    description: "An olfactory journey crafted from the world's most elusive absolutes.",
    image: "https://images.unsplash.com/photo-1595166665792-747f3ae3df67?q=80&w=2000&auto=format&fit=crop",
    cta: "Discover the scent",
    href: "/shop"
  },
  {
    title: "Nocturne",
    subtitle: "Extrait de Parfum",
    description: "Deep, mysterious woody notes layered with midnight jasmine.",
    image: "https://images.unsplash.com/photo-1615529188059-1959cebfef54?q=80&w=2000&auto=format&fit=crop",
    cta: "Acquire Limited Edition",
    href: "/shop"
  },
  {
    title: "Luminescence",
    subtitle: "Spring Arrival",
    description: "A cascade of bright citrus and rare white florals.",
    image: "https://images.unsplash.com/photo-1622618991746-fe6008162edb?q=80&w=2000&auto=format&fit=crop",
    cta: "Shop Luminescence",
    href: "/shop"
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState<HeroSlide[]>(defaultSlides)

  useEffect(() => {
    settingsAPI.getHero()
      .then(data => { if (data.slides?.length) setSlides(data.slides) })
      .catch(() => { }) // Use defaults on error
  }, [])

  useEffect(() => {
    if (slides.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  const goToSlide = (index: number) => setCurrentSlide(index)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  if (slides.length === 0) return null

  return (
    <section ref={containerRef} className="relative h-[85vh] lg:h-screen w-full overflow-hidden bg-[#1C1615]">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <motion.div style={{ y: bgY }} className="absolute inset-0 h-[120%] -top-[10%]">
            <img
              src={slides[currentSlide]?.image}
              alt={slides[currentSlide]?.title}
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-center brightness-90 saturate-50 transition-transform duration-[10s] ease-out hover:scale-105"
            />
          </motion.div>

          {/* Gradients to ensure text readability without making the image too dark */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1615]/80 via-transparent to-[#1C1615]/30 pointer-events-none" />
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />

          <div className="relative h-full container mx-auto px-6 sm:px-12 flex items-center justify-center sm:justify-start">
            <motion.div
              className="max-w-2xl text-center sm:text-left mt-20 sm:mt-0"
              style={{ y: textY, opacity: textOpacity }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {slides[currentSlide]?.subtitle && (
                <motion.div
                  initial={{ opacity: 0, letterSpacing: "0.1em" }}
                  animate={{ opacity: 1, letterSpacing: "0.4em" }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                  className="flex items-center justify-center sm:justify-start gap-4 mb-6"
                >
                  <div className="h-[1px] w-8 sm:w-16 bg-[#D8B4A0]"></div>
                  <p className="text-xs sm:text-sm uppercase text-[#D8B4A0] font-medium" style={{ fontFamily: "var(--font-body)" }}>
                    {slides[currentSlide].subtitle}
                  </p>
                  <div className="h-[1px] w-8 sm:w-16 bg-[#D8B4A0] sm:hidden"></div>
                </motion.div>
              )}
              {slides[currentSlide]?.title && (
                <motion.h2
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 1 }}
                  className="text-5xl sm:text-6xl lg:text-7xl font-light leading-none text-[#FCFBF8] mb-6 uppercase tracking-widest drop-shadow-lg"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {slides[currentSlide].title}
                </motion.h2>
              )}
              {slides[currentSlide]?.description && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2, delay: 1.4 }}
                  className="text-lg sm:text-xl text-[#E8E3DC] mb-12 max-w-lg mx-auto sm:mx-0 font-light tracking-wide leading-relaxed"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {slides[currentSlide].description}
                </motion.p>
              )}
              {slides[currentSlide]?.cta && slides[currentSlide]?.href && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 1.6 }}
                >
                  <Link href={slides[currentSlide].href}>
                    <Button className="bg-transparent border border-[#FCFBF8] text-[#FCFBF8] hover:bg-[#FCFBF8] hover:text-[#1C1615] px-10 py-6 uppercase tracking-[0.2em] text-xs font-semibold rounded-none transition-all duration-700">
                      {slides[currentSlide].cta}
                    </Button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Luxury Navigation Indicators */}
      <div className="absolute right-8 sm:right-16 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col gap-6">
        {slides.map((_, index) => (
          <button key={index} onClick={() => goToSlide(index)} className="flex items-center justify-end group pl-4">
            <span className={`text-[10px] font-bold mr-4 transition-all duration-500 uppercase tracking-widest ${index === currentSlide ? "text-[#D8B4A0] opacity-100" : "text-[#FCFBF8] opacity-0 group-hover:opacity-100"}`} style={{ fontFamily: "var(--font-body)" }}>
              0{index + 1}
            </span>
            <div className={`w-[2px] transition-all duration-700 ease-out ${index === currentSlide ? "h-16 bg-[#D8B4A0]" : "h-6 bg-[#FCFBF8]/30 group-hover:bg-[#FCFBF8]/60"}`} />
          </button>
        ))}
      </div>

      {/* Mobile Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-30 sm:hidden">
        {slides.map((_, index) => (
          <button key={index} onClick={() => goToSlide(index)}
            className={`h-[2px] transition-all duration-500 ${index === currentSlide ? "w-12 bg-[#D8B4A0]" : "w-6 bg-white/30"}`} />
        ))}
      </div>
    </section>
  )
}
