// Product page theme presets.
// Each product can be assigned a theme in the admin panel; the product page
// is tinted with that palette (accents, buttons, background wash).
// "default" reproduces the site's standard rose-gold look, so products
// without a theme are unchanged.

export interface ProductTheme {
  id: string
  label: string
  /** Swatch shown in the admin picker */
  swatch: string
  /** CSS variables consumed by the product page */
  vars: Record<string, string>
}

const rgba = (hex: string, alpha: number) => {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const buildVars = (accent: string, dark: string, wash: string) => ({
  "--pt-accent": accent,
  "--pt-accent-70": rgba(accent, 0.7),
  "--pt-accent-60": rgba(accent, 0.6),
  "--pt-accent-50": rgba(accent, 0.5),
  "--pt-accent-40": rgba(accent, 0.4),
  "--pt-accent-30": rgba(accent, 0.3),
  "--pt-accent-20": rgba(accent, 0.2),
  "--pt-accent-10": rgba(accent, 0.1),
  "--pt-dark": dark,
  "--pt-wash": wash,
})

export const PRODUCT_THEMES: ProductTheme[] = [
  {
    id: "default",
    label: "Signature (Default)",
    swatch: "#D8B4A0",
    vars: buildVars("#D8B4A0", "#1C1615", "#FCFBF8"),
  },
  {
    id: "amber",
    label: "Amber",
    swatch: "#C9761F",
    vars: buildVars("#B96A1F", "#6E3D0B", "#FBF4EA"),
  },
  {
    id: "terracotta",
    label: "Terracotta",
    swatch: "#B8441F",
    vars: buildVars("#B04A24", "#7C2D12", "#FBF0EA"),
  },
  {
    id: "burgundy",
    label: "Burgundy",
    swatch: "#7A1F35",
    vars: buildVars("#8A2438", "#571423", "#FAEFF1"),
  },
  {
    id: "plum",
    label: "Plum",
    swatch: "#9A3E78",
    vars: buildVars("#9A3E78", "#61224A", "#F9F0F6"),
  },
  {
    id: "violet",
    label: "Violet",
    swatch: "#5C50B5",
    vars: buildVars("#5C50B5", "#37306E", "#F2F0FA"),
  },
  {
    id: "navy",
    label: "Navy",
    swatch: "#22346E",
    vars: buildVars("#2C3F7C", "#182348", "#EFF1F8"),
  },
  {
    id: "emerald",
    label: "Emerald",
    swatch: "#1F6E4E",
    vars: buildVars("#1F6E4E", "#123F2D", "#EDF6F2"),
  },
  {
    id: "gold",
    label: "Gold",
    swatch: "#A98307",
    vars: buildVars("#A98307", "#5F4A04", "#FAF6E9"),
  },
  {
    id: "noir",
    label: "Noir",
    swatch: "#2B2B2B",
    vars: buildVars("#6B6B6B", "#111111", "#F4F3F1"),
  },
]

export function getProductTheme(id?: string | null): ProductTheme {
  return PRODUCT_THEMES.find((t) => t.id === id) || PRODUCT_THEMES[0]
}
