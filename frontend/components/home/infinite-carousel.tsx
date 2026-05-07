"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { publicProductsAPI, Product } from "@/lib/api"
import { motion } from "framer-motion"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface ShopTheLookSettings {
  enabled: boolean
  title: string
  product_ids: number[]
}

export function InfiniteCarousel() {
  const [products, setProducts] = useState<Product[]>([])
  const [settings, setSettings] = useState<ShopTheLookSettings>({ enabled: true, title: "Shop The Look", product_ids: [] })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch shop the look settings
      const settingsRes = await fetch(`${API_BASE_URL}/api/settings/shop-the-look`)
      const settingsData = await settingsRes.json()
      setSettings(settingsData)

      if (settingsData.enabled && settingsData.product_ids?.length > 0) {
        // Remove duplicate IDs first
        const uniqueIds = [...new Set(settingsData.product_ids as number[])]

        // Fetch all products and filter by selected IDs
        const allProducts = await publicProductsAPI.getAll()
        const selectedProducts = allProducts.filter((p: Product) =>
          uniqueIds.includes(p.id)
        )
        setProducts(selectedProducts)
      }
    } catch (error) {
      console.error("Failed to fetch shop the look data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render if disabled or no products
  if (!settings.enabled || products.length === 0) {
    return null
  }

  // For smooth infinite animation, we need at least a few products
  // Duplicate the array multiple times if needed for seamless loop
  const displayProducts = products.length < 4
    ? [...products, ...products, ...products, ...products]
    : [...products, ...products]

  return (
    <section className="py-24 sm:py-32 overflow-hidden bg-[#1C1615] border-t border-[#D8B4A0]/20">
      <motion.div
        className="text-center mb-16 sm:mb-20 px-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-[1px] w-8 bg-[#D8B4A0]"></div>
          <p
            className="text-xs uppercase tracking-[0.4em] text-[#D8B4A0] font-semibold"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Trending Now
          </p>
          <div className="h-[1px] w-8 bg-[#D8B4A0]"></div>
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-light text-[#FCFBF8] uppercase tracking-widest drop-shadow-md" style={{ fontFamily: "var(--font-playfair)" }}>{settings.title}</h2>
      </motion.div>

      <div className="relative">
        <div
          className="flex"
          style={{
            animation: `slideLeft ${products.length * 4}s linear infinite`,
          }}
        >
          {displayProducts.map((product, index) => (
            <Link
              key={`${product.id}-${index}`}
              href={`/product/${product.slug}`}
              className="group flex-shrink-0 w-[180px] sm:w-[220px] lg:w-[250px] mx-2 sm:mx-3"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-none mb-4 shadow-lg border border-[#D8B4A0]/10 bg-[#FCFBF8]/5">
                {/* Use base img tag for reliability */}
                <img
                  src={product.image_url || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1615]/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Watermark */}
                <div className="absolute bottom-4 center-0 w-full text-center">
                  <span className="text-[#FCFBF8] text-xs font-semibold tracking-[0.4em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0" style={{ fontFamily: "var(--font-body)" }}>
                    Discover
                  </span>
                </div>
              </div>
              <div className="text-center mt-6">
                <h3 className="font-light text-lg sm:text-xl text-[#FCFBF8] uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-playfair)" }}>{product.name}</h3>
                <p className="text-sm font-light text-[#D8B4A0] tracking-widest" style={{ fontFamily: "var(--font-body)" }}>
                  ₹{product.price.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes slideLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  )
}

