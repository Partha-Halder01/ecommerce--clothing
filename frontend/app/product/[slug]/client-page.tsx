"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SaleTimer } from "@/components/home/sale-timer"
import { ProductDetails } from "@/components/product/product-details"
import { publicProductsAPI, Product } from "@/lib/api"
import Link from "next/link"
import { motion } from "framer-motion"

export default function ProductPageClient() {
    const params = useParams()
    const slug = params?.slug as string
    const [product, setProduct] = useState<Product | null>(null)
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (slug) {
            fetchProduct()
        }
    }, [slug])

    const fetchProduct = async () => {
        if (!slug) return
        try {
            const data = await publicProductsAPI.getBySlug(slug)
            setProduct(data)

            const relatedIds = (data as any).related_products || []
            if (relatedIds.length > 0) {
                const allProducts = await publicProductsAPI.getAll()
                const related = allProducts.filter((p: Product) => relatedIds.includes(p.id))
                setRelatedProducts(related)
            }
        } catch (error) {
            console.error("Failed to fetch product:", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FCFBF8]">
                <SaleTimer />
                <Header />
                <main className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1C1615]"></div>
                </main>
                <Footer />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#FCFBF8]">
                <SaleTimer />
                <Header />
                <main className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                    <p className="text-[#1C1615] text-2xl font-light uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>Product not found</p>
                    <Link href="/shop" className="text-xs text-[#D8B4A0] uppercase tracking-[0.2em] hover:text-[#1C1615] transition-colors border-b border-[#D8B4A0] pb-1">
                        Return to Boutique
                    </Link>
                </main>
                <Footer />
            </div>
        )
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.12 } }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    }

    return (
        <div className="min-h-screen bg-[#FCFBF8]">
            <SaleTimer />
            <Header />
            <main>
                <ProductDetails product={product} />

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <section className="py-16 sm:py-24 bg-[#1C1615]">
                        <div className="container mx-auto px-4 lg:px-8">
                            <div className="text-center mb-12 sm:mb-16">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <div className="flex items-center justify-center gap-6 mb-6">
                                        <div className="h-px w-12 bg-[#D8B4A0]/50" />
                                        <p className="text-[10px] text-[#D8B4A0] uppercase tracking-[0.4em]" style={{ fontFamily: "var(--font-body)" }}>Curated for you</p>
                                        <div className="h-px w-12 bg-[#D8B4A0]/50" />
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl font-light text-[#FCFBF8] uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>
                                        You May Also Like
                                    </h2>
                                </motion.div>
                            </div>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true }}
                                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8"
                            >
                                {relatedProducts.map((p) => (
                                    <motion.div variants={itemVariants} key={p.id}>
                                        <Link href={`/product/${p.id}`} className="group block">
                                            <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-[#FCFBF8]/5">
                                                <img
                                                    src={p.image_url || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop"}
                                                    alt={p.name}
                                                    className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1615]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                <div className="absolute bottom-4 left-0 w-full text-center">
                                                    <span className="text-[#FCFBF8] text-[10px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 font-medium" style={{ fontFamily: "var(--font-body)" }}>
                                                        View Details
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] uppercase tracking-[0.2em] text-[#D8B4A0]/60 mb-1">{p.category}</p>
                                                <h3 className="font-light text-base text-[#FCFBF8] uppercase tracking-widest line-clamp-1 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>{p.name}</h3>
                                                <div className="flex items-center justify-center gap-3">
                                                    <p className="text-[#FCFBF8] text-sm tracking-widest">₹{p.price.toFixed(0)}</p>
                                                    {p.original_price && p.original_price > p.price && (
                                                        <p className="text-[#FCFBF8]/30 text-xs line-through tracking-widest">₹{p.original_price.toFixed(0)}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </div>
    )
}
