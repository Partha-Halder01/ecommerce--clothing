import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://inyou.shop"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

type Product = { slug?: string; id?: number; created_at?: string }
type Category = { slug?: string }
type Blog = { slug?: string; is_published?: boolean; updated_at?: string }

async function safeJson<T>(path: string): Promise<T[]> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const data = await res.json()
    
    if (Array.isArray(data)) {
      return data as T[]
    }
    
    if (data && typeof data === "object") {
      // Products API returns { products: Product[], total: number }
      if ("products" in data && Array.isArray(data.products)) {
        return data.products as T[]
      }
    }
    
    return []
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/categories`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/blogs`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteUrl}/shipping`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/returns`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ]

  // Pull live products/categories/blogs if the API is reachable; degrade gracefully otherwise.
  const [products, categories, blogs] = await Promise.all([
    safeJson<Product>("/api/products"),
    safeJson<Category>("/api/categories"),
    safeJson<Blog>("/api/blogs"),
  ])

  const productRoutes: MetadataRoute.Sitemap = products
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${siteUrl}/product/${p.slug}`,
      lastModified: p.created_at ? new Date(p.created_at) : now,
      changeFrequency: "weekly",
      priority: 0.7,
    }))

  const categoryRoutes: MetadataRoute.Sitemap = categories
    .filter((c) => c.slug)
    .map((c) => ({
      url: `${siteUrl}/category/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    }))

  const blogRoutes: MetadataRoute.Sitemap = blogs
    .filter((b) => b.is_published && b.slug)
    .map((b) => ({
      url: `${siteUrl}/blogs/${b.slug}`,
      lastModified: b.updated_at ? new Date(b.updated_at) : now,
      changeFrequency: "weekly",
      priority: 0.6,
    }))

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes]
}
