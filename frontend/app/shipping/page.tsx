import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Package, Truck, IndianRupee, MapPin, AlertTriangle, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Shipping Policy | In You",
  description: "Thoughtfully packaged and delivered across India by In You.",
}

export default function ShippingPage() {
  const sections = [
    {
      icon: Package,
      title: "1. Order Processing",
      content:
        "Orders are processed and dispatched within 1–3 business days of confirmation. Orders placed on weekends or public holidays are processed on the next business day.",
    },
    {
      icon: Truck,
      title: "2. Delivery Timeframe",
      content:
        "Standard delivery takes 4–7 business days depending on your location. Metro cities are typically served faster, while remote pin codes may require a little additional time.",
    },
    {
      icon: IndianRupee,
      title: "3. Shipping Charges",
      content:
        "We offer complimentary shipping on all prepaid orders above ₹2,000. A nominal shipping fee applies to orders below this value and is shown transparently at checkout before payment.",
    },
    {
      icon: MapPin,
      title: "4. Order Tracking",
      content:
        "Once your order is dispatched, you will receive a tracking ID via email and SMS, allowing you to follow your parcel in real time through our courier partner.",
    },
    {
      icon: AlertTriangle,
      title: "5. Fragrance Shipping Note",
      content:
        "As perfumes contain alcohol and are classified as sensitive goods, a few remote pin codes may be restricted by our courier partners. In such cases, our team will contact you to arrange a suitable alternative.",
    },
    {
      icon: Clock,
      title: "6. Delays",
      content:
        "While we strive for timely delivery, weather, public holidays, or courier disruptions may occasionally cause delays. We appreciate your patience and are always available to assist.",
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
              Delivery
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#FCFBF8] tracking-wide uppercase mb-5" style={{ fontFamily: "var(--font-playfair)" }}>
              Shipping Policy
            </h1>
            <p className="text-sm sm:text-base text-[#FCFBF8]/50 max-w-2xl mx-auto tracking-wide leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              Thoughtfully packaged and delivered across India.
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
              Every In You fragrance is carefully packed to preserve its integrity and dispatched
              through trusted courier partners. Here is what you can expect once your order is placed.
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
              Need Help With Your Order?
            </h2>
            <p className="text-[#FCFBF8]/50 mb-8 tracking-wide max-w-xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              For any shipping or delivery enquiry, our team is just a message away.
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
