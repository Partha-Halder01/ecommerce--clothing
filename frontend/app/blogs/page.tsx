"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FileText, ArrowRight, Loader2 } from "lucide-react"
import { blogsAPI, Blog } from "@/lib/api"
import { motion } from "framer-motion"

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPublishedBlogs()
  }, [])

  const fetchPublishedBlogs = async () => {
    try {
      const data = await blogsAPI.getAll()
      setBlogs(data)
    } catch (error) {
      console.error("Failed to load blog posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FCFBF8] flex flex-col justify-between">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[30vh] sm:h-[40vh] overflow-hidden bg-[#1C1615]">
          <div className="absolute inset-0 opacity-80">
            <img
              src="/images/banner-journal.png"
              alt="Journal Banner"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-black/35" />
          <div className="relative h-full container mx-auto px-4 flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light mb-4 text-[#FCFBF8] tracking-widest uppercase" style={{ fontFamily: "var(--font-playfair)" }}>Journal</h1>
              <p className="text-xs sm:text-sm text-[#D8B4A0] max-w-lg mx-auto uppercase tracking-[0.3em]" style={{ fontFamily: "var(--font-body)" }}>
                Exploring the convergence of raw character and refined perfumery
              </p>
            </motion.div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 sm:py-24 container mx-auto px-6 max-w-7xl">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#D8B4A0] mb-4" />
              <p className="text-sm text-[#6B635E] font-light uppercase tracking-widest" style={{ fontFamily: "var(--font-body)" }}>Gathering articles...</p>
            </div>
          ) : blogs.length > 0 ? (
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
            >
              {blogs.map((blog) => (
                <motion.div 
                  key={blog.id} 
                  variants={fadeIn}
                  className="group flex flex-col h-full bg-white border border-[#E8E3DC] overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <Link href={`/blogs/${blog.slug}`} className="relative h-64 w-full bg-[#F4F1EB] overflow-hidden block">
                    {blog.image_url ? (
                      <Image 
                        src={blog.image_url} 
                        alt={blog.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <FileText className="h-16 w-16 opacity-20" />
                      </div>
                    )}
                  </Link>

                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#D8B4A0] mb-3 font-semibold" style={{ fontFamily: "var(--font-body)" }}>
                        By {blog.author}
                      </p>
                      
                      <Link href={`/blogs/${blog.slug}`}>
                        <h2 className="text-2xl font-light text-[#1C1615] mb-4 hover:text-[#D8B4A0] transition-colors line-clamp-2 leading-snug" style={{ fontFamily: "var(--font-playfair)" }}>
                          {blog.title}
                        </h2>
                      </Link>
                      
                      <p className="text-sm text-[#6B635E] leading-relaxed font-light line-clamp-3 mb-6" style={{ fontFamily: "var(--font-body)" }}>
                        {blog.summary}
                      </p>
                    </div>

                    <Link href={`/blogs/${blog.slug}`} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#1C1615] hover:text-[#D8B4A0] transition-colors mt-auto group/btn" style={{ fontFamily: "var(--font-body)" }}>
                      Read Article 
                      <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 border border-dashed border-[#E8E3DC] bg-white rounded-sm max-w-xl mx-auto">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-20 text-[#1C1615]" />
              <p className="text-lg font-light text-[#1C1615]" style={{ fontFamily: "var(--font-playfair)" }}>Journal is currently quiet</p>
              <p className="text-sm text-[#6B635E] font-light mt-1">Our editors are crafting new scent stories. Check back soon.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
