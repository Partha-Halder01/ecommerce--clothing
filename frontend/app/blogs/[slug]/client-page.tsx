"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ArrowLeft, Clock, Calendar, User, Share2, FileText, ChevronRight } from "lucide-react"
import { blogsAPI, Blog } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function BlogPageClient() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const slug = params?.slug as string
  const [blog, setBlog] = useState<Blog | null>(null)
  const [nextBlogs, setNextBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      fetchBlogDetails()
    }
  }, [slug])

  const fetchBlogDetails = async () => {
    try {
      const data = await blogsAPI.getBySlug(slug)
      setBlog(data)

      // Fetch other articles for "Read Next" section
      const allBlogs = await blogsAPI.getAll()
      const remaining = allBlogs.filter((b: Blog) => b.id !== data.id).slice(0, 3)
      setNextBlogs(remaining)
    } catch (error) {
      console.error("Failed to load blog article:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      toast({ title: "Copied!", description: "Link copied to clipboard." })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FCFBF8] flex flex-col justify-between">
        <Header />
        <main className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1C1615]"></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#FCFBF8] flex flex-col justify-between">
        <Header />
        <main className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <p className="text-[#1C1615] text-2xl font-light uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>Article Not Found</p>
          <Link href="/blogs" className="text-xs text-[#D8B4A0] uppercase tracking-[0.2em] hover:text-[#1C1615] transition-colors border-b border-[#D8B4A0] pb-1">
            Return to Journal
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  // Simple reading time estimator (assuming 200 words per minute)
  const getReadingTime = (text: string) => {
    const words = text.split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    return `${minutes} min read`
  }

  return (
    <div className="min-h-screen bg-[#FCFBF8] flex flex-col justify-between">
      <Header />
      <main className="flex-grow">
        {/* Breadcrumb & Navigation */}
        <div className="container mx-auto px-6 max-w-4xl pt-8 pb-4 flex items-center justify-between text-xs uppercase tracking-widest text-[#6B635E] font-medium" style={{ fontFamily: "var(--font-body)" }}>
          <button onClick={() => router.push("/blogs")} className="flex items-center gap-1.5 hover:text-[#1C1615] transition-colors">
            <ArrowLeft className="h-3 w-3" /> Back to Journal
          </button>
          <div className="flex items-center gap-1.5">
            <span>Journal</span>
            <ChevronRight className="h-3.5 w-3.5 opacity-45" />
            <span className="text-[#1C1615] font-semibold truncate max-w-[150px] sm:max-w-xs">{blog.title}</span>
          </div>
        </div>

        {/* Article Container */}
        <article className="container mx-auto px-6 max-w-4xl pb-24">
          {/* Header Metadata */}
          <div className="text-center pt-8 pb-10">
            <h1 className="text-3xl sm:text-5xl font-light text-[#1C1615] leading-tight uppercase tracking-wide mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-widest text-[#6B635E] font-medium pt-2 border-t border-[#E8E3DC]/60 max-w-lg mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-[#D8B4A0]" />
                <span>{blog.author}</span>
              </div>

              <button onClick={handleShare} className="flex items-center gap-1 hover:text-[#1C1615] transition-colors ml-auto sm:ml-0">
                <Share2 className="h-3.5 w-3.5 text-[#D8B4A0]" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Featured Image */}
          {blog.image_url && (
            <div className="relative aspect-[16/9] w-full bg-[#F4F1EB] border border-[#E8E3DC] mb-12 overflow-hidden shadow-sm">
              <Image src={blog.image_url} alt={blog.title} fill className="object-cover" priority />
            </div>
          )}

          {/* Intro Summary */}
          {blog.summary && (
            <div className="border-l-2 border-[#D8B4A0] pl-6 mb-10">
              <p className="text-lg sm:text-xl font-light italic leading-relaxed text-[#1C1615]" style={{ fontFamily: "var(--font-playfair)" }}>
                {blog.summary}
              </p>
            </div>
          )}

          {/* Main Body Content */}
          <div 
            className="prose max-w-none text-[#1C1615] font-light leading-relaxed text-base space-y-6"
            style={{ fontFamily: "var(--font-body)" }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Article Footer separator */}
          <div className="w-16 h-px bg-[#D8B4A0] mx-auto my-16" />

          {/* Recommended Articles / Read Next */}
          {nextBlogs.length > 0 && (
            <div className="mt-16">
              <h3 className="text-xl uppercase tracking-widest text-[#1C1615] font-light text-center mb-10" style={{ fontFamily: "var(--font-playfair)" }}>
                Read Next
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {nextBlogs.map((b) => (
                  <div key={b.id} className="group flex flex-col h-full bg-white border border-[#E8E3DC]">
                    <Link href={`/blogs/${b.slug}`} className="relative h-40 w-full bg-[#F4F1EB] overflow-hidden block">
                      {b.image_url ? (
                        <Image src={b.image_url} alt={b.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <FileText className="h-10 w-10 opacity-20" />
                        </div>
                      )}
                    </Link>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-[#D8B4A0] mb-2 font-semibold" style={{ fontFamily: "var(--font-body)" }}>
                          By {b.author}
                        </p>
                        <Link href={`/blogs/${b.slug}`}>
                          <h4 className="text-base font-normal text-[#1C1615] mb-2 line-clamp-2 leading-snug hover:text-[#D8B4A0] transition-colors" style={{ fontFamily: "var(--font-playfair)" }}>
                            {b.title}
                          </h4>
                        </Link>
                      </div>
                      <Link href={`/blogs/${b.slug}`} className="text-[10px] uppercase tracking-widest font-semibold text-[#1C1615] hover:text-[#D8B4A0] transition-colors mt-4 block" style={{ fontFamily: "var(--font-body)" }}>
                        Read Article
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  )
}
