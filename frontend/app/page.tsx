"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SaleTimer } from "@/components/home/sale-timer"
import { HeroVideo } from "@/components/home/hero-video"
import { HeroSlider } from "@/components/home/hero-slider"
import { MarqueeBanner } from "@/components/home/marquee-banner"
import { ProductCarousel } from "@/components/home/product-carousel"
import { BlogSection } from "@/components/home/blog-section"
import { motion, AnimatePresence } from "framer-motion"

// Lazy load below-the-fold sections for faster initial page load
const VideoSection = dynamic(() => import("@/components/home/video-section").then(mod => ({ default: mod.VideoSection })), { ssr: false })
const VideoCarousel = dynamic(() => import("@/components/home/video-carousel").then(mod => ({ default: mod.VideoCarousel })), { ssr: false })
const InfiniteCarousel = dynamic(() => import("@/components/home/infinite-carousel").then(mod => ({ default: mod.InfiniteCarousel })), { ssr: false })

export default function HomePage() {
  const [videoEnded, setVideoEnded] = useState(false)

  return (
    <div className="min-h-screen">
      <SaleTimer />
      <Header />
      
      {/* Standard main starts at top since headers are absolutely overlayed */}
      <main>
        <div className="relative w-full aspect-[16/9] md:aspect-auto h-auto md:h-[100svh] overflow-hidden bg-[#0D0A09]">
          <AnimatePresence mode="wait">
            {!videoEnded ? (
              <motion.div
                key="video"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0 z-10 w-full h-full"
              >
                <HeroVideo onEnded={() => setVideoEnded(true)} />
              </motion.div>
            ) : (
              <motion.div
                key="slider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                <HeroSlider />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <MarqueeBanner />
        <ProductCarousel />
        <BlogSection />
        <VideoSection />
        <VideoCarousel />
        <InfiniteCarousel />
      </main>
      <Footer />
    </div>
  )
}
