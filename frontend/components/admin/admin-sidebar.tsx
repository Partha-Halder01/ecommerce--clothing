"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, ChevronRight, Menu, X, FolderOpen, Layers, Image, Video, MessageSquare, ShoppingBag, Ticket, Star, CreditCard, Mail, Sparkles, Truck } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { authAPI } from "@/lib/api"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: FolderOpen, label: "Categories", href: "/admin/categories" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: CreditCard, label: "Transactions", href: "/admin/transactions" },
  { icon: Users, label: "Customers", href: "/admin/customers" },
  { icon: Ticket, label: "Coupons", href: "/admin/coupons" },
  { icon: Star, label: "Reviews", href: "/admin/reviews" },
  { icon: Mail, label: "Contacts", href: "/admin/contacts" },
  { icon: Image, label: "Hero Settings", href: "/admin/hero" },
  { icon: Video, label: "Our Story", href: "/admin/our-story" },
  { icon: MessageSquare, label: "Testimonials", href: "/admin/testimonials" },
  { icon: ShoppingBag, label: "Shop The Look", href: "/admin/shop-the-look" },
  { icon: Sparkles, label: "Featured Products", href: "/admin/featured" },
  { icon: Truck, label: "Shiprocket", href: "/admin/shiprocket" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = () => {
    authAPI.logout()
    router.push("/admin/login")
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black text-white p-4 flex items-center justify-between border-b border-white/10">
        <Link href="/admin/dashboard">
          <img src="/logo-light.png" alt="In You" className="h-9 w-auto object-contain" />
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-white hover:bg-white/10">
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && <div className="lg:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-black text-white flex flex-col transform transition-transform duration-300 ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} pt-16 lg:pt-0 border-r border-white/10 shadow-2xl`}>
        <div className="hidden lg:block p-8 border-b border-white/10">
          <Link href="/admin/dashboard">
            <img src="/logo-light.png" alt="In You" className="h-12 w-auto object-contain" />
            <p className="text-[10px] uppercase tracking-widest text-white/40 mt-2" style={{ fontFamily: "var(--font-body)" }}>Administrative Suite</p>
          </Link>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
              return (
                <li key={item.href}>
                  <Link href={item.href} onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-5 py-3 transition-all duration-300 rounded-none text-sm ${isActive ? "bg-[#D4AF37] text-black font-bold" : "text-white/60 hover:bg-white/5 hover:text-white"}`}>
                    <item.icon className={`h-4 w-4 ${isActive ? "text-black" : "text-[#D4AF37]"}`} />
                    <span style={{ fontFamily: "var(--font-body)" }}>{item.label}</span>
                    {isActive && <ChevronRight className="h-4 w-4 ml-auto text-black" />}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-6 border-t border-white/10">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3 text-white/40 hover:text-red-400 transition-colors text-sm uppercase tracking-widest font-bold">
            <LogOut className="h-4 w-4" />
            <span style={{ fontFamily: "var(--font-body)" }}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
