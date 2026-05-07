"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Product } from "@/lib/api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export function ProductCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/featured-products`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Failed to fetch featured products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener("resize", checkScroll)
    return () => window.removeEventListener("resize", checkScroll)
  }, [products])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 280
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
      setTimeout(checkScroll, 300)
    }
  }

  // Don't render if no featured products
  if (!isLoading && products.length === 0) {
    return null
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#FDFDFD]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <p
              className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#D4AF37] mb-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Curated For You
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-playfair)" }}>Featured Fragrances</h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="rounded-none h-10 w-10 sm:h-11 sm:w-11 border-black/10 text-black hover:bg-black hover:text-white disabled:opacity-20 transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="rounded-none h-10 w-10 sm:h-11 sm:w-11 border-black/10 text-black hover:bg-black hover:text-white disabled:opacity-20 transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => {
            const rating = 3.5 + ((product.id * 7 + 3) % 15) / 10
            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group flex-shrink-0 w-[200px] sm:w-[250px] lg:w-[280px] snap-start"
              >
                <div className="bg-[#FCFBF8] border border-[#D8B4A0]/30 hover:border-[#D8B4A0]/70 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(216,180,160,0.15)]">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#1C1615]/5">
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-all duration-[1.2s] ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    />
                    {/* Shimmer borders on hover */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D8B4A0] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D8B4A0] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1615]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {/* Quick View CTA */}
                    <div className="absolute bottom-4 left-0 w-full text-center">
                      <span className="inline-block text-[#FCFBF8] text-[9px] sm:text-[10px] font-medium tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 border border-[#FCFBF8]/40 px-5 py-2 backdrop-blur-sm bg-[#1C1615]/20" style={{ fontFamily: "var(--font-body)" }}>
                        Quick View
                      </span>
                    </div>
                    {/* Badges */}
                    {product.original_price && product.original_price > product.price && (
                      <span className="absolute top-3 left-3 bg-[#D8B4A0] text-[#1C1615] text-[9px] font-bold uppercase tracking-widest px-2.5 py-1">
                        {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% Off
                      </span>
                    )}
                  </div>
                  <div className="text-center px-4 py-4">
                    <p
                      className="text-[9px] uppercase tracking-[0.25em] text-[#D8B4A0] mb-1.5"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {product.category}
                    </p>
                    <h3 className="font-light text-sm sm:text-base text-[#1C1615] uppercase tracking-widest line-clamp-1 mb-1.5 group-hover:text-[#D8B4A0] transition-colors duration-500" style={{ fontFamily: "var(--font-playfair)" }}>{product.name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <p className="text-[#1C1615] text-sm font-medium tracking-widest" style={{ fontFamily: "var(--font-body)" }}>
                        ₹{product.price}
                      </p>
                      {product.original_price && product.original_price > product.price && (
                        <p className="text-[#6B635E]/50 text-xs line-through tracking-widest">₹{product.original_price}</p>
                      )}
                    </div>
                    {/* Star Ratings */}
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const filled = star <= Math.floor(rating)
                          const half = !filled && star === Math.ceil(rating) && rating % 1 >= 0.3
                          return (
                            <svg key={star} className={`w-3 h-3 ${filled ? 'fill-[#D8B4A0] text-[#D8B4A0]' : half ? 'fill-[#D8B4A0]/50 text-[#D8B4A0]' : 'fill-transparent text-[#D8B4A0]/40'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                          )
                        })}
                      </div>
                      <span className="text-[10px] text-[#6B635E] tracking-wider" style={{ fontFamily: "var(--font-body)" }}>
                        {rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
