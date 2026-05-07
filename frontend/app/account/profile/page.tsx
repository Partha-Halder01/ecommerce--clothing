"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, User } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { getCurrentUser, getAuthToken } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface ProfileData {
  first_name: string
  last_name: string
  email: string
  phone: string
  date_of_birth: string
  created_at: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState<ProfileData>({
    first_name: "", last_name: "", email: "", phone: "", date_of_birth: "", created_at: ""
  })

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) { router.push("/signup"); return }

    // Pre-populate with localStorage data
    setProfile(prev => ({
      ...prev,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || ""
    }))

    fetchProfile()
  }, [router])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      })
      if (!response.ok) throw new Error('Failed to load profile')
      const data = await response.json()
      if (data.first_name || data.email) {
        setProfile(data)
      }
    } catch (error) {
      // Keep localStorage data if API fails
      console.log("Profile API failed, using localStorage data")
    } finally { setIsLoading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getAuthToken()}` },
        body: JSON.stringify({
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          date_of_birth: profile.date_of_birth || null
        })
      })
      if (!response.ok) throw new Error('Failed to update profile')

      // Update localStorage user
      const user = getCurrentUser()
      if (user) {
        localStorage.setItem('user', JSON.stringify({ ...user, first_name: profile.first_name, last_name: profile.last_name }))
      }

      toast({ title: "Success", description: "Profile updated successfully" })
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally { setIsSaving(false) }
  }

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'None') return 'New member'
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FCFBF8]">
        <Header />
        <main className="py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#6B635E]" />
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
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      <Header />
      <main className="py-8 sm:py-12 lg:py-16">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <motion.div variants={fadeInUp}>
              <Link href="/account" className="inline-flex items-center gap-2 text-[#6B635E] hover:text-[#1C1615] mb-6 sm:mb-8 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "12px" }}>Back to Account</span>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-white border border-[#E8E3DC] shadow-sm overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-[#6B635E] to-[#1C1615] p-6 sm:p-8 text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#E8E3DC] border-4 border-[#FCFBF8] overflow-hidden mx-auto flex items-center justify-center">
                    <User className="h-12 w-12 text-[#FCFBF8]" />
                  </div>
                </div>
                <h1 className="text-xl sm:text-2xl font-semibold text-[#FCFBF8] mb-1">
                  {profile.first_name && profile.last_name ? `${profile.first_name} ${profile.last_name}` : 'Complete Your Profile'}
                </h1>
                <p className="text-[#E8E3DC] text-xs uppercase tracking-widest mt-2 font-medium" style={{ fontFamily: "var(--font-body)" }}>
                  Member since {formatDate(profile.created_at)}
                </p>
              </div>

              {/* Profile Form */}
              <div className="p-8 sm:p-12">
                <h2 className="text-xl sm:text-2xl font-light text-[#1C1615] mb-8 tracking-wide uppercase" style={{ fontFamily: "var(--font-playfair)" }}>Personal Information</h2>

                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="text-sm font-medium mb-2 block text-[#1C1615]">First Name</label>
                      <Input value={profile.first_name} onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                        className="h-11 border-[#E8E3DC] focus:border-[#6B635E] bg-[#FCFBF8]/30" placeholder="Enter first name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block text-[#1C1615]">Last Name</label>
                      <Input value={profile.last_name} onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                        className="h-11 border-[#E8E3DC] focus:border-[#6B635E] bg-[#FCFBF8]/30" placeholder="Enter last name" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block text-[#1C1615]">Email Address</label>
                    <Input type="email" value={profile.email} disabled
                      className="h-11 border-[#E8E3DC] bg-gray-100 cursor-not-allowed" />
                    <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block text-[#1C1615]">Phone Number</label>
                    <Input type="tel" value={profile.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="h-11 border-[#E8E3DC] focus:border-[#6B635E] bg-[#FCFBF8]/30" placeholder="+1 (555) 123-4567" />
                  </div>

                  <div>
                    <label className="text-xs font-semibold tracking-widest uppercase mb-3 block text-[#1C1615]" style={{ fontFamily: "var(--font-body)" }}>Date of Birth</label>
                    <Input type="date" value={profile.date_of_birth || ''} onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                      className="h-12 border-0 border-b border-[#E8E3DC] rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#D8B4A0] bg-transparent transition-colors uppercase tracking-widest" />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button type="submit" disabled={isSaving}
                      className="flex-1 uppercase tracking-[0.2em] font-medium bg-[#1C1615] hover:bg-[#D8B4A0] text-[#FCFBF8] hover:text-[#1C1615] h-12 rounded-sm transition-all duration-300">
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Save Changes
                    </Button>
                    <Link href="/account" className="flex-1">
                      <Button type="button" variant="outline"
                        className="w-full uppercase tracking-[0.2em] font-medium border-[#E8E3DC] text-[#1C1615] hover:bg-[#F4F1EB] h-12 rounded-sm transition-all duration-300 bg-transparent">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
