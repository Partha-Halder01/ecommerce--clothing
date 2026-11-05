"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, FileText, Loader2 } from "lucide-react"
import { blogsAPI, Blog } from "@/lib/api"

export function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLatestBlogs()
  }, [])

  const fetchLatestBlogs = async () => {
    try {
      const data = await blogsAPI.getAll()
      // Filter published and get first 4
      const published = data.filter(b => b.is_published).slice(0, 4)
      setBlogs(published)
    } catch (error) {
      console.error("Failed to fetch homepage blogs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // If no blogs, don't show the section
  if (!isLoading && blogs.length === 0) {
    return null
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#FCFBF8] border-t border-[#D8B4A0]/10">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <p
              className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#D8B4A0] mb-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              The Editorial
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#1C1615] uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>
              Blogs
            </h2>
          </div>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#1C1615] hover:text-[#D8B4A0] transition-colors group"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Explore Journal
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[#D8B4A0]" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="group flex flex-col h-full bg-[#FCFBF8] border border-[#E8E3DC] overflow-hidden hover:border-[#D8B4A0]/50 hover:shadow-[0_8px_30px_rgba(216,180,160,0.15)] transition-all duration-500"
              >
                {/* Image Section */}
                <Link href={`/blogs/${blog.slug}`} className="relative aspect-[4/5] w-full bg-[#1C1615]/5 overflow-hidden block">
                  {blog.image_url ? (
                    <Image
                      src={blog.image_url}
                      alt={blog.title}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-all duration-[1.2s] ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <FileText className="h-12 w-12 opacity-20" />
                    </div>
                  )}
                  {/* Shimmer borders on hover */}
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D8B4A0] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D8B4A0] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1615]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>

                {/* Info Section */}
                <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Author - Date/Read Time removed */}
                    <p
                      className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#D8B4A0] mb-2 font-semibold"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      By {blog.author}
                    </p>

                    <Link href={`/blogs/${blog.slug}`}>
                      <h3
                        className="font-light text-xs sm:text-base text-[#1C1615] hover:text-[#D8B4A0] transition-colors duration-500 uppercase tracking-widest line-clamp-2 mb-2 sm:mb-3 leading-snug"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {blog.title}
                      </h3>
                    </Link>

                    <p
                      className="text-[11px] sm:text-xs text-[#6B635E] leading-relaxed font-light line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-5 hidden sm:block"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {blog.summary}
                    </p>
                  </div>

                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold text-[#1C1615] hover:text-[#D8B4A0] transition-colors mt-auto group/btn"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Read Article
                    <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
