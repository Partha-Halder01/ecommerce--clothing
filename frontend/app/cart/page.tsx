"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Minus, Plus, X, ShoppingBag, ArrowLeft, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { getCurrentUser } from "@/lib/api"
import { AuthModal } from "@/components/auth/auth-modal"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function CartPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [promoCode, setPromoCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ id: number, discount: number, code: string } | null>(null)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [shippingSettings, setShippingSettings] = useState({ free_delivery_minimum: 800, delivery_charge: 85 })

  useEffect(() => {
    // Load cart from localStorage
    const cart = typeof window !== "undefined" ? localStorage.getItem("cart") : null
    if (cart) {
      setCartItems(JSON.parse(cart))
    }

    // Fetch shipping settings
    const fetchShippingSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/settings/shipping`)
        if (res.ok) {
          const data = await res.json()
          setShippingSettings(data)
        }
      } catch (e) { /* use defaults */ }
    }
    fetchShippingSettings()
  }, [])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    const updated = cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    setCartItems(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(updated))
    }
  }

  const removeItem = (id: number) => {
    const updated = cartItems.filter((item) => item.id !== id)
    setCartItems(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(updated))
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = appliedCoupon?.discount || 0
  const shippingCost = subtotal >= shippingSettings.free_delivery_minimum ? 0 : shippingSettings.delivery_charge
  const tax = Math.round((subtotal - discount) * 0.04)
  const total = subtotal - discount + shippingCost + tax

  const applyPromo = async () => {
    if (!promoCode.trim()) return
    setIsApplyingCoupon(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode, order_total: subtotal })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Invalid coupon')

      const coupon = { id: data.coupon_id, discount: data.discount, code: promoCode.toUpperCase() }
      setAppliedCoupon(coupon)
      // Store in localStorage so checkout can use it
      localStorage.setItem('appliedCoupon', JSON.stringify(coupon))
      toast({ title: "Coupon Applied!", description: `You saved ₹${data.discount.toFixed(0)}!` })
      setPromoCode("")
    } catch (error: any) {
      toast({ title: "Invalid Coupon", description: error.message, variant: "destructive" })
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    localStorage.removeItem('appliedCoupon')
  }

  const handleCheckout = () => {
    const user = getCurrentUser()
    if (!user) {
      setShowAuthModal(true)
    } else {
      router.push("/checkout")
    }
  }

  const handleAuthSuccess = () => {
    toast({ title: "Account Ready!", description: "Proceeding to checkout..." })
    router.push("/checkout")
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#FCFBF8]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 py-12 sm:py-20"
        >
          <div className="max-w-md mx-auto text-center border border-[#E8E3DC] bg-[#F4F1EB] p-12 shadow-sm">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full bg-[#E8E3DC] flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-[#6B635E]" />
            </div>
            <h1
              className="text-2xl sm:text-3xl font-light text-[#1C1615] mb-4 tracking-wide"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Your Cart is Empty
            </h1>
            <p className="text-[#6B635E] mb-8" style={{ fontFamily: "var(--font-body)" }}>
              Explore our collections and discover your next signature scent.
            </p>
            <Link href="/shop">
              <Button size="lg" className="w-full sm:w-auto bg-[#1C1615] hover:bg-[#D8B4A0] text-[#FCFBF8] rounded-none uppercase tracking-widest font-bold transition-all duration-300">
                Continue Exploring
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <>
      <main className="min-h-screen bg-[#FCFBF8]">
        <div className="container mx-auto px-4 py-6 sm:py-12 max-w-7xl">
          {/* Back button */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[#6B635E] hover:text-[#D8B4A0] transition-colors mb-6 sm:mb-8 uppercase tracking-widest text-xs font-semibold"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#1C1615] mb-8 sm:mb-12 tracking-wide"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Shopping Cart
            <span className="text-[#6B635E] text-lg sm:text-xl font-normal ml-3" style={{ fontFamily: "var(--font-body)" }}>
              ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
            </span>
          </h1>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Cart Items */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="lg:col-span-2 space-y-4"
            >
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    variants={itemVariants}
                    layout
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, x: -50, height: 0, marginBottom: 0, padding: 0 }}
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="bg-[#F4F1EB] p-4 sm:p-6 border border-[#E8E3DC] shadow-sm flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center"
                  >
                    {/* Product Image */}
                    <div className="relative w-24 h-32 sm:w-28 sm:h-36 flex-shrink-0 bg-[#FCFBF8] border border-[#E8E3DC]">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover p-1" />
                      {/* Watermark */}
                      <div className="absolute inset-x-0 bottom-2 flex justify-center pointer-events-none">
                        <span className="text-[#1C1615]/30 text-[10px] font-bold tracking-widest uppercase select-none bg-white/50 px-2 py-0.5 rounded-sm">Inyou</span>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3
                            className="font-semibold text-[#1C1615] text-base sm:text-lg line-clamp-2 tracking-wide"
                            style={{ fontFamily: "var(--font-playfair)" }}
                          >
                            {item.name}
                          </h3>
                          <p
                            className="text-xs sm:text-sm text-[#6B635E] mt-2 uppercase tracking-wider"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            Vol: {item.size} <span className="mx-2">•</span> Color: {item.color || 'Signature'}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 hover:bg-[#D8B4A0]/20 rounded-full transition-colors flex-shrink-0"
                        >
                          <X className="w-5 h-5 text-[#1C1615]" />
                        </button>
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center bg-[#FCFBF8] border border-[#D8B4A0] w-fit">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-[#D8B4A0]/20 transition-colors text-[#1C1615]"
                          >
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <span
                            className="w-8 sm:w-10 text-center font-medium text-sm sm:text-base text-[#1C1615]"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-[#D8B4A0]/20 transition-colors text-[#1C1615]"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                        <p
                          className="font-medium text-[#1C1615] tracking-widest text-base sm:text-lg"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-[#F4F1EB] p-6 sm:p-8 border border-[#E8E3DC] shadow-sm sticky top-24">
                <h2
                  className="text-xl sm:text-2xl font-semibold text-[#1C1615] mb-6 uppercase tracking-widest text-center border-b border-[#D8B4A0] pb-4"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Order Summary
                </h2>

                {/* Promo Code */}
                {!appliedCoupon ? (
                  <div className="flex gap-2 mb-5">
                    <Input
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="flex-1 text-sm bg-[#FCFBF8] border-[#E8E3DC] focus-visible:ring-[#D8B4A0]"
                      style={{ fontFamily: "var(--font-body)" }}
                    />
                    <Button
                      variant="outline"
                      onClick={applyPromo}
                      disabled={isApplyingCoupon || !promoCode.trim()}
                      className="text-sm px-4 bg-[#FCFBF8] border-[#1C1615] text-[#1C1615] hover:bg-[#1C1615] hover:text-[#FCFBF8] rounded-none uppercase tracking-widest transition-all duration-300"
                    >
                      {isApplyingCoupon ? "..." : "Apply"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 text-green-700 p-3 rounded-lg mb-5 text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      ✓ {appliedCoupon.code} - ₹{appliedCoupon.discount.toFixed(0)} off
                    </span>
                    <button onClick={removeCoupon} className="text-green-700 hover:text-green-900">
                      ✕
                    </button>
                  </div>
                )}

                <Separator className="my-4" />

                {/* Price Breakdown */}
                <div className="space-y-4 text-[#6B635E]" style={{ fontFamily: "var(--font-body)" }}>
                  <div className="flex justify-between text-sm uppercase tracking-wider">
                    <span>Subtotal</span>
                    <span className="font-medium text-[#1C1615]">₹{subtotal.toFixed(0)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm uppercase tracking-wider text-[#D8B4A0] font-semibold">
                      <span>Discount</span>
                      <span>-₹{discount.toFixed(0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm uppercase tracking-wider">
                    <span>Shipping</span>
                    <span className={`font-medium ${shippingCost === 0 ? 'text-[#D8B4A0]' : 'text-[#1C1615]'}`}>{shippingCost === 0 ? 'Complimentary' : `₹${shippingCost}`}</span>
                  </div>
                  <div className="flex justify-between text-sm uppercase tracking-wider">
                    <span>Tax</span>
                    <span className="font-medium text-[#1C1615]">₹{tax}</span>
                  </div>
                </div>

                <Separator className="my-6 bg-[#D8B4A0]/40" />

                <div className="flex justify-between items-center mb-8">
                  <span className="font-semibold text-[#1C1615] uppercase tracking-widest text-sm" style={{ fontFamily: "var(--font-body)" }}>
                    Estimated Total
                  </span>
                  <span className="text-xl sm:text-2xl font-light text-[#1C1615] tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>
                    ₹{total.toFixed(0)}
                  </span>
                </div>

                <Button size="lg" className="w-full h-14 bg-[#1C1615] hover:bg-[#D8B4A0] text-[#FCFBF8] rounded-none shadow-none text-base uppercase tracking-widest font-bold transition-all duration-300" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-[#D8B4A0]/40">
                  <div className="text-center group">
                    <Truck className="w-5 h-5 mx-auto text-[#1C1615] mb-2 transition-transform group-hover:-translate-y-1 duration-300" />
                    <p
                      className="text-[9px] sm:text-[10px] text-[#6B635E] uppercase tracking-widest font-semibold"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Complimentary<br />Shipping
                    </p>
                  </div>
                  <div className="text-center group">
                    <Shield className="w-5 h-5 mx-auto text-[#1C1615] mb-2 transition-transform group-hover:-translate-y-1 duration-300" />
                    <p
                      className="text-[9px] sm:text-[10px] text-[#6B635E] uppercase tracking-widest font-semibold"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Secure<br />Checkout
                    </p>
                  </div>
                  <div className="text-center group">
                    <RotateCcw className="w-5 h-5 mx-auto text-[#1C1615] mb-2 transition-transform group-hover:-rotate-45 duration-300" />
                    <p
                      className="text-[9px] sm:text-[10px] text-[#6B635E] uppercase tracking-widest font-semibold"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Signature<br />Returns
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        title="Create Account to Checkout"
        message="Sign up or login to complete your purchase"
      />
    </>
  )
}
