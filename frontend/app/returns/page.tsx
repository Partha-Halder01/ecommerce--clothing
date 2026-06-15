import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CheckCircle, Clock, ClipboardCheck, XCircle, Package } from "lucide-react"

export const metadata: Metadata = {
  title: "Returns & Refund | In You",
  description: "Your satisfaction, handled with care — the In You returns process.",
}

export default function ReturnsPage() {
  const requirements = [
    "A mandatory unboxing video showing the sealed parcel being opened",
    "The product must be unused with its protective seal fully intact",
    "Original packaging, box, and any complimentary gifts must be included",
    "Pickups will be rejected for used, opened, or tampered products",
  ]

  const nonReturnable = [
    "Opened or used fragrances (for hygiene & safety reasons)",
    "Items returned without a clear unboxing video",
    "Products purchased on sale or with promotional discounts",
    "Items damaged due to mishandling after delivery",
  ]

  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-[#1C1615] py-20 sm:py-28">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#D8B4A0] mb-5 font-semibold" style={{ fontFamily: "var(--font-body)" }}>
              Care
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#FCFBF8] tracking-wide uppercase mb-5" style={{ fontFamily: "var(--font-playfair)" }}>
              Returns &amp; Refund
            </h1>
            <p className="text-sm sm:text-base text-[#FCFBF8]/50 max-w-2xl mx-auto tracking-wide leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              Your satisfaction, handled with care.
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
              Because fragrances are intimate, hygiene-sensitive products, we follow a careful returns
              process. Please review the guidelines below before raising a request.
            </p>
            <div className="w-16 h-px bg-[#D8B4A0]/40 mx-auto mt-10" />
          </div>
        </section>

        {/* Sections */}
        <section className="pb-20 sm:pb-28">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl space-y-5">
            {/* Eligibility */}
            <div className="bg-white border border-[#E8E3DC] p-7 sm:p-9 shadow-sm">
              <div className="flex items-start gap-5">
                <div className="w-11 h-11 bg-[#F4F1EB] flex items-center justify-center shrink-0 border border-[#E8E3DC]">
                  <CheckCircle className="h-5 w-5 text-[#D8B4A0]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-normal text-[#1C1615] mb-3 tracking-wide uppercase" style={{ fontFamily: "var(--font-playfair)" }}>
                    1. Eligibility
                  </h2>
                  <p className="text-[#6B635E] leading-relaxed tracking-wide" style={{ fontFamily: "var(--font-body)" }}>
                    Returns are accepted <strong className="text-[#1C1615] font-semibold">only</strong> for items
                    that arrive damaged, defective, or incorrect. A clear, continuous{" "}
                    <strong className="text-[#1C1615] font-semibold">unboxing video is mandatory</strong> to
                    process any return or replacement request.
                  </p>
                </div>
              </div>
            </div>

            {/* Return Window */}
            <div className="bg-white border border-[#E8E3DC] p-7 sm:p-9 shadow-sm">
              <div className="flex items-start gap-5">
                <div className="w-11 h-11 bg-[#F4F1EB] flex items-center justify-center shrink-0 border border-[#E8E3DC]">
                  <Clock className="h-5 w-5 text-[#D8B4A0]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-normal text-[#1C1615] mb-3 tracking-wide uppercase" style={{ fontFamily: "var(--font-playfair)" }}>
                    2. Return Window
                  </h2>
                  <p className="text-[#6B635E] leading-relaxed tracking-wide" style={{ fontFamily: "var(--font-body)" }}>
                    Requests must be raised within{" "}
                    <strong className="text-[#1C1615] font-semibold">48 hours (2–3 days) of delivery</strong>.
                    Requests made after this window cannot be entertained.
                  </p>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white border border-[#E8E3DC] p-7 sm:p-9 shadow-sm">
              <div className="flex items-start gap-5">
                <div className="w-11 h-11 bg-[#F4F1EB] flex items-center justify-center shrink-0 border border-[#E8E3DC]">
                  <ClipboardCheck className="h-5 w-5 text-[#D8B4A0]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-normal text-[#1C1615] mb-4 tracking-wide uppercase" style={{ fontFamily: "var(--font-playfair)" }}>
                    3. Return Requirements
                  </h2>
                  <ul className="space-y-3 text-[#6B635E]" style={{ fontFamily: "var(--font-body)" }}>
                    {requirements.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 tracking-wide leading-relaxed">
                        <span className="text-[#D8B4A0] mt-1.5 text-[8px]">●</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Non-Returnable */}
            <div className="bg-[#FBF6F2] border border-[#D8B4A0]/40 p-7 sm:p-9 shadow-sm">
              <div className="flex items-start gap-5">
                <div className="w-11 h-11 bg-white flex items-center justify-center shrink-0 border border-[#D8B4A0]/40">
                  <XCircle className="h-5 w-5 text-[#9C6B53]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-normal text-[#1C1615] mb-4 tracking-wide uppercase" style={{ fontFamily: "var(--font-playfair)" }}>
                    4. Non-Returnable Items
                  </h2>
                  <ul className="space-y-3 text-[#6B635E]" style={{ fontFamily: "var(--font-body)" }}>
                    {nonReturnable.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 tracking-wide leading-relaxed">
                        <span className="text-[#9C6B53] mt-0.5">✕</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Refund & Replacement */}
            <div className="bg-white border border-[#E8E3DC] p-7 sm:p-9 shadow-sm">
              <div className="flex items-start gap-5">
                <div className="w-11 h-11 bg-[#F4F1EB] flex items-center justify-center shrink-0 border border-[#E8E3DC]">
                  <Package className="h-5 w-5 text-[#D8B4A0]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-normal text-[#1C1615] mb-3 tracking-wide uppercase" style={{ fontFamily: "var(--font-playfair)" }}>
                    5. Refunds &amp; Replacement
                  </h2>
                  <p className="text-[#6B635E] leading-relaxed tracking-wide" style={{ fontFamily: "var(--font-body)" }}>
                    For approved claims, we offer a{" "}
                    <strong className="text-[#1C1615] font-semibold">free replacement</strong> or{" "}
                    <strong className="text-[#1C1615] font-semibold">store credit</strong>. Where a refund
                    is applicable, it is processed to the original payment method within 7–10 business days
                    of the returned item passing our quality inspection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Closing */}
        <section className="py-16 sm:py-20 bg-[#1C1615]">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#D8B4A0] mb-4 font-semibold" style={{ fontFamily: "var(--font-body)" }}>
              Concierge Desk
            </p>
            <h2 className="text-2xl sm:text-3xl font-light text-[#FCFBF8] mb-5 tracking-wide uppercase" style={{ fontFamily: "var(--font-playfair)" }}>
              Need to Return an Item?
            </h2>
            <p className="text-[#FCFBF8]/50 mb-8 tracking-wide max-w-xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              Write to us with your order ID and unboxing video, and we&apos;ll take care of the rest.
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
