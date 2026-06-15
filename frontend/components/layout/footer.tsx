"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Instagram, Facebook, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react"
import { getCurrentUser } from "@/lib/api"

export function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    setIsLoggedIn(!!user)
  }, [])

  return (
    <footer className="bg-[#1C1615] text-[#FCFBF8] border-t border-[#D8B4A0]/10">
      {/* Newsletter Strip */}
      <div className="border-b border-[#D8B4A0]/10">
        <div className="container mx-auto px-4 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-light uppercase tracking-[0.15em] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                Stay Connected
              </h3>
              <p className="text-[#FCFBF8]/40 text-xs sm:text-sm tracking-wide" style={{ fontFamily: "var(--font-body)" }}>
                Be the first to discover new arrivals and exclusive offers
              </p>
            </div>
            <div className="flex gap-5">
              <a href="#" className="w-10 h-10 border border-[#D8B4A0]/20 flex items-center justify-center text-[#FCFBF8]/40 hover:text-[#D8B4A0] hover:border-[#D8B4A0] transition-all duration-300">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 border border-[#D8B4A0]/20 flex items-center justify-center text-[#FCFBF8]/40 hover:text-[#D8B4A0] hover:border-[#D8B4A0] transition-all duration-300">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 border border-[#D8B4A0]/20 flex items-center justify-center text-[#FCFBF8]/40 hover:text-[#D8B4A0] hover:border-[#D8B4A0] transition-all duration-300">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 border border-[#D8B4A0]/20 flex items-center justify-center text-[#FCFBF8]/40 hover:text-[#D8B4A0] hover:border-[#D8B4A0] transition-all duration-300">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1 space-y-6">
            <img src="/logo-light.png" alt="In You" className="h-16 w-auto object-contain" />
            <p className="text-[13px] text-[#FCFBF8]/40 leading-relaxed max-w-xs tracking-wide" style={{ fontFamily: "var(--font-body)" }}>
              The essence of your presence. Luxury perfumes crafted for the modern individual.
            </p>
            <div className="space-y-3 text-[#FCFBF8]/40 text-xs" style={{ fontFamily: "var(--font-body)" }}>
              <div className="flex items-center gap-3">
                <Mail className="h-3.5 w-3.5 text-[#D8B4A0]/60 flex-shrink-0" />
                <a href="mailto:support@inyoufragrances.com" className="tracking-wide hover:text-[#D8B4A0] transition-colors duration-300">support@inyoufragrances.com</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-3.5 w-3.5 text-[#D8B4A0]/60 flex-shrink-0" />
                <a href="tel:+919999273927" className="tracking-wide hover:text-[#D8B4A0] transition-colors duration-300">+91 99992 73927</a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-3.5 w-3.5 text-[#D8B4A0]/60 flex-shrink-0 mt-0.5" />
                <span className="tracking-wide">Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D8B4A0]" style={{ fontFamily: "var(--font-body)" }}>Quick Links</h3>
            <ul className="space-y-3 text-[13px]" style={{ fontFamily: "var(--font-body)" }}>
              {[
                { href: "/", label: "Home" },
                { href: "/shop", label: "Shop All" },
                { href: "/categories", label: "Categories" },
                { href: "/about", label: "About Us" },
                { href: "/account", label: "My Account" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#FCFBF8]/40 hover:text-[#D8B4A0] transition-colors duration-300 tracking-wide">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-5">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D8B4A0]" style={{ fontFamily: "var(--font-body)" }}>Help</h3>
            <ul className="space-y-3 text-[13px]" style={{ fontFamily: "var(--font-body)" }}>
              {[
                { href: "/contact", label: "Contact Us" },
                { href: "/shipping", label: "Shipping Policy" },
                { href: "/returns", label: "Returns & Refund" },
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms & Conditions" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#FCFBF8]/40 hover:text-[#D8B4A0] transition-colors duration-300 tracking-wide">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="col-span-2 md:col-span-1 space-y-5">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D8B4A0]" style={{ fontFamily: "var(--font-body)" }}>Account</h3>
            <p className="text-[13px] text-[#FCFBF8]/40 tracking-wide leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              {isLoggedIn ? "Manage your profile, track orders, and update your preferences." : "Sign in to track orders, manage addresses, and save your favorites."}
            </p>
            <div className="flex flex-col gap-3">
              {isLoggedIn ? (
                <Link href="/account">
                  <button className="w-full py-3 bg-[#D8B4A0] text-[#1C1615] text-[10px] font-bold tracking-[0.25em] uppercase hover:bg-[#FCFBF8] transition-all duration-300" style={{ fontFamily: "var(--font-body)" }}>
                    My Account
                  </button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <button className="w-full py-3 border border-[#D8B4A0]/20 text-[#FCFBF8]/60 text-[10px] font-bold tracking-[0.25em] uppercase hover:border-[#D8B4A0] hover:text-[#D8B4A0] transition-all duration-300" style={{ fontFamily: "var(--font-body)" }}>
                      Sign In
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button className="w-full py-3 bg-[#D8B4A0] text-[#1C1615] text-[10px] font-bold tracking-[0.25em] uppercase hover:bg-[#FCFBF8] transition-all duration-300" style={{ fontFamily: "var(--font-body)" }}>
                      Create Account
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#D8B4A0]/10">
        <div className="container mx-auto px-4 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-[#FCFBF8]/20 tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-body)" }}>
            © {new Date().getFullYear()} Vayuroma Fragrances (OPC) Pvt Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <div className="h-px w-8 bg-gradient-to-r from-transparent via-[#D8B4A0]/30 to-transparent" />
            <span className="text-[9px] text-[#FCFBF8]/15 tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-playfair)" }}>Crafted with love</span>
            <div className="h-px w-8 bg-gradient-to-r from-transparent via-[#D8B4A0]/30 to-transparent" />
          </div>
        </div>
      </div>
    </footer>
  )
}
