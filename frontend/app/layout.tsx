import type React from "react"
import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { FloatingButtons } from "@/components/layout/floating-buttons"
import "./globals.css"

const cormorantGaramond = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair", // Keep the old variable name to avoid refactoring everything
})

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter", // Keep old variable name
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.inyoufragrances.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "In You — Luxury Perfumes & Signature Fragrances",
    template: "%s | In You",
  },
  description:
    "Discover In You — luxury perfumes and signature fragrances crafted for the modern individual. Authentic, long-lasting scents with secure payment and fast delivery across India.",
  keywords: [
    "In You",
    "Inyou",
    "luxury perfume",
    "perfume India",
    "fragrances",
    "signature scents",
    "eau de parfum",
    "Vayuroma Fragrances",
    "buy perfume online",
  ],
  applicationName: "In You",
  authors: [{ name: "Vayuroma Fragrances (OPC) Pvt Ltd" }],
  creator: "Vayuroma Fragrances (OPC) Pvt Ltd",
  publisher: "Vayuroma Fragrances (OPC) Pvt Ltd",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "In You",
    title: "In You — Luxury Perfumes & Signature Fragrances",
    description:
      "Luxury perfumes and signature fragrances crafted for the modern individual. Authentic, long-lasting scents delivered across India.",
    images: [
      {
        url: "/logo-dark.png",
        width: 600,
        height: 600,
        alt: "In You — Luxury Perfumes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "In You — Luxury Perfumes & Signature Fragrances",
    description:
      "Luxury perfumes and signature fragrances crafted for the modern individual.",
    images: ["/logo-dark.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "shopping",
  generator: "Next.js",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1C1615",
  colorScheme: "light",
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "In You",
  legalName: "Vayuroma Fragrances (OPC) Pvt Ltd",
  url: siteUrl,
  logo: `${siteUrl}/logo-dark.png`,
  email: "support@inyoufragrances.com",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-99992-73927",
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["en", "hi"],
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Delhi",
    addressCountry: "IN",
  },
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "In You",
  url: siteUrl,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${cormorantGaramond.variable} ${montserrat.variable} font-sans antialiased bg-[#FCFBF8]`}>
        {children}
        <FloatingButtons />
        <Toaster />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  )
}
