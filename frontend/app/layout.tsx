import type React from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond, Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { FloatingButtons } from "@/components/layout/floating-buttons"
import "./globals.css"

const cormorantGaramond = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-playfair", // Keep the old variable name to avoid refactoring everything
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-inter", // Keep old variable name
})

export const metadata: Metadata = {
  title: "Inyou - Luxury Perfume Brand",
  description: "Discover the essence of luxury with Inyou. Curated fragrances that define your presence.",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${cormorantGaramond.variable} ${montserrat.variable} font-sans antialiased bg-[#FCFBF8]`}>
        {children}
        <FloatingButtons />
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}

