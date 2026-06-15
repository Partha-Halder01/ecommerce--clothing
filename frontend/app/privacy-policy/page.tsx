import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Eye, Sparkles, Share2, Cookie, Lock, UserCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy | In You",
  description: "How In You protects the information you share with us.",
}

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Eye,
      title: "1. Information We Collect",
      items: [
        "Name, phone number, and email address",
        "Billing and shipping addresses",
        "Payment information (processed securely by our gateway, never stored by us)",
        "Device, browser, IP address, and cookie data collected automatically",
      ],
    },
    {
      icon: Sparkles,
      title: "2. How We Use Your Information",
      items: [
        "To process, fulfil, and deliver your orders",
        "To provide customer care and respond to your enquiries",
        "To share updates, offers, and new launches (with your consent)",
        "To improve our website experience and prevent fraud",
      ],
    },
    {
      icon: Share2,
      title: "3. Sharing of Information",
      content:
        "We never sell your data. We share it only with trusted partners — courier services, payment gateways, and analytics providers — strictly to fulfil your order and operate our boutique.",
    },
    {
      icon: Cookie,
      title: "4. Cookies",
      content:
        "We use cookies to remember your preferences, keep your cart intact, and understand how our site is used so we can refine your experience. You may disable cookies in your browser settings at any time.",
    },
    {
      icon: Lock,
      title: "5. Data Security",
      content:
        "Your information is protected using encryption, secure servers, and regular reviews. While no system is entirely infallible, we take every reasonable measure to keep your data safe.",
    },
    {
      icon: UserCheck,
      title: "6. Your Rights",
      content:
        "You may request access to, correction, or deletion of your personal data, or opt out of marketing communications, at any time by writing to support@inyoufragrances.com.",
    },
  ]

  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-[#1C1615] py-20 sm:py-28">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#D8B4A0] mb-5 font-semibold" style={{ fontFamily: "var(--font-body)" }}>
              Privacy
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#FCFBF8] tracking-wide uppercase mb-5" style={{ fontFamily: "var(--font-playfair)" }}>
              Privacy Policy
            </h1>
            <p className="text-sm sm:text-base text-[#FCFBF8]/50 max-w-2xl mx-auto tracking-wide leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              How we protect what you share with us.
            </p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#FCFBF8]/30 mt-6" style={{ fontFamily: "var(--font-body)" }}>
              Last Updated: June 2026
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-14 sm:py-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
            <p className="text-base sm:text-lg text-[#6B635E] leading-relaxed tracking-wide" style={{ fontFamily: "var(--font-body)" }}>
              Vayuroma Fragrances (OPC) Pvt Ltd (&ldquo;In You&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;)
              respects your privacy. This policy explains what we collect, how we use it, and the choices
              you have when you visit or shop with us.
            </p>
            <div className="w-16 h-px bg-[#D8B4A0]/40 mx-auto mt-10" />
          </div>
        </section>

        {/* Sections */}
        <section className="pb-20 sm:pb-28">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl space-y-5">
            {sections.map((section, index) => (
              <div key={index} className="bg-white border border-[#E8E3DC] p-7 sm:p-9 shadow-sm">
                <div className="flex items-start gap-5">
                  <div className="w-11 h-11 bg-[#F4F1EB] flex items-center justify-center shrink-0 border border-[#E8E3DC]">
                    <section.icon className="h-5 w-5 text-[#D8B4A0]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg sm:text-xl font-normal text-[#1C1615] mb-4 tracking-wide uppercase" style={{ fontFamily: "var(--font-playfair)" }}>
                      {section.title}
                    </h2>
                    {section.items ? (
                      <ul className="space-y-3 text-[#6B635E]" style={{ fontFamily: "var(--font-body)" }}>
                        {section.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 tracking-wide leading-relaxed">
                            <span className="text-[#D8B4A0] mt-1.5 text-[8px]">●</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[#6B635E] leading-relaxed tracking-wide" style={{ fontFamily: "var(--font-body)" }}>
                        {section.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Closing */}
        <section className="py-16 sm:py-20 bg-[#1C1615]">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#D8B4A0] mb-4 font-semibold" style={{ fontFamily: "var(--font-body)" }}>
              Grievance &amp; Contact
            </p>
            <h2 className="text-2xl sm:text-3xl font-light text-[#FCFBF8] mb-5 tracking-wide uppercase" style={{ fontFamily: "var(--font-playfair)" }}>
              Questions About Privacy?
            </h2>
            <p className="text-[#FCFBF8]/50 mb-8 tracking-wide max-w-xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              For any privacy request or concern, contact Vayuroma Fragrances (OPC) Pvt Ltd, Delhi, India.
            </p>
            <a
              href="mailto:support@inyoufragrances.com"
              className="inline-block bg-[#D8B4A0] text-[#1C1615] px-8 py-3.5 text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-[#FCFBF8] transition-all duration-300"
              style={{ fontFamily: "var(--font-body)" }}
            >
              support@inyoufragrances.com
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
