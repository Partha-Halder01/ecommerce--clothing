"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { authAPI, getCurrentUser } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Lock, Mail, ShieldCheck } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // If already signed in as an admin, skip straight to the dashboard.
  useEffect(() => {
    const user = getCurrentUser()
    if (user?.is_admin) router.replace("/admin/dashboard")
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await authAPI.login({ email, password })

      // Only administrators may enter the admin portal. A valid customer
      // account must not be allowed past this page.
      if (!response.user.is_admin) {
        authAPI.logout()
        toast({
          title: "Access denied",
          description: "This account does not have administrator access.",
          variant: "destructive",
        })
        return
      }

      window.dispatchEvent(new Event("storage"))
      toast({ title: "Welcome back", description: "Signed in to the admin portal." })
      router.push("/admin/dashboard")
    } catch (error: any) {
      // Keep the message generic so we never reveal whether the email exists.
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      {/* subtle gold glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.12),_transparent_55%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="border border-white/10 bg-[#0A0A0A] p-8 sm:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <img src="/logo-light.png" alt="In You" className="h-16 w-auto object-contain mx-auto mb-3" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-1">
              Administrative Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-semibold tracking-widest mb-2 block text-white/60 uppercase">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  type="email"
                  autoComplete="username"
                  placeholder="admin@inyou.luxury"
                  className="h-12 pl-10 bg-black border-white/15 text-white placeholder:text-white/25 focus-visible:ring-[#D4AF37] rounded-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold tracking-widest mb-2 block text-white/60 uppercase">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="h-12 pl-10 bg-black border-white/15 text-white placeholder:text-white/25 focus-visible:ring-[#D4AF37] rounded-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full bg-[#D4AF37] hover:bg-[#c19f30] text-black h-12 rounded-none uppercase tracking-[0.2em] font-bold transition-colors"
            >
              {isLoading ? "Verifying..." : "Sign in"}
            </Button>
          </form>

          <p className="text-center text-[11px] text-white/30 mt-8 tracking-wide">
            Authorized personnel only. Activity may be monitored.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
