"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { User, ShoppingBag, Menu, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"

const navLinks = [
  { href: "/shop", label: "Shop All" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [cartCount, setCartCount] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const updateCartCount = useCallback(() => {
    try {
      const saved = localStorage.getItem('cart')
      if (saved) {
        const cart = JSON.parse(saved)
        const total = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)
        setCartCount(total)
      } else {
        setCartCount(0)
      }
    } catch {
      setCartCount(0)
    }
  }, [])

  const checkAuthState = useCallback(() => {
    const user = getCurrentUser()
    setIsLoggedIn(!!user)
  }, [])

  useEffect(() => {
    checkAuthState()
    updateCartCount()

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkAuthState()
        updateCartCount()
      }
    }

    const handleStorage = () => {
      checkAuthState()
      updateCartCount()
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('storage', handleStorage)
    window.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [checkAuthState, updateCartCount])

  useEffect(() => {
    checkAuthState()
  }, [pathname, checkAuthState])

  const handleAccountClick = () => {
    const user = getCurrentUser()
    if (user) {
      router.push("/account")
    } else {
      router.push("/signup")
    }
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${scrolled
          ? "bg-[#1C1615]/95 backdrop-blur-md shadow-lg border-b border-[#D8B4A0]/10"
          : "bg-[#1C1615] border-b border-[#D8B4A0]/10"
          }`}
      >
        <div className="container mx-auto flex h-16 sm:h-[72px] items-center justify-between px-4 lg:px-8">
          {/* Left Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-300 ${isActive
                    ? "text-[#D8B4A0]"
                    : "text-[#FCFBF8]/60 hover:text-[#FCFBF8]"
                    }`}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 w-full h-px bg-[#D8B4A0]" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-[#FCFBF8]/70 hover:text-[#FCFBF8] transition-colors h-10 w-10 flex items-center justify-center"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Center Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <span
              className="text-xl sm:text-2xl font-bold tracking-[0.15em] uppercase text-[#FCFBF8]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Inyou
            </span>
          </Link>

          {/* Right Icons */}
          <div className="flex items-center gap-1 sm:gap-3">
            <button
              onClick={handleAccountClick}
              className="text-[#FCFBF8]/60 hover:text-[#D8B4A0] transition-colors h-10 w-10 flex items-center justify-center"
            >
              <User className="h-[18px] w-[18px]" />
            </button>
            <Link href="/cart" className="relative">
              <button className="text-[#FCFBF8]/60 hover:text-[#D8B4A0] transition-colors h-10 w-10 flex items-center justify-center">
                <ShoppingBag className="h-[18px] w-[18px]" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-0.5 h-4 w-4 bg-[#D8B4A0] text-[#1C1615] text-[9px] font-bold flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-[85vw] max-w-sm bg-[#1C1615] z-[70] flex flex-col border-r border-[#D8B4A0]/10"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#D8B4A0]/10">
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  <span className="text-2xl font-bold tracking-[0.15em] uppercase text-[#FCFBF8]" style={{ fontFamily: "var(--font-playfair)" }}>
                    Inyou
                  </span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-[#FCFBF8]/40 hover:text-[#FCFBF8] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 py-8 px-6 overflow-y-auto">
                <div className="space-y-1">
                  {navLinks.map((link, index) => {
                    const isActive = pathname === link.href
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={`block py-4 px-4 text-sm tracking-[0.2em] uppercase transition-all duration-300 ${isActive
                            ? "text-[#D8B4A0] bg-[#D8B4A0]/5 border-l-2 border-[#D8B4A0]"
                            : "text-[#FCFBF8]/60 hover:text-[#FCFBF8] hover:bg-[#FCFBF8]/5 border-l-2 border-transparent"
                            }`}
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>

                <div className="mt-8 pt-8 border-t border-[#D8B4A0]/10">
                  <Link
                    href="/cart"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-4 px-4 text-sm tracking-[0.2em] uppercase transition-all duration-300 text-[#FCFBF8]/60 hover:text-[#FCFBF8] hover:bg-[#FCFBF8]/5"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <span>Shopping Cart</span>
                    {cartCount > 0 && (
                      <span className="h-5 w-5 bg-[#D8B4A0] text-[#1C1615] text-[10px] font-bold flex items-center justify-center rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
              </nav>

              {/* Bottom Auth Section */}
              <div className="p-6 border-t border-[#D8B4A0]/10">
                {isLoggedIn ? (
                  <Link href="/account" onClick={() => setMobileOpen(false)}>
                    <button className="w-full py-3 bg-[#D8B4A0] text-[#1C1615] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#FCFBF8] transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                      My Account
                    </button>
                  </Link>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <button className="w-full py-3 border border-[#D8B4A0]/30 text-[#FCFBF8] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#FCFBF8]/5 transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                        Login
                      </button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)}>
                      <button className="w-full py-3 bg-[#D8B4A0] text-[#1C1615] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#FCFBF8] transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                        Create Account
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
