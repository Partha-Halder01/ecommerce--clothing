import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://inyou.shop"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/account", "/checkout", "/cart", "/order-confirmation", "/login", "/signup"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/admin", "/admin/", "/account", "/checkout", "/cart", "/order-confirmation"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/admin", "/admin/", "/account", "/checkout", "/cart", "/order-confirmation"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/admin", "/admin/", "/account", "/checkout", "/cart", "/order-confirmation"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/admin", "/admin/", "/account", "/checkout", "/cart", "/order-confirmation"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
