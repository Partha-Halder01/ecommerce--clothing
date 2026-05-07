"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SaleTimer } from "@/components/home/sale-timer"
import Link from "next/link"
import { User, Package, Heart, MapPin, LogOut, Loader2, Lock, History, ChevronRight, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentUser, authAPI, getAuthToken } from "@/lib/api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const menuItems = [
  { icon: User, label: "Profile", description: "Edit personal details & preferences", href: "/account/profile", color: "from-[#D8B4A0]/20 to-[#D8B4A0]/5" },
  { icon: Package, label: "My Orders", description: "Track & manage your purchases", href: "/account/orders", color: "from-[#C4A882]/20 to-[#C4A882]/5" },
  { icon: History, label: "Order History", description: "View all past transactions", href: "/account/order-history", color: "from-[#B8A08A]/20 to-[#B8A08A]/5" },
  { icon: Heart, label: "Wishlist", description: "Your saved favorites", href: "/account/wishlist", color: "from-[#D8B4A0]/20 to-[#D8B4A0]/5" },
  { icon: MapPin, label: "Addresses", description: "Manage delivery addresses", href: "/account/addresses", color: "from-[#C4A882]/20 to-[#C4A882]/5" },
  { icon: Lock, label: "Security", description: "Update password & security", href: "/forgot-password", color: "from-[#B8A08A]/20 to-[#B8A08A]/5" },
]

export default function AccountPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) { router.push("/signup"); return }

    setUserName(user.first_name || "there")
    setUserEmail(user.email || "")
    fetchOrders()
    setIsLoading(false)
  }, [router])

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/orders`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data.slice(0, 3))
      }
    } catch (error) {
      console.error('Failed to fetch orders')
    }
  }

  const handleLogout = () => {
    authAPI.logout()
    router.push("/")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'processing': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-[#F4F1EB] text-[#1C1615] border-[#E8E3DC]'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FCFBF8]">
        <SaleTimer />
        <Header />
        <main className="py-16 flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-2 border-[#1C1615] border-t-transparent rounded-full animate-spin"></div>
        </main>
        <Footer />
      </div>
    )
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as any } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  }

  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      <SaleTimer />
      <Header />
      <main>
        {/* Account Hero */}
        <section className="relative overflow-hidden bg-[#1C1615] py-14 sm:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #D8B4A0 0%, transparent 50%), radial-gradient(circle at 80% 50%, #C4A882 0%, transparent 50%)" }} />
          </div>
          {/* Decorative line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D8B4A0]/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D8B4A0]/30 to-transparent" />

          <div className="relative container mx-auto px-4 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 max-w-5xl mx-auto">
                <div className="flex items-center gap-5">
                  {/* Avatar */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-[#D8B4A0]/40 flex items-center justify-center bg-[#D8B4A0]/10 flex-shrink-0">
                    <span className="text-2xl sm:text-3xl font-light text-[#D8B4A0] uppercase" style={{ fontFamily: "var(--font-playfair)" }}>
                      {userName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#D8B4A0]/70 mb-1" style={{ fontFamily: "var(--font-body)" }}>Welcome back</p>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#FCFBF8] tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>
                      {userName}
                    </h1>
                    <p className="text-xs text-[#FCFBF8]/30 mt-1 tracking-wider" style={{ fontFamily: "var(--font-body)" }}>{userEmail}</p>
                  </div>
                </div>
                <Button onClick={handleLogout} variant="outline"
                  className="gap-2 bg-transparent border-[#D8B4A0]/30 text-[#FCFBF8]/60 hover:text-[#FCFBF8] hover:border-[#D8B4A0] rounded-none h-11 px-6 uppercase tracking-[0.15em] text-[10px] transition-all duration-300">
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Account Sections */}
        <section className="py-12 sm:py-16 lg:py-20">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="container mx-auto px-4 lg:px-8">
            <div className="max-w-5xl mx-auto">
              {/* Quick Actions Label */}
              <motion.div variants={fadeInUp} className="mb-8">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#D8B4A0] font-semibold" style={{ fontFamily: "var(--font-body)" }}>Quick Actions</p>
              </motion.div>

              {/* Menu Grid */}
              <motion.div variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {menuItems.map((item) => (
                  <motion.div key={item.label} variants={fadeInUp}>
                    <Link href={item.href}
                      className="group block h-full bg-[#FCFBF8] border border-[#E8E3DC] hover:border-[#D8B4A0] transition-all duration-500 hover:shadow-[0_8px_30px_rgba(216,180,160,0.12)] relative overflow-hidden">
                      {/* Gradient BG on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                      <div className="relative p-6 sm:p-8">
                        {/* Icon */}
                        <div className="w-11 h-11 sm:w-12 sm:h-12 border border-[#E8E3DC] group-hover:border-[#D8B4A0] flex items-center justify-center mb-5 transition-all duration-500 group-hover:bg-[#1C1615]">
                          <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#D8B4A0] group-hover:text-[#FCFBF8] transition-colors duration-500" />
                        </div>

                        {/* Text */}
                        <h3 className="font-light text-base sm:text-lg text-[#1C1615] tracking-wide mb-1.5 group-hover:text-[#1C1615]" style={{ fontFamily: "var(--font-playfair)" }}>
                          {item.label}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-[#6B635E] tracking-wide leading-relaxed hidden sm:block" style={{ fontFamily: "var(--font-body)" }}>
                          {item.description}
                        </p>

                        {/* Arrow */}
                        <div className="absolute top-6 sm:top-8 right-6 sm:right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                          <ArrowRight className="h-4 w-4 text-[#D8B4A0]" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {/* Recent Orders */}
              <motion.div variants={fadeInUp} className="mt-14 sm:mt-20">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#D8B4A0] font-semibold mb-2" style={{ fontFamily: "var(--font-body)" }}>Activity</p>
                    <h2 className="text-xl sm:text-2xl font-light text-[#1C1615] tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>Recent Orders</h2>
                  </div>
                  {orders.length > 0 && (
                    <Link href="/account/orders" className="text-[10px] uppercase tracking-[0.2em] text-[#D8B4A0] hover:text-[#1C1615] transition-colors border-b border-[#D8B4A0]/30 hover:border-[#1C1615] pb-0.5" style={{ fontFamily: "var(--font-body)" }}>
                      View All
                    </Link>
                  )}
                </div>

                <div className="border border-[#E8E3DC] bg-[#FCFBF8]">
                  {orders.length === 0 ? (
                    <div className="py-16 sm:py-20 text-center">
                      <div className="w-16 h-16 border border-[#E8E3DC] flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="h-6 w-6 text-[#D8B4A0]" />
                      </div>
                      <p className="text-sm text-[#6B635E] mb-1 tracking-wide" style={{ fontFamily: "var(--font-body)" }}>No orders yet</p>
                      <p className="text-xs text-[#6B635E]/60 mb-8 tracking-wide" style={{ fontFamily: "var(--font-body)" }}>Your purchase history will appear here</p>
                      <Link href="/shop">
                        <Button className="bg-[#1C1615] hover:bg-[#D8B4A0] text-[#FCFBF8] hover:text-[#1C1615] rounded-none h-12 px-10 uppercase tracking-[0.2em] text-[10px] font-medium transition-all duration-300">
                          Explore the Boutique
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      {orders.map((order, index) => (
                        <Link key={order.id} href={`/account/orders`}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-7 hover:bg-[#F4F1EB]/50 transition-all duration-300 group ${index < orders.length - 1 ? 'border-b border-[#E8E3DC]' : ''}`}
                        >
                          <div className="flex items-center gap-4 mb-3 sm:mb-0">
                            <div className="w-10 h-10 border border-[#E8E3DC] flex items-center justify-center flex-shrink-0 group-hover:border-[#D8B4A0] transition-colors">
                              <Package className="h-4 w-4 text-[#D8B4A0]" />
                            </div>
                            <div>
                              <p className="font-light text-[#1C1615] tracking-wide text-sm sm:text-base" style={{ fontFamily: "var(--font-playfair)" }}>
                                Order #{order.id}
                              </p>
                              <p className="text-[11px] text-[#6B635E] mt-0.5 tracking-wide" style={{ fontFamily: "var(--font-body)" }}>
                                {formatDate(order.created_at)} • ₹{order.total?.toFixed(0)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 pl-14 sm:pl-0">
                            <span className={`px-3 py-1 text-[10px] uppercase tracking-[0.15em] font-medium border ${getStatusColor(order.status)}`}
                              style={{ fontFamily: "var(--font-body)" }}>
                              {order.status}
                            </span>
                            <ChevronRight className="h-4 w-4 text-[#D8B4A0] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
