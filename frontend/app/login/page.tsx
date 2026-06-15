"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { authAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loginMode, setLoginMode] = useState<"password" | "otp">("password")
  const [otpSent, setOtpSent] = useState(false)

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await authAPI.login({ email, password })
      toast({ title: "Success", description: "Logged in successfully!" })
      window.dispatchEvent(new Event('storage'))
      // Admins sign in through the dedicated /admin/login portal, not here.
      if (response.user.is_admin) router.push("/admin/login")
      else router.push("/")
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to login", variant: "destructive" })
    } finally { setIsLoading(false) }
  }

  const sendOtp = async () => {
    if (!email) { toast({ title: "Error", description: "Please enter your email", variant: "destructive" }); return }
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'login' })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Failed to send OTP')
      setOtpSent(true)
      toast({ title: "OTP Sent", description: `Check your email ${email}` })
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally { setIsLoading(false) }
  }

  const verifyOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp) { toast({ title: "Error", description: "Please enter OTP", variant: "destructive" }); return }
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp, purpose: 'login' })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Invalid OTP')

      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
      window.dispatchEvent(new Event('storage'))
      toast({ title: "Success", description: "Logged in successfully!" })
      // Admins sign in through the dedicated /admin/login portal, not here.
      if (data.user.is_admin) router.push("/admin/login")
      else router.push("/")
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally { setIsLoading(false) }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } }
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

  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row bg-[#FCFBF8]">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="absolute top-4 left-4 z-20"
      >
        <Link href="/" className="inline-flex items-center text-xs font-semibold tracking-widest uppercase text-[#6B635E] hover:text-[#1C1615] transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Home
        </Link>
      </motion.div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 order-2 lg:order-1">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="w-full max-w-md">
          <motion.div variants={fadeInUp}>
            <Link href="/" className="inline-block mb-8 sm:mb-12">
              <img src="/logo-dark.png" alt="In You" className="h-16 sm:h-20 w-auto object-contain" />
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h2 className="text-2xl sm:text-3xl font-light mb-2 text-[#1C1615] tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>Welcome back</h2>
            <p className="text-[#6B635E] mb-6 tracking-wide" style={{ fontFamily: "var(--font-body)" }}>
              {loginMode === "password" ? "Enter your credentials to access your account." : "Login with OTP sent to your email."}
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex gap-2 mb-8 p-1 bg-[#F4F1EB] rounded-sm">
            <button onClick={() => { setLoginMode("password"); setOtpSent(false) }}
              className={`flex-1 py-2.5 px-4 rounded-sm text-sm transition-all duration-300 font-medium tracking-wide ${loginMode === "password" ? "bg-white shadow-sm text-[#1C1615]" : "text-[#6B635E] hover:text-[#1C1615]"}`}>
              <Lock className="w-4 h-4 inline mr-2" />Password
            </button>
            <button onClick={() => setLoginMode("otp")}
              className={`flex-1 py-2.5 px-4 rounded-sm text-sm transition-all duration-300 font-medium tracking-wide ${loginMode === "otp" ? "bg-white shadow-sm text-[#1C1615]" : "text-[#6B635E] hover:text-[#1C1615]"}`}>
              <Mail className="w-4 h-4 inline mr-2" />OTP Login
            </button>
          </motion.div>

          {loginMode === "password" ? (
            <motion.form variants={fadeInUp} onSubmit={handlePasswordLogin} className="space-y-5">
              <div>
                <label className="text-xs font-semibold tracking-widest mb-2 block text-[#1C1615] uppercase">Email</label>
                <Input type="email" placeholder="email@example.com" className="h-12 border-[#E8E3DC] bg-[#FCFBF8] focus-visible:ring-[#D8B4A0] rounded-sm transition-all"
                  value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs font-semibold tracking-widest mb-2 block text-[#1C1615] uppercase">Password</label>
                <Input type="password" placeholder="••••••••" className="h-12 border-[#E8E3DC] bg-[#FCFBF8] focus-visible:ring-[#D8B4A0] rounded-sm transition-all"
                  value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="flex items-center justify-between mt-6 mb-2">
                <label className="flex items-center gap-2 text-sm text-[#6B635E] cursor-pointer">
                  <input type="checkbox" className="rounded-sm border-[#E8E3DC] text-[#D8B4A0] focus:ring-[#D8B4A0]" />
                  <span>Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-[#6B635E] hover:text-[#1C1615] transition-colors underline-offset-4 hover:underline">Forgot password?</Link>
              </div>
              <Button type="submit" size="lg" className="w-full bg-[#1C1615] hover:bg-[#D8B4A0] text-[#FCFBF8] hover:text-[#1C1615] h-12 rounded-sm uppercase tracking-[0.2em] font-medium transition-all duration-300 shadow-none hover:shadow-lg mt-4" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </motion.form>
          ) : (
            <motion.form variants={fadeInUp} onSubmit={verifyOtpLogin} className="space-y-5">
              <div>
                <label className="text-sm font-medium mb-2 block text-[#0D2440]">Email</label>
                <div className="flex gap-2">
                  <Input type="email" placeholder="john@example.com" className="h-12 border-[#7BA4D0] flex-1"
                    value={email} onChange={(e) => setEmail(e.target.value)} disabled={otpSent} required />
                  {!otpSent && (
                    <Button type="button" onClick={sendOtp} disabled={isLoading} className="bg-[#2E5E99] h-12">
                      Send OTP
                    </Button>
                  )}
                </div>
              </div>
              {otpSent && (
                <>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-[#0D2440]">Enter OTP</label>
                    <Input type="text" placeholder="123456" className="h-12 border-[#7BA4D0] text-center text-2xl tracking-widest"
                      value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} maxLength={6} required />
                    <button type="button" onClick={() => { setOtpSent(false); setOtp("") }}
                      className="text-sm text-[#2E5E99] hover:underline mt-2">Change email</button>
                  </div>
                  <Button type="submit" size="lg" className="w-full bg-[#2E5E99] hover:bg-[#0D2440] h-12" disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Verify & Login"} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}
            </motion.form>
          )}

          <motion.p variants={fadeInUp} className="text-center mt-8 text-[#6B635E] text-sm">
            Don't have an account? <Link href="/signup" className="text-[#1C1615] font-semibold hover:text-[#D8B4A0] transition-colors underline-offset-4 hover:underline">Sign up</Link>
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="h-[30vh] lg:h-auto lg:flex-1 bg-cover bg-center order-1 lg:order-2"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1920&auto=format&fit=crop')" }}>
        <div className="w-full h-full bg-[#1C1615]/20" />
      </motion.div>
    </div>
  )
}
