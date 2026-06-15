import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Globe, Sparkles, ShoppingBag, Copyright, ShieldAlert, Scale } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms & Conditions | In You",
  description: "The terms that guide your In You fragrance experience.",
}

export default function TermsPage() {
  const sections = [
    {
      icon: Globe,
      title: "1. Use of Website",
      content:
        "Our website is intended for personal, non-commercial use. You agree not to misuse the site through unauthorized access, data scraping, or any activity that disrupts the experience for other patrons.",
    },
    {
      icon: Sparkles,
      title: "2. Products & Pricing",
      content:
        "All fragrances are described and priced as accurately as possible in Indian Rupees (₹), inclusive of applicable taxes unless stated otherwise. Packaging, shades, and presentation may vary subtly from on-screen images due to display settings. Prices, offers, and availability may change without prior notice.",
    },
    {
      icon: ShoppingBag,
      title: "3. Orders & Acceptance",
      content:
        "Every order placed is an offer to purchase, subject to availability and confirmation. We reserve the right to accept, decline, or cancel any order — including for reasons of stock, pricing errors, or suspected fraud — and may request verification before dispatch.",
    },
    {
      icon: Copyright,
      title: "4. Intellectual Property",
      content:
        "All content on this website — including the In You name, logo, imagery, fragrance names, and written material — is the property of Vayuroma Fragrances (OPC) Pvt Ltd and may not be reproduced or used without our prior written permission.",
    },
    {
      icon: ShieldAlert,
      title: "5. Limitation of Liability",
      content:
        "While we take great care in crafting and delivering your order, In You shall not be held liable for delays or losses arising from courier services, force majeure, or other factors beyond our reasonable control. Our liability is limited to the value of the products purchased.",
    },
    {
      icon: Scale,
      title: "6. Governing Law",
      content:
        "These Terms are governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts of Delhi.",
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
              Legal
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#FCFBF8] tracking-wide uppercase mb-5" style={{ fontFamily: "var(--font-playfair)" }}>
              Terms &amp; Conditions
            </h1>
            <p className="text-sm sm:text-base text-[#FCFBF8]/50 max-w-2xl mx-auto tracking-wide leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              The terms that guide your In You experience.
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
              Welcome to In You. These Terms &amp; Conditions govern your access to and use of
              inyoufragrances.com, operated by Vayuroma Fragrances (OPC) Pvt Ltd. By browsing our
              boutique or placing an order, you agree to these terms in full.
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
                    <h2 className="text-lg sm:text-xl font-normal text-[#1C1615] mb-3 tracking-wide uppercase" style={{ fontFamily: "var(--font-playfair)" }}>
                      {section.title}
                    </h2>
                    <p className="text-[#6B635E] leading-relaxed tracking-wide" style={{ fontFamily: "var(--font-body)" }}>
                      {section.content}
                    </p>
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
              Concierge Desk
            </p>
            <h2 className="text-2xl sm:text-3xl font-light text-[#FCFBF8] mb-5 tracking-wide uppercase" style={{ fontFamily: "var(--font-playfair)" }}>
              Have Questions?
            </h2>
            <p className="text-[#FCFBF8]/50 mb-8 tracking-wide max-w-xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              Reach out for any clarification on these terms — our team is here to help.
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
