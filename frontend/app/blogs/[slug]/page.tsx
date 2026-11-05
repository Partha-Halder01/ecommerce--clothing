import BlogPageClient from "./client-page"

// Required for static export with dynamic routes
export const dynamicParams = true
export async function generateStaticParams() {
  return []
}

export default function BlogPage() {
  return <BlogPageClient />
}
