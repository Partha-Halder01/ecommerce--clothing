"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Star, Grid3X3, LayoutGrid } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SaleTimer } from "@/components/home/sale-timer"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface Product {
    id: number
    name: string
    slug: string
    price: number
    original_price?: number
    image_url: string
    category: string
    stock: number
}

interface Category {
    id: number
    name: string
    slug?: string
    description: string | null
    image_url: string | null
    is_active: boolean
    parent_id: number | null
}

export default function CategoryProductsPage() {
    const params = useParams()
    const categorySlug = params?.slug as string

    const [products, setProducts] = useState<Product[]>([])
    const [category, setCategory] = useState<Category | null>(null)
    const [subcategories, setSubcategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid')
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 12

    useEffect(() => {
        if (categorySlug) {
            fetchCategoryData()
        }
    }, [categorySlug])

    const fetchCategoryData = async () => {
        try {
            let currentCat: any = null
            const catRes = await fetch(`${API_BASE_URL}/api/categories`)
            if (catRes.ok) {
                const categories: any[] = await catRes.json()
                currentCat = categories.find((c: any) => (c.slug || "").toLowerCase() === categorySlug.toLowerCase())
                setCategory(currentCat || null)
                if (currentCat) {
                    const subs = categories.filter((c: any) => c.parent_id === currentCat.id && c.is_active)
                    setSubcategories(subs)
                }
            }
            const prodRes = await fetch(`${API_BASE_URL}/api/products`)
            if (prodRes.ok) {
                const allProducts: Product[] = await prodRes.json()
                const filtered = allProducts.filter(p =>
                    p.category?.toLowerCase() === ((currentCat?.name || "").toLowerCase())
                )
                setProducts(filtered)
            }
        } catch (error) {
            console.error("Failed to fetch category data:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const getRating = (id: number) => 3.5 + ((id * 7 + 3) % 15) / 10

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } }
    }
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FCFBF8]">
                <SaleTimer />
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="w-10 h-10 border-2 border-[#1C1615] border-t-transparent rounded-full animate-spin"></div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FCFBF8]">
            <SaleTimer />
            <Header />

            {/* Breadcrumb */}
            <div className="bg-[#FCFBF8] border-b border-[#D8B4A0]/20">
                <div className="container mx-auto px-4 py-3">
                    <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                        <Link href="/" className="text-[#D8B4A0] hover:text-[#1C1615] transition-colors" style={{ fontFamily: "var(--font-body)" }}>Home</Link>
                        <ChevronRight className="w-3 h-3 text-[#D8B4A0]/50" />
                        <Link href="/categories" className="text-[#D8B4A0] hover:text-[#1C1615] transition-colors" style={{ fontFamily: "var(--font-body)" }}>Categories</Link>
                        <ChevronRight className="w-3 h-3 text-[#D8B4A0]/50" />
                        <span className="text-[#1C1615] font-semibold" style={{ fontFamily: "var(--font-body)" }}>{category?.name || ""}</span>
                    </nav>
                </div>
            </div>

            {/* Category Hero Banner */}
            <section className="relative h-[28vh] sm:h-[35vh] overflow-hidden bg-[#1C1615]">
                <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
                    {category?.image_url ? (
                        <Image src={category.image_url} alt={category?.name || ""} fill className="object-cover object-center" />
                    ) : (
                        <img
                            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2000&auto=format&fit=crop"
                            alt="Category Banner"
                            className="w-full h-full object-cover object-center"
                        />
                    )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#1C1615]/80 via-[#1C1615]/40 to-[#1C1615]/90" />
                <div className="relative h-full container mx-auto px-4 flex flex-col items-center justify-center text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
                        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-light mb-3 text-[#FCFBF8] tracking-widest uppercase" style={{ fontFamily: "var(--font-playfair)" }}>
                            {category?.name || ""}
                        </h1>
                        {category?.description && (
                            <p className="text-xs sm:text-sm text-[#D8B4A0] max-w-lg mx-auto tracking-[0.2em] mb-2" style={{ fontFamily: "var(--font-body)" }}>
                                {category.description}
                            </p>
                        )}
                        <p className="text-[10px] sm:text-xs text-[#D8B4A0]/70 uppercase tracking-[0.3em]" style={{ fontFamily: "var(--font-body)" }}>
                            {products.length} {products.length === 1 ? 'piece' : 'pieces'} in collection
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-12 sm:py-16 border-t border-[#D8B4A0]/20">
                <div className="container mx-auto px-4 lg:px-8">
                    {/* Subcategories */}
                    {subcategories.length > 0 && (
                        <div className="mb-10 border-b border-[#D8B4A0]/20 pb-8">
                            <h2 className="text-xs font-semibold text-[#1C1615] mb-4 uppercase tracking-[0.2em]">Refine by Style</h2>
                            <div className="flex flex-wrap gap-3">
                                {subcategories.map((sub: any) => (
                                    <Link
                                        key={sub.id}
                                        href={`/category/${sub.slug || encodeURIComponent(sub.name)}`}
                                        className="px-6 py-2 text-xs uppercase tracking-[0.2em] border border-[#D8B4A0] text-[#1C1615] hover:bg-[#1C1615] hover:text-[#FCFBF8] hover:border-[#1C1615] transition-all duration-300"
                                        style={{ fontFamily: "var(--font-body)" }}
                                    >
                                        {sub.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Toolbar */}
                    <div className="flex items-center justify-between mb-8 border-b border-[#D8B4A0]/20 pb-4">
                        <p className="text-sm font-light text-[#6B635E] uppercase tracking-widest" style={{ fontFamily: "var(--font-body)" }}>
                            Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, products.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, products.length)} of {products.length} {products.length === 1 ? 'Item' : 'Items'}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 transition-colors ${viewMode === 'grid' ? 'text-[#1C1615] bg-[#1C1615]/5' : 'text-[#D8B4A0] hover:text-[#1C1615]'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('compact')}
                                className={`p-2 transition-colors ${viewMode === 'compact' ? 'text-[#1C1615] bg-[#1C1615]/5' : 'text-[#D8B4A0] hover:text-[#1C1615]'}`}
                            >
                                <Grid3X3 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {products.length === 0 ? (
                        <div className="text-center py-32 border border-[#D8B4A0]/20 bg-[#FCFBF8]">
                            <p className="text-[#1C1615] text-lg font-light tracking-wide uppercase mb-6" style={{ fontFamily: "var(--font-playfair)" }}>No products found in this collection</p>
                            <Link href="/shop">
                                <Button className="rounded-none bg-[#1C1615] text-[#FCFBF8] hover:bg-[#D8B4A0] hover:text-[#1C1615] uppercase tracking-widest px-8">Browse All</Button>
                            </Link>
                        </div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className={`grid gap-6 lg:gap-8 ${viewMode === 'grid'
                                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                                : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                                }`}
                        >
                            {products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((product) => {
                                const rating = getRating(product.id)
                                return (
                                    <motion.div variants={itemVariants} key={product.id}>
                                        <Link href={`/product/${product.slug}`} className="group block h-full">
                                            <div className="bg-[#FCFBF8] h-full flex flex-col border border-[#D8B4A0]/30 hover:border-[#D8B4A0]/70 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(216,180,160,0.15)]">
                                                <div className={`relative overflow-hidden bg-[#1C1615]/5 ${viewMode === 'grid' ? 'aspect-[3/4]' : 'aspect-square'}`}>
                                                    <Image
                                                        src={product.image_url || "/placeholder.svg"}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover transition-all duration-[1.2s] ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
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
                                                                {rating.toFixed(1)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Pagination */}
            {Math.ceil(products.length / ITEMS_PER_PAGE) > 1 && (
                <div className="container mx-auto px-4 lg:px-8 pb-16">
                    <div className="flex items-center justify-center gap-2 pt-10 border-t border-[#D8B4A0]/20">
                        <button
                            onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 400, behavior: 'smooth' }) }}
                            disabled={currentPage === 1}
                            className="px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] border border-[#D8B4A0]/30 text-[#1C1615] hover:bg-[#1C1615] hover:text-[#FCFBF8] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{ fontFamily: "var(--font-body)" }}
                        >
                            Previous
                        </button>
                        {Array.from({ length: Math.ceil(products.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => { setCurrentPage(page); window.scrollTo({ top: 400, behavior: 'smooth' }) }}
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
                            onClick={() => { setCurrentPage(p => Math.min(Math.ceil(products.length / ITEMS_PER_PAGE), p + 1)); window.scrollTo({ top: 400, behavior: 'smooth' }) }}
                            disabled={currentPage === Math.ceil(products.length / ITEMS_PER_PAGE)}
                            className="px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] border border-[#D8B4A0]/30 text-[#1C1615] hover:bg-[#1C1615] hover:text-[#FCFBF8] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{ fontFamily: "var(--font-body)" }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}
