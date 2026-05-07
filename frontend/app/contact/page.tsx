"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Clock, Loader2, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function ContactPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    message: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone || !formData.message) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" })
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        ...formData,
        // Use a default internal subject so admin inbox stays organized
        subject: "Contact Inquiry",
      }

      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error("Failed to submit form")
      }

      setIsSubmitted(true)
      toast({ title: "Success", description: "Your message has been sent!" })
      setFormData({ first_name: "", last_name: "", email: "", phone: "", message: "" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as any } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      <Header />
      <main>
        <section className="py-16 sm:py-24 lg:py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="container mx-auto px-4 lg:px-8"
          >
            <motion.div variants={fadeIn} className="text-center mb-16 sm:mb-24">
              <p className="text-sm uppercase tracking-[0.4em] text-[#D8B4A0] mb-6 font-semibold" style={{ fontFamily: "var(--font-body)" }}>
                Get In Touch
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light mb-6 text-[#1C1615] tracking-wide uppercase" style={{ fontFamily: "var(--font-playfair)" }}>Contact Us</h1>
              <p
                className="text-lg sm:text-xl text-[#6B635E] max-w-2xl mx-auto tracking-wide"
                style={{ fontFamily: "var(--font-body)" }}
              >
                We invite you to reach out for private consultations, order inquiries, or any assistance regarding your Inyou experience.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24">
              {/* Contact Form */}
              <motion.div variants={fadeIn} className="bg-white p-8 sm:p-12 border border-[#E8E3DC] shadow-sm order-2 lg:order-1">
                <h2 className="text-2xl sm:text-3xl font-light mb-8 text-[#1C1615] tracking-wide uppercase" style={{ fontFamily: "var(--font-playfair)" }}>Send us a message</h2>

                {isSubmitted ? (
                  <div className="text-center py-16">
                    <CheckCircle className="w-16 h-16 text-[#D8B4A0] mx-auto mb-6" />
                    <h3 className="text-2xl font-light text-[#1C1615] mb-4 tracking-wide uppercase" style={{ fontFamily: "var(--font-playfair)" }}>Thank You</h3>
                    <p className="text-[#6B635E] mb-8 tracking-wide" style={{ fontFamily: "var(--font-body)" }}>Your message has been sent successfully. A concierge will respond shortly.</p>
                    <Button onClick={() => setIsSubmitted(false)} variant="outline" className="border-[#E8E3DC] text-[#1C1615] hover:bg-[#F4F1EB] rounded-sm uppercase tracking-widest text-xs h-11 px-8">
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <motion.form variants={staggerContainer} initial="hidden" animate="visible" onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <motion.div variants={fadeIn}>
                        <label className="text-xs font-semibold uppercase tracking-widest mb-3 block text-[#1C1615]" style={{ fontFamily: "var(--font-body)" }}>
                          First Name
                        </label>
                        <Input
                          placeholder="First Name"
                          className="h-12 border-0 border-b border-[#E8E3DC] rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#D8B4A0] bg-transparent transition-colors"
                          value={formData.first_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                          required
                        />
                      </motion.div>
                      <motion.div variants={fadeIn}>
                        <label className="text-xs font-semibold uppercase tracking-widest mb-3 block text-[#1C1615]" style={{ fontFamily: "var(--font-body)" }}>
                          Last Name
                        </label>
                        <Input
                          placeholder="Last Name"
                          className="h-12 border-0 border-b border-[#E8E3DC] rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#D8B4A0] bg-transparent transition-colors"
                          value={formData.last_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                          required
                        />
                      </motion.div>
                    </div>
                    <motion.div variants={fadeIn}>
                      <label className="text-xs font-semibold uppercase tracking-widest mb-3 block text-[#1C1615]" style={{ fontFamily: "var(--font-body)" }}>
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        className="h-12 border-0 border-b border-[#E8E3DC] rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#D8B4A0] bg-transparent transition-colors"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </motion.div>
                    <motion.div variants={fadeIn}>
                      <label className="text-xs font-semibold uppercase tracking-widest mb-3 block text-[#1C1615]" style={{ fontFamily: "var(--font-body)" }}>
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        placeholder="+91 90000 00000"
                        className="h-12 border-0 border-b border-[#E8E3DC] rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#D8B4A0] bg-transparent transition-colors"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </motion.div>
                    <motion.div variants={fadeIn}>
                      <label className="text-xs font-semibold uppercase tracking-widest mb-3 block text-[#1C1615]" style={{ fontFamily: "var(--font-body)" }}>
                        Message
                      </label>
                      <Textarea
                        placeholder="Your inquiry..."
                        rows={4}
                        className="border border-[#E8E3DC] rounded-sm focus-visible:ring-[#D8B4A0] bg-[#FCFBF8] p-4 resize-none transition-colors"
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        required
                      />
                    </motion.div>
                    <motion.div variants={fadeIn}>
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full uppercase tracking-[0.2em] bg-[#1C1615] hover:bg-[#D8B4A0] text-[#FCFBF8] hover:text-[#1C1615] h-12 rounded-sm transition-all duration-300 mt-4"
                        disabled={isSubmitting}
                      >
                        {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {isSubmitting ? "Sending..." : "Submit Inquiry"}
                      </Button>
                    </motion.div>
                  </motion.form>
                )}
              </motion.div>

              {/* Contact Info */}
              <motion.div variants={fadeIn} className="space-y-10 sm:space-y-12 order-1 lg:order-2 flex flex-col justify-center">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-light mb-6 text-[#1C1615] tracking-wide uppercase" style={{ fontFamily: "var(--font-playfair)" }}>Concierge Desk</h2>
                  <p
                    className="text-base sm:text-lg text-[#6B635E] leading-relaxed tracking-wide"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Whether you require consultation on selecting a signature scent or need assistance with a current order, our dedicated team is at your service.
                  </p>
                </div>

                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
                  {[
                    { icon: Mail, label: "Email Correspondance", value: "concierge@inyou.luxury" },
                    { icon: Phone, label: "Direct Line", value: "+91 82186 20557 / +91 90452 11333" },
                    { icon: MapPin, label: "Boutique Location", value: "Mumbai, India" },
                    { icon: Clock, label: "Operating Hours", value: "Mon - Sat: 10am - 7pm IST" },
                  ].map((item, index) => (
                    <motion.div variants={fadeIn} key={index} className="flex items-start gap-5">
                      <div className="w-12 h-12 bg-[#F4F1EB] rounded-sm flex items-center justify-center shrink-0 border border-[#E8E3DC]">
                        <item.icon className="h-5 w-5 text-[#D8B4A0]" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-[#6B635E] mb-1 font-medium" style={{ fontFamily: "var(--font-body)" }}>
                          {item.label}
                        </p>
                        <p
                          className="text-base text-[#1C1615] tracking-wide"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {item.value}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
