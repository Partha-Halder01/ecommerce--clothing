"use client"

import dynamic from "next/dynamic"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SaleTimer } from "@/components/home/sale-timer"
import { HeroSlider } from "@/components/home/hero-slider"
import { MarqueeBanner } from "@/components/home/marquee-banner"
import { ProductCarousel } from "@/components/home/product-carousel"

// Lazy load below-the-fold sections for faster initial page load
const VideoSection = dynamic(() => import("@/components/home/video-section").then(mod => ({ default: mod.VideoSection })), { ssr: false })
const VideoCarousel = dynamic(() => import("@/components/home/video-carousel").then(mod => ({ default: mod.VideoCarousel })), { ssr: false })
const InfiniteCarousel = dynamic(() => import("@/components/home/infinite-carousel").then(mod => ({ default: mod.InfiniteCarousel })), { ssr: false })

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SaleTimer />
      <Header />
      <main>
        <HeroSlider />
        <MarqueeBanner />
        <ProductCarousel />
        <VideoSection />
        <VideoCarousel />
        <InfiniteCarousel />
      </main>
      <Footer />
    </div>
  )
}
