"use client"

import { useRef } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { motion, useScroll, useTransform } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

export default function AboutPage() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  const bannerRef = useRef(null)
  const { scrollYProgress: bannerScroll } = useScroll({
    target: bannerRef,
    offset: ["start end", "end start"]
  })
  const bannerY = useTransform(bannerScroll, [0, 1], ["-20%", "20%"])

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
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
        {/* Parallax Hero */}
        <section ref={containerRef} className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden flex items-center justify-center bg-[#1C1615]">
          <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
            <img
              src="https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2000&auto=format&fit=crop"
              alt="Luxury Perfume Heritage"
              className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
            />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#FCFBF8] via-transparent to-transparent opacity-90" />
          <div className="absolute inset-0 bg-[#1C1615]/30" />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="relative z-10 w-full container mx-auto px-4 lg:px-8 text-center"
          >
            <div className="max-w-4xl mx-auto mt-20">
              <motion.div variants={fadeIn} className="flex items-center justify-center gap-4 mb-6">
                <div className="h-[1px] w-12 bg-[#D8B4A0]"></div>
                <p className="text-xs sm:text-sm uppercase tracking-[0.4em] text-[#FCFBF8] font-medium" style={{ fontFamily: "var(--font-body)" }}>
                  The Heritage
                </p>
                <div className="h-[1px] w-12 bg-[#D8B4A0]"></div>
              </motion.div>
              <motion.h1 variants={fadeIn} className="text-5xl sm:text-7xl lg:text-9xl font-light mb-8 text-[#FCFBF8] leading-none uppercase tracking-widest drop-shadow-sm" style={{ fontFamily: "var(--font-playfair)" }}>
                INYOU
              </motion.h1>
              <motion.p variants={fadeIn} className="text-xl sm:text-2xl lg:text-3xl text-[#FCFBF8]/90 italic font-light drop-shadow-md" style={{ fontFamily: "var(--font-playfair)" }}>
                The Essence of Your Presence
              </motion.p>
            </div>
          </motion.div>
        </section>

        {/* Philosophy */}
        <section className="py-20 sm:py-32 lg:py-40 bg-[#FCFBF8] overflow-hidden">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="container mx-auto px-4 lg:px-8"
          >
            <div className="max-w-5xl mx-auto text-center">
              <motion.p variants={fadeIn} className="text-xs sm:text-sm uppercase tracking-[0.4em] text-[#D8B4A0] mb-8 font-semibold" style={{ fontFamily: "var(--font-body)" }}>
                Our Philosophy
              </motion.p>
              <motion.p variants={fadeIn} className="text-2xl sm:text-3xl lg:text-5xl text-[#1C1615] leading-snug tracking-wide font-light" style={{ fontFamily: "var(--font-playfair)" }}>
                We curate fragrances that blend <span className="italic text-[#D8B4A0]">masterful artistry</span>, rare ingredients, and timeless elegance into a singular olfactory journey.
              </motion.p>
            </div>
          </motion.div>
        </section>

        {/* Parallax Image Banner */}
        <section ref={bannerRef} className="relative h-[60vh] sm:h-[70vh] overflow-hidden bg-[#1C1615] flex items-center justify-center">
          <motion.div style={{ y: bannerY }} className="absolute inset-0 w-full h-[150%] -top-[25%] bg-[#1C1615]">
            <img
              src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2000&auto=format&fit=crop"
              alt="Craftsmanship"
              className="w-full h-full object-cover opacity-50 mix-blend-screen"
            />
          </motion.div>
          <div className="absolute inset-0 bg-black/20" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="relative z-10 text-center px-4 max-w-3xl"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-light text-[#FCFBF8] mb-6 uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>
              Artisanal Craft
            </h2>
            <p className="text-lg text-[#E8E3DC] tracking-widest uppercase font-light" style={{ fontFamily: "var(--font-body)" }}>
              Every note is carefully selected. Every bottle perfectly designed.
            </p>
          </motion.div>
        </section>

        {/* Values Section */}
        <section className="py-24 sm:py-32 lg:py-40 bg-[#FCFBF8]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="container mx-auto px-4 lg:px-8 max-w-6xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <motion.div variants={fadeIn} className="order-2 lg:order-1 relative aspect-[4/5] bg-[#F4F1EB] p-4 sm:p-8">
                <img
                  src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop"
                  alt="Perfume elements"
                  className="w-full h-full object-cover shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#1C1615] rounded-full flex items-center justify-center shadow-xl hidden sm:flex">
                  <p className="text-[#FCFBF8] text-xs uppercase tracking-widest text-center" style={{ fontFamily: "var(--font-body)" }}>Est. <br /> 2024</p>
                </div>
              </motion.div>
              <div className="order-1 lg:order-2">
                <motion.div variants={fadeIn} className="flex items-center gap-4 mb-8">
                  <div className="h-[1px] w-8 bg-[#D8B4A0]"></div>
                  <p className="text-xs uppercase tracking-[0.4em] text-[#D8B4A0] font-semibold" style={{ fontFamily: "var(--font-body)" }}>
                    Our Standards
                  </p>
                </motion.div>
                <motion.h2 variants={fadeIn} className="text-4xl sm:text-5xl font-light text-[#1C1615] mb-10 leading-tight uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>
                  Uncompromising Quality
                </motion.h2>

                <motion.div variants={staggerContainer} className="space-y-6 lg:space-y-8">
                  {[
                    { title: "Rare Ingredients", desc: "We source only the finest botanicals from absolute producers globally." },
                    { title: "Master Perfumers", desc: "Collaborating with renowned noses to create complex, enduring fragrance profiles." },
                    { title: "Sustainable Luxury", desc: "Committed to highly ethical sourcing and environmentally conscious packaging." }
                  ].map((item, i) => (
                    <motion.div variants={fadeIn} key={i} className="flex gap-6">
                      <div className="w-10 h-10 shrink-0 rounded-full border border-[#D8B4A0] flex items-center justify-center bg-[#F4F1EB]">
                        <CheckCircle2 className="w-5 h-5 text-[#D8B4A0]" />
                      </div>
                      <div>
                        <h3 className="text-xl text-[#1C1615] font-light tracking-wide mb-2" style={{ fontFamily: "var(--font-playfair)" }}>{item.title}</h3>
                        <p className="text-[#6B635E] tracking-wide text-sm font-light leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="py-24 sm:py-32 bg-[#1C1615] text-[#FCFBF8] text-center border-t border-[#D8B4A0]/20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="container mx-auto px-4 lg:px-8"
          >
            <motion.p variants={fadeIn} className="text-sm uppercase tracking-[0.4em] text-[#D8B4A0] mb-6 font-semibold" style={{ fontFamily: "var(--font-body)" }}>
              The Next Chapter
            </motion.p>
            <motion.h2 variants={fadeIn} className="text-4xl sm:text-5xl lg:text-7xl font-light mb-8 uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>Ready for elegance?</motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-[#FCFBF8]/70 mb-12 max-w-2xl mx-auto tracking-wide font-light" style={{ fontFamily: "var(--font-body)" }}>
              Begin your olfactory journey with Inyou today. Let our signature collections guide your senses.
            </motion.p>
            <motion.div variants={fadeIn}>
              <a href="/shop" className="inline-block bg-[#FCFBF8] text-[#1C1615] px-12 py-5 hover:bg-[#D8B4A0] hover:text-[#1C1615] transition-all duration-500 uppercase tracking-[0.2em] text-sm font-medium">
                Shop The Collection
              </a>
            </motion.div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
