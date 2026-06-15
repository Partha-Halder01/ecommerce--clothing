import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "In You — Luxury Perfumes",
    short_name: "In You",
    description: "Luxury perfumes and signature fragrances crafted for the modern individual.",
    start_url: "/",
    display: "standalone",
    background_color: "#FCFBF8",
    theme_color: "#1C1615",
    icons: [
      {
        src: "/icon.png",
        sizes: "256x256",
        type: "image/png",
      },
    ],
  }
}
