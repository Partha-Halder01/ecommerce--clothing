"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SaleTimer } from "@/components/home/sale-timer"
import Link from "next/link"
import { Star } from "lucide-react"
import { publicProductsAPI, Product } from "@/lib/api"
import { motion } from "framer-motion"

// Sorting removed per request

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 12

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await publicProductsAPI.getAll()
        setProducts(productsData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Sorting removed, keep default order
  const filteredProducts = useMemo(() => {
    return Array.isArray(products) ? products : []
  }, [products])

  // Reset page on data change
  useEffect(() => {
    setCurrentPage(1)
  }, [products])

  // Scroll to top when page changes
  useEffect(() => {
    if (!isLoading) {
      window.scrollTo({ top: 400, behavior: 'smooth' })
    }
  }, [currentPage, isLoading])

  // Pagination safely
  const { totalPages, paginatedProducts } = useMemo(() => {
    const total = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
    const paginated = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    return { totalPages: total, paginatedProducts: paginated }
  }, [filteredProducts, currentPage])

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  }

  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      <SaleTimer />
      <Header />
      <main>
        {/* Luxury Hero Banner */}
        <section className="relative h-[30vh] sm:h-[40vh] overflow-hidden bg-[#1C1615]">
          <div className="absolute inset-0 opacity-50 mix-blend-luminosity">
            <img
              src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2000&auto=format&fit=crop"
              alt="Shop Banner"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#1C1615]/90 via-[#1C1615]/40 to-[#1C1615]/90" />
          <div className="relative h-full container mx-auto px-4 flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light mb-4 text-[#FCFBF8] tracking-widest uppercase" style={{ fontFamily: "var(--font-playfair)" }}>The Boutique</h1>
              <p className="text-xs sm:text-sm text-[#D8B4A0] max-w-lg mx-auto uppercase tracking-[0.3em]" style={{ fontFamily: "var(--font-body)" }}>
                Discover our complete collection of timeless pieces
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 sm:py-20 border-t border-[#D8B4A0]/20">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Toolbar: Title Only */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#D8B4A0]/20 pb-6">
              <div className="flex-1">
                <h2 className="text-2xl font-light text-[#1C1615] uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>All Fragrances</h2>
              </div>
            </div>

            <p className="text-sm font-light text-[#6B635E] uppercase tracking-widest mb-6">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} {filteredProducts.length === 1 ? 'Item' : 'Items'}
            </p>

            {/* Product Grid */}
            {isLoading ? (
              <div className="flex justify-center py-32">
                <div className="w-10 h-10 border-2 border-[#1C1615] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-32 border border-[#D8B4A0]/20 bg-[#FCFBF8]">
                <p className="text-[#1C1615] text-lg font-light tracking-wide uppercase mb-6" style={{ fontFamily: "var(--font-playfair)" }}>No products found</p>
              </div>
            ) : (
              <motion.div
                key={`page-${currentPage}`}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-10 grid-flow-row-dense"
              >
                {paginatedProducts.map((product) => (
                  <motion.div variants={itemVariants} key={product.id}>
                    <Link href={`/product/${product.slug}`} className="group block h-full">
                      <div className="bg-[#FCFBF8] h-full flex flex-col border border-[#D8B4A0]/30 hover:border-[#D8B4A0]/70 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(216,180,160,0.15)]">
                        <div className="relative aspect-[3/4] overflow-hidden bg-[#1C1615]/5">
                          <img
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.name}
                            loading="lazy"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.svg" }}
                            className="w-full h-full object-cover transition-all duration-[1.2s] ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
                          />
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1615]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          {/* Shimmer borders on hover */}
                          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D8B4A0] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D8B4A0] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

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
                          {product.stock > 0 && product.stock < 20 && (
                            <span className="absolute top-3 right-3 bg-[#1C1615] text-[#D8B4A0] text-[9px] uppercase tracking-widest px-2 py-1">Limited</span>
                          )}
                          {product.stock === 0 && (
                            <span className="absolute top-3 left-3 bg-red-900 text-[#FCFBF8] text-[9px] uppercase tracking-widest px-2 py-1">Sold Out</span>
                          )}
                        </div>
                        <div className="text-center flex-grow flex flex-col justify-between px-4 py-5">
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.25em] text-[#D8B4A0] mb-2" style={{ fontFamily: "var(--font-body)" }}>{product.category}</p>
                            <h3 className="font-light text-base sm:text-lg text-[#1C1615] uppercase tracking-widest line-clamp-2 mb-2 group-hover:text-[#D8B4A0] transition-colors duration-500" style={{ fontFamily: "var(--font-playfair)" }}>{product.name}</h3>
                          </div>
                          <div>
                            <div className="flex items-center justify-center gap-3 mt-2">
                              <p className="text-[#1C1615] text-sm font-medium tracking-widest" style={{ fontFamily: "var(--font-body)" }}>₹{product.price.toFixed(0)}</p>
                              {product.original_price && product.original_price > product.price && (
                                <p className="text-[#6B635E]/50 text-xs line-through tracking-widest">₹{product.original_price.toFixed(0)}</p>
                              )}
                            </div>
                            {/* Star Ratings */}
                            <div className="flex items-center justify-center gap-1.5 mt-3">
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => {
                                  const rating = 3.5 + ((product.id * 7 + 3) % 15) / 10
                                  const filled = star <= Math.floor(rating)
                                  const half = !filled && star === Math.ceil(rating) && rating % 1 >= 0.3
                                  return (
                                    <Star
                                      key={star}
                                      className={`w-3 h-3 ${filled ? 'fill-[#D8B4A0] text-[#D8B4A0]' : half ? 'fill-[#D8B4A0]/50 text-[#D8B4A0]' : 'fill-transparent text-[#D8B4A0]/40'}`}
                                    />
                                  )
                                })}
                              </div>
                              <span className="text-[10px] text-[#6B635E] tracking-wider" style={{ fontFamily: "var(--font-body)" }}>
                                {(3.5 + ((product.id * 7 + 3) % 15) / 10).toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-14 pt-10 border-t border-[#D8B4A0]/20">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] border border-[#D8B4A0]/30 text-[#1C1615] hover:bg-[#1C1615] hover:text-[#FCFBF8] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 text-xs font-medium tracking-widest transition-all duration-300 ${currentPage === page
                      ? 'bg-[#1C1615] text-[#FCFBF8] border border-[#1C1615]'
                      : 'border border-[#D8B4A0]/30 text-[#6B635E] hover:border-[#1C1615] hover:text-[#1C1615]'
                      }`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] border border-[#D8B4A0]/30 text-[#1C1615] hover:bg-[#1C1615] hover:text-[#FCFBF8] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
