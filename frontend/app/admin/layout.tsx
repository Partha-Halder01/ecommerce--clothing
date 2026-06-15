"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { getCurrentUser } from "@/lib/api"

const LOGIN_PATH = "/admin/login"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const isLoginPage = pathname === LOGIN_PATH
  const [authorized, setAuthorized] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (isLoginPage) {
      setChecked(true)
      return
    }

    // Central gate for the whole /admin area: only verified admins get in,
    // everyone else is sent to the dedicated admin login page.
    const user = getCurrentUser()
    if (!user || !user.is_admin) {
      router.replace(LOGIN_PATH)
      setAuthorized(false)
    } else {
      setAuthorized(true)
    }
    setChecked(true)
  }, [pathname, isLoginPage, router])

  // The login page is rendered bare — no sidebar, no auth gate.
  if (isLoginPage) {
    return <>{children}</>
  }

  // Avoid flashing protected content before the auth check completes.
  if (!checked || !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFBF8]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      <AdminSidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen overflow-auto">{children}</main>
    </div>
  )
}
