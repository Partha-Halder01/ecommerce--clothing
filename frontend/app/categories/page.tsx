"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SaleTimer } from "@/components/home/sale-timer"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface Category {
    id: number
    name: string
    slug?: string
    description: string | null
    image_url: string | null
    is_active: boolean
    parent_id: number | null
}

interface Product {
    id: number
    category: string
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        Promise.all([fetchCategories(), fetchProducts()]).finally(() => setIsLoading(false))
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/categories`)
            if (response.ok) {
                const data = await response.json()
                setCategories(data)
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error)
        }
    }

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/products`)
            if (response.ok) {
                const data = await response.json()
                setProducts(data.products || data)
            }
        } catch (error) {
            console.error("Failed to fetch products:", error)
        }
    }

    const parentCategories = categories.filter(c => !c.parent_id && c.is_active)
    const getSubcategories = (parentId: number) => categories.filter(c => c.parent_id === parentId && c.is_active)

    const getProductCount = (categoryName: string) => {
        return products.filter(p =>
            p.category && p.category.toLowerCase().replace(/['']/g, "'") === categoryName.toLowerCase().replace(/['']/g, "'")
        ).length
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

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } }
    }

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    }

    const categoryDescriptions: Record<string, string> = {
        "Men's Fragrances": "Bold, refined scents crafted for the modern gentleman",
        "Women's Fragrances": "Elegant, captivating fragrances for the sophisticated woman",
        "Unisex": "Boundary-defying scents for the free-spirited individual",
    }

    return (
        <div className="min-h-screen bg-[#FCFBF8]">
            <SaleTimer />
            <Header />

            {/* Luxury Hero Banner — same as Shop page */}
            <section className="relative h-[30vh] sm:h-[40vh] overflow-hidden bg-[#1C1615]">
                <div className="absolute inset-0 opacity-50 mix-blend-luminosity">
                    <img
                        src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2000&auto=format&fit=crop"
                        alt="Categories Banner"
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
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light mb-4 text-[#FCFBF8] tracking-widest uppercase" style={{ fontFamily: "var(--font-playfair)" }}>The Categories</h1>
                        <p className="text-xs sm:text-sm text-[#D8B4A0] max-w-lg mx-auto uppercase tracking-[0.3em]" style={{ fontFamily: "var(--font-body)" }}>
                            Discover our curated families of exquisite fragrances
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-16 sm:py-24">
                <div className="container mx-auto px-4 lg:px-8">
                    {parentCategories.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-[#6B635E] text-lg font-light tracking-wide">No categories available yet.</p>
                        </div>
                    ) : (
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
                        >
                            {parentCategories.map((category, index) => {
                                const productCount = getProductCount(category.name)
                                const description = categoryDescriptions[category.name] || category.description || "Explore our exclusive collection"
                                const fallbackImages = [
                                    "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop",
                                    "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop",
                                    "https://images.unsplash.com/photo-1622618991746-fe6008162edb?q=80&w=800&auto=format&fit=crop",
                                ]
                                const bgImage = category.image_url || fallbackImages[index % fallbackImages.length]

                                return (
                                    <motion.div key={category.id} variants={fadeInUp}>
                                        <Link href={`/category/${category.slug || encodeURIComponent(category.name)}`} className="group block">
                                            <div className="border border-[#E8E3DC] hover:border-[#D8B4A0]/50 transition-all duration-700 hover:shadow-[0_12px_40px_rgba(216,180,160,0.15)] overflow-hidden bg-[#FCFBF8]">
                                                {/* Image */}
                                                <div className="relative aspect-[4/5] overflow-hidden">
                                                    <img
                                                        src={bgImage}
                                                        alt={category.name}
                                                        className="w-full h-full object-cover transition-all duration-[1.5s] ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                                    />
                                                    {/* Gradient overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1615]/70 via-[#1C1615]/20 to-transparent" />

                                                    {/* Shimmer lines */}
                                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D8B4A0] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D8B4A0] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                                    {/* Product count badge */}
                                                    <div className="absolute top-5 right-5">
                                                        <span className="text-[10px] tracking-[0.2em] uppercase text-[#FCFBF8]/80 bg-[#1C1615]/40 backdrop-blur-sm border border-[#FCFBF8]/10 px-3 py-1.5" style={{ fontFamily: "var(--font-body)" }}>
                                                            {productCount} {productCount === 1 ? 'Product' : 'Products'}
                                                        </span>
                                                    </div>

                                                    {/* Explore CTA */}
                                                    <div className="absolute bottom-6 left-0 w-full text-center">
                                                        <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] text-[#FCFBF8] uppercase border border-[#FCFBF8]/30 px-6 py-2.5 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500 backdrop-blur-sm bg-[#1C1615]/20 hover:bg-[#FCFBF8] hover:text-[#1C1615]" style={{ fontFamily: "var(--font-body)" }}>
                                                            Explore <ArrowRight className="w-3 h-3" />
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Text content */}
                                                <div className="p-6 sm:p-8 text-center border-t border-[#E8E3DC]">
                                                    <h3 className="text-lg sm:text-xl font-light text-[#1C1615] uppercase tracking-[0.12em] mb-2 group-hover:text-[#D8B4A0] transition-colors duration-500" style={{ fontFamily: "var(--font-playfair)" }}>
                                                        {category.name}
                                                    </h3>
                                                    <p className="text-[11px] text-[#6B635E] tracking-wide leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                                                        {description}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    )}

                    {/* All Categories Tags */}
                    {categories.filter(c => c.is_active).length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="mt-20 sm:mt-28 max-w-4xl mx-auto text-center"
                        >
                            <div className="w-16 h-[1px] bg-[#D8B4A0]/30 mx-auto mb-8" />
                            <p className="text-[10px] uppercase tracking-[0.3em] text-[#D8B4A0] font-semibold mb-8" style={{ fontFamily: "var(--font-body)" }}>
                                Browse All
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                {categories.filter(c => c.is_active).map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/category/${cat.slug || encodeURIComponent(cat.name)}`}
                                        className="px-6 py-3 border border-[#E8E3DC] text-[#6B635E] hover:border-[#D8B4A0] hover:text-[#1C1615] hover:bg-[#D8B4A0]/5 transition-all duration-300 text-xs uppercase tracking-[0.15em]"
                                        style={{ fontFamily: "var(--font-body)" }}
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    )
}
