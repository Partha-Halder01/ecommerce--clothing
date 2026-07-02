"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Share2, Minus, Plus, Check, Star, Loader2, ChevronDown, ChevronLeft, ChevronRight, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Product, getCurrentUser } from "@/lib/api"
import { getProductTheme } from "@/lib/product-themes"
import { useToast } from "@/hooks/use-toast"
import { AuthModal } from "@/components/auth/auth-modal"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Format price with Indian currency format
const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)
}

interface Review {
  id: number; reviewer_name: string; rating: number; review_text: string; created_at: string
}

interface ProductDetailsProps { product: Product }

export function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedImage, setSelectedImage] = useState(0)
  const [slideDirection, setSlideDirection] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState<Review[]>([])
  const [avgRating, setAvgRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, text: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [reviewPage, setReviewPage] = useState(0)

  // Get FAQs from product (or empty array)
  const faqs: { question: string; answer: string }[] = (product as any).faqs || []

  const sizes = product?.sizes?.length ? product.sizes : []
  const colors = product?.colors?.length ? product.colors : []
  const [selectedColor, setSelectedColor] = useState(colors?.length ? colors[0] : null)

  // Filter gallery images by selected color
  const getFilteredGalleryImages = () => {
    if (!product.gallery_images?.length) return []
    return product.gallery_images
      .filter((img: any) => {
        // Handle both old string format and new object format
        if (typeof img === 'string') return true // Old format - show for all colors
        return img.color === null || img.color === selectedColor?.name
      })
      .map((img: any) => typeof img === 'string' ? img : img.url)
  }

  const productImages = [
    product.image_url || "/placeholder.svg",
    ...getFilteredGalleryImages()
  ].filter(Boolean)

  // Reset to first image when color changes
  useEffect(() => {
    setSelectedImage(0)
  }, [selectedColor])

  useEffect(() => {
    fetchReviews()
    // Check if product is in wishlist
    const saved = localStorage.getItem("wishlist")
    if (saved) {
      const wishlist = JSON.parse(saved)
      setIsInWishlist(wishlist.some((item: any) => item.id === product.id))
    }
  }, [product.id])

  const toggleWishlist = () => {
    const saved = localStorage.getItem("wishlist")
    let wishlist = saved ? JSON.parse(saved) : []

    if (isInWishlist) {
      wishlist = wishlist.filter((item: any) => item.id !== product.id)
      toast({ title: "Removed from Wishlist" })
    } else {
      wishlist.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.image_url || "/placeholder.svg",
        category: product.category
      })
      toast({ title: "Added to Wishlist", description: "View your wishlist in My Account" })
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist))
    setIsInWishlist(!isInWishlist)
  }

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${product.id}/reviews`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
        setAvgRating(data.rating?.average || 0)
        setReviewCount(data.rating?.count || 0)
      }
    } catch { }
  }

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on Inyou!`,
      url: shareUrl
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareUrl)
        toast({ title: "Link Copied!", description: "Product link copied to clipboard" })
      }
    } catch (error) {
      // User cancelled or error
      try {
        await navigator.clipboard.writeText(shareUrl)
        toast({ title: "Link Copied!", description: "Product link copied to clipboard" })
      } catch {
        toast({ title: "Error", description: "Failed to share", variant: "destructive" })
      }
    }
  }

  const addToCart = () => {
    const cartItem = {
      id: product.id, name: product.name, price: product.price, quantity,
      size: selectedSize, color: selectedColor?.name || "", image: product.image_url || "/placeholder.svg"
    }

    const existingCart = typeof window !== "undefined" ? localStorage.getItem("cart") : null
    const cart = existingCart ? JSON.parse(existingCart) : []

    const existingItemIndex = cart.findIndex(
      (item: any) => item.id === product.id && item.size === selectedSize && item.color === (selectedColor?.name || "")
    )

    if (existingItemIndex >= 0) { cart[existingItemIndex].quantity += quantity }
    else { cart.push(cartItem) }

    if (typeof window !== "undefined") localStorage.setItem("cart", JSON.stringify(cart))
    return true
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Select a volume",
        description: "Please choose a perfume volume (for example: 50ml or 100ml) before adding to cart.",
        variant: "destructive"
      })
      return
    }
    addToCart()
    toast({ title: "Added to Cart", description: `${product.name} added to your cart` })
  }

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast({
        title: "Select a volume",
        description: "Please choose a perfume volume (for example: 50ml or 100ml) before continuing to checkout.",
        variant: "destructive"
      })
      return
    }

    // Add to cart first
    addToCart()

    // Check if logged in
    const user = getCurrentUser()
    if (!user) {
      // Show auth modal - after login, redirect to cart
      setShowAuthModal(true)
    } else {
      // Already logged in, go to checkout
      router.push("/checkout")
    }
  }

  const handleAuthSuccess = () => {
    toast({ title: "Account Ready!", description: "Redirecting to cart..." })
    router.push("/cart")
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewForm.name.trim()) { toast({ title: "Please enter your name", variant: "destructive" }); return }

    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewer_name: reviewForm.name, rating: reviewForm.rating, review_text: reviewForm.text })
      })
      if (!response.ok) throw new Error('Failed to submit review')
      toast({ title: "Review Submitted", description: "Your review will appear after approval" })
      setReviewForm({ name: "", rating: 5, text: "" })
      setShowReviewForm(false)
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally { setIsSubmitting(false) }
  }

  const renderStars = (rating: number, interactive = false, onChange?: (r: number) => void) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => {
        const fillPercent = Math.min(100, Math.max(0, (rating - i + 1) * 100))
        return (
          <button key={i} type="button" disabled={!interactive} onClick={() => onChange?.(i)}
            className={interactive ? "cursor-pointer" : "cursor-default"}>
            <div className="relative h-4 w-4">
              <Star className="absolute h-4 w-4 text-gray-300" />
              {fillPercent > 0 && (
                <div style={{ width: `${fillPercent}%` }} className="absolute h-4 overflow-hidden">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const slideVariants = {
    enter: (dir: number) => ({ x: dir >= 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir >= 0 ? "-100%" : "100%", opacity: 0 }),
  }

  const goToImage = (dir: number) => {
    if (productImages.length <= 1) return
    setSlideDirection(dir)
    setSelectedImage((prev) => (prev + dir + productImages.length) % productImages.length)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    const SWIPE_THRESHOLD = 40
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      // Swipe left -> next image, swipe right -> previous image
      goToImage(deltaX < 0 ? 1 : -1)
    }
    touchStartX.current = null
  }

  const theme = getProductTheme(product.theme)

  return (
    <div style={theme.vars as React.CSSProperties}>
      <section className="py-6 sm:py-8 lg:py-12 bg-[var(--pt-wash)] overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 lg:items-start">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-3 sm:space-y-4 lg:sticky lg:top-24"
            >
              <div
                className="relative aspect-[3/4] lg:aspect-[4/5] max-w-lg mx-auto overflow-hidden bg-[#1C1615]/5 group/img border border-[var(--pt-accent-10)] hover:border-[var(--pt-accent-40)] transition-all duration-700 touch-pan-y"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <AnimatePresence initial={false} custom={slideDirection} mode="popLayout">
                  <motion.div
                    key={selectedImage}
                    custom={slideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image src={productImages[selectedImage] || "/placeholder.svg"} alt={product.name} fill priority sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
                  </motion.div>
                </AnimatePresence>
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-8 h-[1px] bg-[var(--pt-accent-40)] pointer-events-none z-10" />
                <div className="absolute top-0 left-0 w-[1px] h-8 bg-[var(--pt-accent-40)] pointer-events-none z-10" />
                <div className="absolute bottom-0 right-0 w-8 h-[1px] bg-[var(--pt-accent-40)] pointer-events-none z-10" />
                <div className="absolute bottom-0 right-0 w-[1px] h-8 bg-[var(--pt-accent-40)] pointer-events-none z-10" />
                {/* Watermark */}
                <div className="absolute bottom-4 left-4 pointer-events-none z-10">
                  <span className="text-[#FCFBF8]/40 text-[10px] font-bold tracking-[0.3em] uppercase select-none" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)', fontFamily: 'var(--font-playfair)' }}>Inyou</span>
                </div>
                {/* Prev / Next arrows (desktop hover, always tappable on touch) */}
                {productImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => goToImage(-1)}
                      aria-label="Previous image"
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1C1615]/40 backdrop-blur-sm text-[#FCFBF8] flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 hover:bg-[#1C1615]/70"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => goToImage(1)}
                      aria-label="Next image"
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1C1615]/40 backdrop-blur-sm text-[#FCFBF8] flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 hover:bg-[#1C1615]/70"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    {/* Dot indicators (visible on mobile where hover arrows don't apply) */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 sm:hidden">
                      {productImages.map((_, i) => (
                        <span
                          key={i}
                          className={`h-1.5 rounded-full transition-all duration-300 ${i === selectedImage ? "w-4 bg-[#FCFBF8]" : "w-1.5 bg-[#FCFBF8]/40"}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
                  {productImages.map((image, index) => (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      key={index}
                      onClick={() => {
                        setSlideDirection(index > selectedImage ? 1 : -1)
                        setSelectedImage(index)
                      }}
                      className={`relative aspect-square overflow-hidden bg-[#FCFBF8] ${selectedImage === index ? "ring-2 ring-[var(--pt-accent)]" : "ring-1 ring-[var(--pt-accent-20)] hover:ring-[var(--pt-accent-50)]"} transition-all duration-300`}>
                      <Image src={image || "/placeholder.svg"} alt={`${product.name} ${index + 1}`} fill loading="lazy" sizes="(max-width: 1024px) 22vw, 110px" className="object-contain" />
                      {/* Watermark */}
                      <div className="absolute bottom-1 left-1 pointer-events-none">
                        <span className="text-[#FCFBF8]/50 text-[8px] font-bold tracking-widest uppercase select-none" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Inyou</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="lg:py-4"
            >
              <motion.div variants={fadeIn} className="flex items-start justify-between gap-4 mb-6 sm:mb-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--pt-accent)] mb-3" style={{ fontFamily: "var(--font-body)" }}>{product.category}</p>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light mb-4 text-[#1C1615] uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>{product.name}</h1>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl sm:text-3xl font-medium text-[#1C1615] tracking-widest" style={{ fontFamily: "var(--font-body)" }}>{formatPrice(product.price)}</span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-lg text-[#6B635E]/50 line-through tracking-widest" style={{ fontFamily: "var(--font-body)" }}>{formatPrice(product.original_price)}</span>
                    )}
                    {reviewCount > 0 && (
                      <div className="flex items-center gap-1.5 ml-2">
                        {renderStars(Math.round(avgRating))}
                        <span className="text-xs text-[#6B635E]">({reviewCount})</span>
                      </div>
                    )}
                  </div>
                  {product.stock === 0 && <p className="text-xs text-red-600 mt-3 uppercase tracking-widest">Currently Unavailable</p>}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className={`rounded-full border-[var(--pt-accent)] transition-transform hover:scale-110 ${isInWishlist ? 'bg-red-50' : 'bg-transparent'}`} onClick={toggleWishlist}><Heart className={`h-4 w-4 ${isInWishlist ? 'text-red-500 fill-red-500' : 'text-[#1C1615]'}`} /></Button>
                  <Button variant="outline" size="icon" className="rounded-full bg-transparent border-[var(--pt-accent)] transition-transform hover:scale-110" onClick={handleShare}><Share2 className="h-4 w-4 text-[#1C1615]" /></Button>
                </div>
              </motion.div>

              {product.description && (
                <motion.p variants={fadeIn} className="text-sm text-[#6B635E] mb-8 leading-relaxed tracking-wide" style={{ fontFamily: "var(--font-body)" }}>
                  {product.description}
                </motion.p>
              )}

              {/* Color Selection */}
              {colors && colors.length > 0 && (
                <motion.div variants={fadeIn} className="mb-6">
                  <p className="text-sm font-medium mb-3 text-[#1C1615]">Color: {selectedColor?.name}</p>
                  <div className="flex gap-3">
                    {colors.map((color: any) => (
                      <button key={color.name} onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-110 ${selectedColor?.name === color.name ? "border-[var(--pt-dark)]" : "border-transparent"}`}
                        style={{ backgroundColor: color.value }}>
                        {selectedColor?.name === color.name && <Check className="h-4 w-4 text-[#FCFBF8] drop-shadow-md" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Volume Selection */}
              {sizes && sizes.length > 0 && (
                <motion.div variants={fadeIn} className="mb-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold uppercase tracking-widest text-[#1C1615]">Select Volume</label>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[70px] h-10 px-4 flex items-center justify-center border text-sm transition-all duration-300 ${selectedSize === size
                          ? "border-[var(--pt-dark)] bg-[var(--pt-dark)] text-[#FCFBF8]"
                          : "border-[var(--pt-dark)]/10 text-[#1C1615]/60 hover:border-[var(--pt-dark)]/30"
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Quantity */}
              <motion.div variants={fadeIn} className="mb-6">
                <p className="text-sm font-medium mb-3 text-[#1C1615]">Quantity</p>
                <div className="flex items-center border border-[var(--pt-accent)] rounded-lg w-fit">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2.5 hover:bg-[var(--pt-accent-20)] text-[#1C1615] transition-colors"><Minus className="h-4 w-4" /></button>
                  <span className="w-10 text-center font-medium text-[#1C1615]">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2.5 hover:bg-[var(--pt-accent-20)] text-[#1C1615] transition-colors"><Plus className="h-4 w-4" /></button>
                </div>
              </motion.div>

              {/* Buttons - Side by Side on All Screens */}
              <motion.div variants={fadeIn} className="flex flex-row gap-3 mb-8">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 h-14 sm:h-12 bg-[var(--pt-dark)] hover:bg-[var(--pt-accent)] text-[#FCFBF8] rounded-none uppercase tracking-widest font-bold transition-all duration-300"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 h-14 sm:h-12 bg-[#FCFBF8] border border-[var(--pt-dark)] text-[#1C1615] hover:bg-[var(--pt-dark)] hover:text-[#FCFBF8] rounded-none uppercase tracking-widest font-bold transition-all duration-300"
                >
                  Buy Now
                </Button>
              </motion.div>

              {/* Product Details */}
              <motion.div variants={fadeIn} className="border-t border-[var(--pt-accent-20)] pt-8">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-[var(--pt-accent)]" style={{ fontFamily: "var(--font-body)" }}>Product Details</h3>
                <ul className="space-y-2 text-sm text-[#1C1615]/80">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--pt-dark)]" />Category: {product.category}</li>
                  {product.stock > 0 && (
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--pt-dark)]" />
                      {product.stock < 20 ? "Limited Stock — order soon" : "In Stock"}
                    </li>
                  )}
                </ul>
              </motion.div>
            </motion.div>
          </div>

          {/* Reviews Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mt-12 pt-8 border-t border-[var(--pt-accent-30)]"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl sm:text-2xl font-light text-[#1C1615] uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>Customer Reviews</h2>
              <Button variant="outline" onClick={() => setShowReviewForm(!showReviewForm)} className="rounded-none bg-transparent border-[var(--pt-accent)] text-[#1C1615] hover:bg-[var(--pt-dark)] hover:text-[#FCFBF8] uppercase tracking-widest text-[10px] px-6">
                Write a Review
              </Button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form onSubmit={submitReview} className="bg-[#FCFBF8] rounded-xl p-6 mb-6 border border-[var(--pt-accent-30)]">
                <h3 className="font-semibold mb-4 text-[#1C1615]">Write Your Review</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-[#1C1615]">Your Name</label>
                    <Input value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      className="mt-1" placeholder="John Doe" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#1C1615]">Rating</label>
                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <button key={i} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: i })}>
                          <Star className={`h-6 w-6 ${i <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#1C1615]">Review</label>
                    <Textarea value={reviewForm.text} onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                      className="mt-1" rows={3} placeholder="Share your experience..." />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="bg-[var(--pt-dark)] hover:bg-[var(--pt-dark)]">
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Submit Review
                  </Button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="relative">
                {/* Reviews Grid - 3 per page */}
                <div className="space-y-4">
                  {reviews.slice(reviewPage * 3, reviewPage * 3 + 3).map((review) => (
                    <div key={review.id} className="bg-[#FCFBF8] rounded-xl p-6 border border-[var(--pt-accent-30)]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-[#1C1615]">{review.reviewer_name}</span>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-sm text-[#1C1615]/80 mb-2">{review.review_text || <em className="text-muted-foreground">No review text</em>}</p>
                      <p className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {reviews.length > 3 && (
                  <div className="flex items-center justify-center gap-4 mt-6">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setReviewPage(prev => Math.max(0, prev - 1))}
                      disabled={reviewPage === 0}
                      className="border-[var(--pt-dark)] text-[#1C1615] hover:bg-[var(--pt-dark)] hover:text-[#FCFBF8] disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.ceil(reviews.length / 3) }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setReviewPage(idx)}
                          className={`w-2.5 h-2.5 rounded-full transition-colors ${reviewPage === idx ? 'bg-[var(--pt-dark)]' : 'bg-[var(--pt-accent-40)] hover:bg-[var(--pt-accent)]'
                            }`}
                        />
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setReviewPage(prev => Math.min(Math.ceil(reviews.length / 3) - 1, prev + 1))}
                      disabled={reviewPage >= Math.ceil(reviews.length / 3) - 1}
                      className="border-[var(--pt-dark)] text-[#1C1615] hover:bg-[var(--pt-dark)] hover:text-[#FCFBF8] disabled:opacity-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* FAQs Section */}
      {faqs.length > 0 && (
        <section className="py-12 sm:py-16 bg-[#F4F1EB]">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
            <h2 className="text-xl sm:text-2xl font-light text-[#1C1615] mb-8 uppercase tracking-widest text-center" style={{ fontFamily: "var(--font-playfair)" }}>Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-[var(--pt-accent-20)] overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left bg-[#FCFBF8] hover:bg-[#F4F1EB] transition-colors"
                  >
                    <span className="font-medium text-[#1C1615]">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-[#1C1615] transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === index && (
                    <div className="p-4 bg-[#FCFBF8] text-sm text-[#1C1615]/80 leading-relaxed border-t border-[var(--pt-accent-30)]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Auth Modal for Buy Now */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        title="Create Account to Continue"
        message="Sign up to complete your purchase"
      />
    </div>
  )
}
