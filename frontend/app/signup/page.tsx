"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail, ArrowLeft } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [formData, setFormData] = useState({ first_name: "", last_name: "", email: "", phone: "", password: "", confirmPassword: "" })
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [devOtp, setDevOtp] = useState("") // For development testing

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.phone) {
      toast({ title: "Error", description: "Phone number is required", variant: "destructive" })
      return
    }
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" })
      return
    }
    if (formData.password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register-with-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Registration failed')

      setDevOtp(data.otp_code_dev_only || "") // For testing only
      toast({ title: "OTP Sent", description: `Verification code sent to ${formData.email}` })
      setStep('otp')
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally { setIsLoading(false) }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      toast({ title: "Error", description: "Please enter 6-digit OTP", variant: "destructive" })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, code: otp, purpose: 'register' }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Verification failed')

      // Save auth data
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))

      toast({ title: "Success", description: "Account verified successfully!" })
      router.push(data.user.is_admin ? "/admin/dashboard" : "/account")
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally { setIsLoading(false) }
  }

  const resendOtp = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, purpose: 'register' }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Failed to resend OTP')
      setDevOtp(data.otp_code_dev_only || "")
      toast({ title: "OTP Resent", description: "New verification code sent" })
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="h-[25vh] lg:h-auto lg:flex-1 bg-cover bg-center order-1"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1920&auto=format&fit=crop')" }}>
        <div className="w-full h-full bg-[#1C1615]/20" />
      </motion.div>

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

      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 order-2">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="w-full max-w-md">
          <motion.div variants={fadeInUp}>
            <Link href="/" className="inline-block mb-8 sm:mb-12">
              <h1 className="text-3xl font-bold tracking-[0.3em] text-[#1C1615] uppercase" style={{ fontFamily: "var(--font-playfair)" }}>Inyou</h1>
            </Link>
          </motion.div>

          {step === 'form' ? (
            <>
              <motion.div variants={fadeInUp}>
                <h2 className="text-2xl sm:text-3xl font-light mb-2 text-[#1C1615] tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>Create Account</h2>
                <p className="text-[#6B635E] mb-6 sm:mb-8 tracking-wide" style={{ fontFamily: "var(--font-body)" }}>
                  Join us and discover timeless elegance.
                </p>
              </motion.div>

              <motion.form variants={fadeInUp} onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs font-semibold tracking-widest mb-2 block text-[#1C1615] uppercase">First Name</label>
                    <Input value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} required
                      className="h-12 border-[#E8E3DC] bg-[#FCFBF8] focus-visible:ring-[#D8B4A0] rounded-sm transition-all" placeholder="John" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold tracking-widest mb-2 block text-[#1C1615] uppercase">Last Name</label>
                    <Input value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} required
                      className="h-12 border-[#E8E3DC] bg-[#FCFBF8] focus-visible:ring-[#D8B4A0] rounded-sm transition-all" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold tracking-widest mb-2 block text-[#1C1615] uppercase">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-12 border-[#E8E3DC] bg-[#FCFBF8] focus-visible:ring-[#D8B4A0] rounded-sm transition-all"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold tracking-widest mb-2 block text-[#1C1615] uppercase">Phone Number</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="h-12 border-[#E8E3DC] bg-[#FCFBF8] focus-visible:ring-[#D8B4A0] rounded-sm transition-all"
                    placeholder="+91 90000 00000"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold tracking-widest mb-2 block text-[#1C1615] uppercase">Password</label>
                  <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required
                    className="h-12 border-[#E8E3DC] bg-[#FCFBF8] focus-visible:ring-[#D8B4A0] rounded-sm transition-all" placeholder="••••••••" />
                </div>
                <div>
                  <label className="text-xs font-semibold tracking-widest mb-2 block text-[#1C1615] uppercase">Confirm</label>
                  <Input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required
                    className="h-12 border-[#E8E3DC] bg-[#FCFBF8] focus-visible:ring-[#D8B4A0] rounded-sm transition-all" placeholder="••••••••" />
                </div>

                <Button type="submit" className="w-full h-12 mt-4 bg-[#1C1615] hover:bg-[#D8B4A0] text-[#FCFBF8] hover:text-[#1C1615] rounded-sm uppercase tracking-[0.2em] font-medium transition-all duration-300 shadow-none hover:shadow-lg" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Create Account
                </Button>
              </motion.form>

              <motion.p variants={fadeInUp} className="text-center mt-8 text-sm text-[#6B635E]" style={{ fontFamily: "var(--font-body)" }}>
                Already have an account?{" "}
                <Link href="/login" className="text-[#1C1615] font-semibold hover:text-[#D8B4A0] transition-colors underline-offset-4 hover:underline">Login</Link>
              </motion.p>
            </>
          ) : (
            <motion.div variants={fadeInUp}>
              <button onClick={() => setStep('form')} className="flex items-center text-[#2E5E99] mb-4 hover:text-[#0D2440]">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </button>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-[#0D2440]">Verify Email</h2>
              <p className="text-[#2E5E99] mb-6" style={{ fontFamily: "var(--font-body)" }}>
                Enter the 6-digit code sent to <strong>{formData.email}</strong>
              </p>

              {/* OTP is sent via email in production */}

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0D2440] mb-1.5">Verification Code</label>
                  <Input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="h-12 text-center text-2xl tracking-[0.5em] border-[#7BA4D0]/30 focus:border-[#2E5E99]"
                    placeholder="000000" maxLength={6} />
                </div>

                <Button type="submit" className="w-full h-11 bg-[#2E5E99] hover:bg-[#0D2440]" disabled={isLoading || otp.length !== 6}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Mail className="h-4 w-4 mr-2" />} Verify Email
                </Button>
              </form>

              <p className="text-center mt-4 text-sm text-[#2E5E99]">
                Didn't receive the code?{" "}
                <button onClick={resendOtp} disabled={isLoading} className="text-[#0D2440] font-medium hover:underline">Resend</button>
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
