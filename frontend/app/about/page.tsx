"use client"

import { useRef } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

const masculineAnimals = [
  {
    name: "The Wolf",
    subtitle: "The Alpha Instinct",
    persona: "Mysterious, fiercely loyal, and quietly dominant. The Wolf is for the natural leader who operates with instinct and sharp intelligence.",
    vibe: "Dark, woody, and magnetic.",
    notes: "Cold spices (cardamom, black pepper), deep cedarwood, smoky vetiver, and a highly concentrated primal musk that lingers late into the night.",
    color: "#1C1615",
    accent: "#D8B4A0",
    emoji: "🐺",
  },
  {
    name: "The Horse",
    subtitle: "The Untethered Spirit",
    persona: "Raw stamina, unbridled freedom, and undeniable physical presence. The Horse is for the man who is bold, driven, and cannot be fenced in.",
    vibe: "Earthy, rich, and intensely powerful.",
    notes: "Rich Russian leather, wild tobacco, warm amber, and dry hay — designed to project an aura of untamed strength that easily lasts 24+ hours.",
    color: "#2C1810",
    accent: "#C4956A",
    emoji: "🐴",
  },
]

const feminineAnimals = [
  {
    name: "The Swan",
    subtitle: "The Elegant Facade",
    persona: "Flawless grace on the surface, powered by hidden strength underneath. The Swan is for the woman who commands a room through sheer, unbothered elegance and poise.",
    vibe: "Luminous, sophisticated, and deceptively powerful.",
    notes: "A heavy concentration of narcotic white florals (tuberose or pure jasmine), bright aldehydes, and a deep anchoring base of white woods and vanilla for extreme longevity.",
    color: "#F7F2EA",
    accent: "#D8B4A0",
    emoji: "🦢",
    dark: false,
  },
  {
    name: "The Snake",
    subtitle: "The Hypnotic Metamorphosis",
    persona: "Seductive, transformative, and dangerously alluring. The Snake is for the bold woman who embraces her magnetism and leaves an unforgettable, intoxicating trail.",
    vibe: "Warm, venomous, and deeply sensual.",
    notes: "Dark cherry or bitter almond, spiced cinnamon, hypnotic incense, and rich syrupy resins like myrrh or labdanum that grip the skin.",
    color: "#1A0D15",
    accent: "#C084A0",
    emoji: "🐍",
  },
]

const unisexAnimals = [
  {
    name: "The Falcon",
    subtitle: "The Apex Visionary",
    persona: "Sharp focus, breathtaking speed, and elevated perspective. The Falcon is for the visionary who operates above the noise, striking with precision.",
    vibe: "Airy, sharp, and intensely fresh but fiercely anchored.",
    notes: "Cutting metallic notes, sharp bergamot, ozone (the smell of high-altitude air), grounded by heavy oakmoss and patchouli for a bold, lasting sillage.",
    color: "#0D1A2E",
    accent: "#7EB8D4",
    emoji: "🦅",
  },
  {
    name: "The Tiger",
    subtitle: "The Solitary Majesty",
    persona: "Fearless, majestic, and completely comfortable in their own skin. The Tiger represents ultimate confidence and a roaring presence that cannot be ignored.",
    vibe: "Fiery, exotic, and fiercely bold.",
    notes: "Warm roaring spices (saffron and nutmeg), deep glowing amber, rich oud wood, and animalic leather that projects absolute dominance all day long.",
    color: "#1C0A00",
    accent: "#E8842A",
    emoji: "🐯",
  },
]

function AnimalCard({
  animal,
  index,
}: {
  animal: (typeof masculineAnimals)[0]
  index: number
}) {
  const isLight = animal.color === "#F7F2EA"
  const textMain = isLight ? "#1C1615" : "#FCFBF8"
  const textSub = isLight ? "#3C3330" : "#E8E3DC"
  const textMuted = isLight ? "#6B635E" : "#A09890"

  return (
    <motion.div
      variants={index % 2 === 0 ? fadeInLeft : fadeInRight}
      className="relative group overflow-hidden"
      style={{ background: animal.color }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `radial-gradient(ellipse at center, ${animal.accent}18 0%, transparent 70%)`,
        }}
      />
      <div className="relative z-10 p-6 sm:p-8 lg:p-10">

        {/* Card Header */}
        <div className="flex items-start justify-between mb-5 sm:mb-6">
          <div className="flex-1 pr-3">
            <p
              className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-2 sm:mb-3 font-semibold"
              style={{ color: animal.accent, fontFamily: "var(--font-body)" }}
            >
              {animal.subtitle}
            </p>
            <h3
              className="text-2xl sm:text-3xl font-light uppercase tracking-wider sm:tracking-widest"
              style={{ color: textMain, fontFamily: "var(--font-playfair)" }}
            >
              {animal.name}
            </h3>
          </div>
          <span className="text-3xl sm:text-4xl opacity-80 group-hover:scale-110 transition-transform duration-500 shrink-0">
            {animal.emoji}
          </span>
        </div>

        {/* Divider */}
        <div
          className="h-[1px] w-full mb-5 sm:mb-6 opacity-30"
          style={{ background: animal.accent }}
        />

        {/* Content blocks */}
        <div className="space-y-4 sm:space-y-5">
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.25em] mb-1.5 opacity-70"
              style={{ color: animal.accent, fontFamily: "var(--font-body)" }}
            >
              The Persona
            </p>
            <p
              className="text-sm leading-relaxed font-light"
              style={{ color: textSub, fontFamily: "var(--font-body)" }}
            >
              {animal.persona}
            </p>
          </div>

          <div>
            <p
              className="text-[10px] uppercase tracking-[0.25em] mb-1.5 opacity-70"
              style={{ color: animal.accent, fontFamily: "var(--font-body)" }}
            >
              The Vibe
            </p>
            <p
              className="text-sm italic font-light"
              style={{ color: isLight ? "#6B635E" : "#C8C0B8", fontFamily: "var(--font-playfair)" }}
            >
              {animal.vibe}
            </p>
          </div>

          <div>
            <p
              className="text-[10px] uppercase tracking-[0.25em] mb-1.5 opacity-70"
              style={{ color: animal.accent, fontFamily: "var(--font-body)" }}
            >
              Scent Profile
            </p>
            <p
              className="text-sm leading-relaxed font-light"
              style={{ color: textMuted, fontFamily: "var(--font-body)" }}
            >
              {animal.notes}
            </p>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="h-[2px] w-0 group-hover:w-full mt-6 sm:mt-8 transition-all duration-700 ease-out"
          style={{ background: animal.accent }}
        />
      </div>
    </motion.div>
  )
}

// Reusable collection section header
function CollectionHeader({
  label,
  title,
  labelColor = "#D8B4A0",
  titleColor = "#FCFBF8",
}: {
  label: string
  title: string
  labelColor?: string
  titleColor?: string
}) {
  return (
    <motion.div variants={fadeIn} className="text-center mb-10 sm:mb-16">
      <div className="flex items-center justify-center gap-4 mb-4 sm:mb-5">
        <div className="h-[1px] w-8 sm:w-16" style={{ background: `${labelColor}50` }} />
        <p
          className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.5em] font-semibold"
          style={{ color: labelColor, fontFamily: "var(--font-body)" }}
        >
          {label}
        </p>
        <div className="h-[1px] w-8 sm:w-16" style={{ background: `${labelColor}50` }} />
      </div>
      <h2
        className="text-3xl sm:text-4xl lg:text-5xl font-light uppercase tracking-wide sm:tracking-widest"
        style={{ color: titleColor, fontFamily: "var(--font-playfair)" }}
      >
        {title}
      </h2>
    </motion.div>
  )
}

export default function AboutPage() {
  const heroRef = useRef(null)
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "35%"])

  const bannerRef = useRef(null)
  const { scrollYProgress: bannerScroll } = useScroll({
    target: bannerRef,
    offset: ["start end", "end start"],
  })
  const bannerY = useTransform(bannerScroll, [0, 1], ["-10%", "10%"])

  return (
    <div className="min-h-screen bg-[#FCFBF8] overflow-x-hidden">
      <Header />
      <main>

        {/* ─── HERO ─────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          className="relative h-[75vh] sm:h-[85vh] overflow-hidden flex items-center justify-center bg-[#0D0A09]"
        >
          <motion.div
            style={{ y: heroY }}
            className="absolute inset-0 w-full h-[130%] -top-[15%]"
          >
            <Image
              src="/images/about/about-bottles.jpg"
              alt="In You Fragrances — The Primal Collection"
              fill
              className="object-cover opacity-55"
              priority
            />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0A09] via-[#0D0A09]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D0A09]/60 via-transparent to-transparent" />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="relative z-10 w-full px-5 sm:px-8 text-center"
          >
            <div className="max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto mt-16 sm:mt-20">

              <motion.div variants={fadeIn} className="flex items-center justify-center gap-3 sm:gap-5 mb-5 sm:mb-8">
                <div className="h-[1px] w-8 sm:w-16 bg-[#D8B4A0]" />
                <p
                  className="text-[9px] sm:text-xs uppercase tracking-[0.4em] sm:tracking-[0.5em] text-[#D8B4A0] font-medium"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  The Wild Within
                </p>
                <div className="h-[1px] w-8 sm:w-16 bg-[#D8B4A0]" />
              </motion.div>

              {/* Mobile: smaller hero text to prevent overflow */}
              <motion.h1
                variants={fadeIn}
                className="text-[3rem] xs:text-[3.5rem] sm:text-7xl lg:text-[9rem] font-light mb-4 sm:mb-6 text-[#FCFBF8] leading-none uppercase tracking-[0.12em] sm:tracking-widest"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                IN YOU
              </motion.h1>

              <motion.p
                variants={fadeIn}
                className="text-sm sm:text-lg lg:text-2xl text-[#D8B4A0]/90 italic font-light"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Bottle Your Primal Signature
              </motion.p>
            </div>
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-[#FCFBF8] to-transparent" />
        </section>

        {/* ─── BRAND STORY ─────────────────────────────────────── */}
        <section className="py-16 sm:py-28 lg:py-40 bg-[#FCFBF8] overflow-hidden">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="container mx-auto px-5 sm:px-8 lg:px-8"
          >
            <div className="max-w-3xl mx-auto text-center">
              <motion.p
                variants={fadeIn}
                className="text-[10px] sm:text-sm uppercase tracking-[0.4em] text-[#D8B4A0] mb-6 sm:mb-10 font-semibold"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Founded 2023 · By Ayush
              </motion.p>
              <motion.h2
                variants={fadeIn}
                className="text-3xl sm:text-4xl lg:text-6xl font-light text-[#1C1615] mb-6 sm:mb-10 leading-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Beneath the veneer of{" "}
                <span className="italic text-[#D8B4A0]">modern elegance</span>{" "}
                lies a primal instinct.
              </motion.h2>
              <motion.p
                variants={fadeIn}
                className="text-sm sm:text-base lg:text-lg text-[#6B635E] leading-relaxed font-light tracking-wide"
                style={{ fontFamily: "var(--font-body)" }}
              >
                We are all driven by an untamed nature—a silent roar, a graceful hunt, a fierce loyalty.
                In 2023, a vision was born to capture this raw essence, translating our most powerful inner
                spirits into the ultimate expression of sophisticated luxury.
              </motion.p>
            </div>
          </motion.div>
        </section>

        {/* ─── PRODUCT IMAGE BANNER ────────────────────────────── */}
        <section
          ref={bannerRef}
          className="relative h-[50vh] sm:h-[65vh] overflow-hidden bg-[#1C1615]"
        >
          <motion.div
            style={{ y: bannerY }}
            className="absolute inset-0 w-full h-[130%] -top-[15%]"
          >
            <Image
              src="/images/about/about-boxes.jpg"
              alt="In You Fragrances — Signature Collection Boxes"
              fill
              className="object-cover object-center opacity-80"
            />
          </motion.div>
          <div className="absolute inset-0 bg-[#1C1615]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1615]/90 via-transparent to-transparent" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="absolute bottom-0 left-0 right-0 z-10 text-center px-5 pb-10 sm:pb-20"
          >
            <p
              className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#D8B4A0] mb-3 sm:mb-4"
              style={{ fontFamily: "var(--font-body)" }}
            >
              The Collection
            </p>
            <h2
              className="text-2xl sm:text-5xl lg:text-6xl font-light text-[#FCFBF8] uppercase tracking-wide sm:tracking-widest"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Whisper Your True Self
            </h2>
          </motion.div>
        </section>

        {/* ─── MISSION STATEMENT ───────────────────────────────── */}
        <section className="py-16 sm:py-28 bg-[#1C1615] text-[#FCFBF8]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="container mx-auto px-5 sm:px-8 lg:px-8"
          >
            <div className="max-w-4xl mx-auto">
              <motion.p
                variants={fadeIn}
                className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#D8B4A0] mb-6 sm:mb-10 font-semibold text-center"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Our Craft
              </motion.p>
              <motion.p
                variants={fadeIn}
                className="text-xl sm:text-3xl lg:text-4xl font-light leading-relaxed text-center"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                In You Fragrances marries the{" "}
                <span className="italic text-[#D8B4A0]">untamed art of perfumery</span>{" "}
                with absolute scientific precision. Every drop is meticulously formulated to interact
                flawlessly with the skin's natural chemistry.
              </motion.p>

              {/* Stats — stacked on mobile, row on sm+ */}
              <motion.div
                variants={staggerContainer}
                className="mt-12 sm:mt-20 border border-[#D8B4A0]/20 divide-y sm:divide-y-0 sm:divide-x divide-[#D8B4A0]/20 grid grid-cols-1 sm:grid-cols-3"
              >
                {[
                  {
                    label: "Longevity",
                    value: "24+ Hours",
                    desc: "An exceptional sillage that lingers beautifully well beyond a single day.",
                  },
                  {
                    label: "Founded",
                    value: "2023",
                    desc: "Born from a vision to bottle the raw essence of our most powerful inner spirits.",
                  },
                  {
                    label: "Signatures",
                    value: "6 Spirits",
                    desc: "Each fragrance dedicated to a specific animalistic character within you.",
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    variants={fadeIn}
                    className="p-7 sm:p-10 text-center"
                  >
                    <p
                      className="text-[10px] uppercase tracking-[0.4em] text-[#D8B4A0]/70 mb-2 sm:mb-3"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {stat.label}
                    </p>
                    <p
                      className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#FCFBF8] mb-2 sm:mb-4"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className="text-xs sm:text-sm text-[#FCFBF8]/50 font-light leading-relaxed"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {stat.desc}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ─── WHY CHOOSE US ───────────────────────────────────── */}
        <section className="py-16 sm:py-28 lg:py-36 bg-[#FCFBF8]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="container mx-auto px-5 sm:px-8 lg:px-8 max-w-6xl"
          >
            <motion.div variants={fadeIn} className="text-center mb-10 sm:mb-16">
              <p
                className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#D8B4A0] mb-3 sm:mb-4 font-semibold"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Why Choose Us
              </p>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#1C1615] uppercase tracking-wide sm:tracking-widest"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Unapologetic Elegance
              </h2>
            </motion.div>

            {/* Cards — stacked on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#D8B4A0]/20">
              {[
                {
                  title: "Extreme Longevity",
                  desc: "Formulated with an expert understanding of molecular binding, our fragrances lock onto your skin — ensuring a bold, evolving scent trail that lasts far beyond a single day.",
                  icon: "⟳",
                },
                {
                  title: "The Primal Signature",
                  desc: "We offer more than just a pleasant aroma; we offer an identity. By aligning each scent with a specific animalistic spirit, you are claiming your inner character.",
                  icon: "◈",
                },
                {
                  title: "Unapologetic Elegance",
                  desc: "We use only the highest concentration of premium, luxurious ingredients. Our fragrances are designed for those who want to command a room with a fierce, bold scent.",
                  icon: "✦",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeIn}
                  className="bg-[#FCFBF8] p-7 sm:p-10 group hover:bg-[#1C1615] transition-colors duration-700"
                >
                  <p
                    className="text-2xl sm:text-3xl text-[#D8B4A0] mb-5 sm:mb-7"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {item.icon}
                  </p>
                  <h3
                    className="text-lg sm:text-xl font-light text-[#1C1615] group-hover:text-[#FCFBF8] mb-3 sm:mb-4 uppercase tracking-wide sm:tracking-widest transition-colors duration-700"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm text-[#6B635E] group-hover:text-[#FCFBF8]/60 leading-relaxed font-light transition-colors duration-700"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ─── MASCULINE COLLECTION ────────────────────────────── */}
        <section className="py-16 sm:py-28 bg-[#0D0A09]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="container mx-auto px-5 sm:px-8 lg:px-8 max-w-6xl"
          >
            <CollectionHeader
              label="The Masculine Collection"
              title="Power & Instinct"
              labelColor="#D8B4A0"
              titleColor="#FCFBF8"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {masculineAnimals.map((animal, i) => (
                <AnimalCard key={animal.name} animal={animal} index={i} />
              ))}
            </div>
          </motion.div>
        </section>

        {/* ─── FEMININE COLLECTION ─────────────────────────────── */}
        <section className="py-16 sm:py-28 bg-[#F7F0EC]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="container mx-auto px-5 sm:px-8 lg:px-8 max-w-6xl"
          >
            <CollectionHeader
              label="The Feminine Collection"
              title="Grace & Seduction"
              labelColor="#D8B4A0"
              titleColor="#1C1615"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {feminineAnimals.map((animal, i) => (
                <AnimalCard key={animal.name} animal={animal} index={i} />
              ))}
            </div>
          </motion.div>
        </section>

        {/* ─── UNISEX COLLECTION ───────────────────────────────── */}
        <section className="py-16 sm:py-28 bg-[#FCFBF8]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="container mx-auto px-5 sm:px-8 lg:px-8 max-w-6xl"
          >
            <CollectionHeader
              label="The Unisex Collection"
              title="Majesty & Vision"
              labelColor="#D8B4A0"
              titleColor="#1C1615"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {unisexAnimals.map((animal, i) => (
                <AnimalCard key={animal.name} animal={animal} index={i} />
              ))}
            </div>
          </motion.div>
        </section>

        {/* ─── BOTTLES SHOWCASE ────────────────────────────────── */}
        <section className="relative overflow-hidden bg-[#1C1615]">
          <div className="relative h-[55vh] sm:h-[70vh]">
            <Image
              src="/images/about/about-bottles.jpg"
              alt="In You Fragrances — Full Collection"
              fill
              className="object-cover opacity-65"
            />
            {/* Mobile: full overlay; desktop: side gradient */}
            <div className="absolute inset-0 bg-[#1C1615]/50 sm:bg-transparent sm:bg-gradient-to-r sm:from-[#1C1615]/80 sm:via-transparent sm:to-[#1C1615]/60" />
            <div className="absolute inset-0 flex items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="container mx-auto px-5 sm:px-8 lg:px-8 max-w-2xl text-center sm:text-left"
              >
                <motion.p
                  variants={fadeIn}
                  className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#D8B4A0] mb-4 sm:mb-6 font-semibold"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Our Philosophy
                </motion.p>
                <motion.h2
                  variants={fadeIn}
                  className="text-2xl sm:text-4xl lg:text-5xl font-light text-[#FCFBF8] mb-4 sm:mb-8 leading-snug"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  We don&apos;t just craft perfumes—
                  <span className="italic text-[#D8B4A0]"> we bottle your primal signature.</span>
                </motion.h2>
                <motion.p
                  variants={fadeIn}
                  className="text-xs sm:text-sm text-[#FCFBF8]/70 leading-relaxed font-light"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  A fragrance should do more than smell pleasant — it should awaken the spirit.
                  Each perfume is a dedicated homage to a specific animalistic character,
                  allowing you to channel the instinct that resonates deeply within you.
                </motion.p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── CTA ─────────────────────────────────────────────── */}
        <section className="py-16 sm:py-28 bg-[#FCFBF8] text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="container mx-auto px-5 sm:px-8 lg:px-8"
          >
            <motion.p
              variants={fadeIn}
              className="text-[10px] sm:text-sm uppercase tracking-[0.4em] text-[#D8B4A0] mb-4 sm:mb-6 font-semibold"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Claim Your Instinct
            </motion.p>
            <motion.h2
              variants={fadeIn}
              className="text-3xl sm:text-5xl lg:text-7xl font-light text-[#1C1615] mb-5 sm:mb-8 uppercase tracking-wide sm:tracking-widest"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Which Animal Are You?
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-sm sm:text-base text-[#6B635E] mb-10 sm:mb-14 max-w-xl mx-auto font-light leading-relaxed px-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Whether it is the quiet, magnetic stealth of the panther, the majestic dominance of the lion,
              or the untethered freedom of the wild stallion — our fragrances allow you to channel the
              instinct that resonates deeply within you.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <a
                href="/shop"
                className="w-full sm:w-auto inline-block bg-[#1C1615] text-[#FCFBF8] px-8 sm:px-12 py-4 sm:py-5 hover:bg-[#D8B4A0] hover:text-[#1C1615] transition-all duration-500 uppercase tracking-[0.2em] text-xs sm:text-sm font-medium text-center"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Shop The Collection
              </a>
              <a
                href="/contact"
                className="w-full sm:w-auto inline-block border border-[#1C1615] text-[#1C1615] px-8 sm:px-12 py-4 sm:py-5 hover:border-[#D8B4A0] hover:text-[#D8B4A0] transition-all duration-500 uppercase tracking-[0.2em] text-xs sm:text-sm font-medium text-center"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Contact Us
              </a>
            </motion.div>
          </motion.div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
