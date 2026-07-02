const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

class APIError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(`${status}: ${message}`)
    this.status = status
    this.name = "APIError"
  }
}

export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  is_admin: boolean
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface Product {
  id: number
  name: string
  slug: string
  description?: string
  category: string
  price: number
  original_price?: number
  stock: number
  status: string
  image_url?: string
  colors?: { name: string; value: string }[]
  sizes?: string[]
  gallery_images?: string[]
  video_url?: string
  is_featured?: boolean
  theme?: string
  created_at: string
}

export interface Order {
  id: number
  customer_id: number
  customer_name: string
  customer_email: string
  total: number
  status: string
  items: any[]
  payment_method?: string
  shipping_address?: string
  created_at: string
}

export interface DashboardStats {
  total_revenue: number
  total_orders: number
  total_products: number
  total_customers: number
  recent_orders: Array<{
    id: number
    customer: string
    email: string
    total: number
    status: string
  }>
}

export interface Customer {
  id: number
  first_name: string
  last_name: string
  email: string
  created_at: string
  total_orders: number
  total_spent: number
}

// Get auth token from localStorage
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  const token = localStorage.getItem("token")
  if (!token) return null

  try {
    const payloadPart = token.split(".")[1]
    if (!payloadPart) {
      removeAuthToken()
      removeCurrentUser()
      return null
    }
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/")
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4)
    const payload = JSON.parse(atob(padded))
    if (payload?.exp && Date.now() >= payload.exp * 1000) {
      removeAuthToken()
      removeCurrentUser()
      return null
    }
  } catch {
    removeAuthToken()
    removeCurrentUser()
    return null
  }

  return token
}

// Set auth token in localStorage
export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem("token", token)
}

// Remove auth token from localStorage
export function removeAuthToken(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("token")
}

// Get current user from localStorage
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  if (!getAuthToken()) return null
  const userStr = localStorage.getItem("user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    removeCurrentUser()
    return null
  }
}

// Set current user in localStorage
export function setCurrentUser(user: User): void {
  if (typeof window === "undefined") return
  localStorage.setItem("user", JSON.stringify(user))
}

// Remove current user from localStorage
export function removeCurrentUser(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("user")
}

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "An error occurred" }))
    throw new APIError(response.status, error.detail || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Authentication API
export const authAPI = {
  register: async (data: {
    first_name: string
    last_name: string
    email: string
    password: string
  }): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
    setAuthToken(response.access_token)
    setCurrentUser(response.user)
    return response
  },

  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
    setAuthToken(response.access_token)
    setCurrentUser(response.user)
    return response
  },

  getCurrentUser: async (): Promise<User> => {
    return apiRequest<User>("/api/auth/me")
  },

  logout: (): void => {
    removeAuthToken()
    removeCurrentUser()
  },
}

// Admin Products API
export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    return apiRequest<Product[]>("/api/admin/products")
  },

  create: async (data: {
    name: string
    description?: string
    category: string
    price: number
    stock: number
    image_url?: string
    colors?: { name: string; value: string }[]
    sizes?: string[]
    gallery_images?: string[]
    video_url?: string
    theme?: string
  }): Promise<Product> => {
    return apiRequest<Product>("/api/admin/products", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  update: async (id: number, data: Partial<Product>): Promise<Product> => {
    return apiRequest<Product>(`/api/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  delete: async (id: number): Promise<void> => {
    return apiRequest<void>(`/api/admin/products/${id}`, {
      method: "DELETE",
    })
  },
}

// Admin Orders API
export const ordersAPI = {
  getAll: async (): Promise<Order[]> => {
    return apiRequest<Order[]>("/api/admin/orders")
  },

  update: async (id: number, data: { status: string }): Promise<Order> => {
    return apiRequest<Order>(`/api/admin/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },
}

// Admin Dashboard API
export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    return apiRequest<DashboardStats>("/api/admin/dashboard")
  },
  getWeeklyStats: async (): Promise<{ name: string, revenue: number, orders: number }[]> => {
    return apiRequest<{ name: string, revenue: number, orders: number }[]>("/api/admin/dashboard/weekly")
  },
}

// Admin Customers API
export const customersAPI = {
  getAll: async (): Promise<Customer[]> => {
    return apiRequest<Customer[]>("/api/admin/customers")
  },
}

// Public Products API
export const publicProductsAPI = {
  getAll: async (): Promise<Product[]> => {
    return apiRequest<Product[]>("/api/products")
  },

  getById: async (id: number): Promise<Product> => {
    return apiRequest<Product>(`/api/products/${id}`)
  },

  getBySlug: async (slug: string): Promise<Product> => {
    return apiRequest<Product>(`/api/products/slug/${slug}`)
  },
}

// Public Orders API
export const publicOrdersAPI = {
  create: async (data: {
    customer_id: number
    items: any[]
    total: number
    shipping_address: string
    payment_method: string
  }): Promise<Order> => {
    return apiRequest<Order>("/api/orders", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
}

// User Orders API
export const userOrdersAPI = {
  getAll: async (): Promise<Order[]> => {
    return apiRequest<Order[]>("/api/user/orders")
  },

  getById: async (id: number): Promise<Order> => {
    return apiRequest<Order>(`/api/user/orders/${id}`)
  },
}

// Category interface
export interface Category {
  id: number
  name: string
  slug?: string
  description?: string
  parent_id?: number | null
  parent_name?: string
  is_active: boolean
  subcategories?: Category[]
  created_at: string
}

// Categories API
export const categoriesAPI = {
  getAll: async (): Promise<Category[]> => {
    return apiRequest<Category[]>("/api/categories")
  },

  getGrouped: async (): Promise<Category[]> => {
    return apiRequest<Category[]>("/api/categories/grouped")
  },

  adminGetAll: async (): Promise<Category[]> => {
    return apiRequest<Category[]>("/api/admin/categories")
  },

  create: async (data: { name: string; description?: string; parent_id?: number | null }): Promise<Category> => {
    return apiRequest<Category>("/api/admin/categories", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  update: async (id: number, data: Partial<Category>): Promise<void> => {
    return apiRequest<void>(`/api/admin/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  delete: async (id: number): Promise<void> => {
    return apiRequest<void>(`/api/admin/categories/${id}`, {
      method: "DELETE",
    })
  },
}

// Sale Banner Settings
export interface SaleBannerSettings {
  enabled: boolean
  text: string
  end_date: string
}

export interface HeroSlide {
  title: string
  subtitle: string
  description: string
  image: string
  cta: string
  href: string
}

export interface HeroSettings {
  slides: HeroSlide[]
  recommended_size: string
}

export interface ScrollingTextSettings {
  enabled: boolean
  text: string
}

export const settingsAPI = {
  getSaleBanner: async (): Promise<SaleBannerSettings> => {
    return apiRequest<SaleBannerSettings>("/api/settings/sale-banner")
  },

  updateSaleBanner: async (data: SaleBannerSettings): Promise<void> => {
    return apiRequest<void>("/api/admin/settings/sale-banner", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  getHero: async (): Promise<HeroSettings> => {
    return apiRequest<HeroSettings>("/api/settings/hero")
  },

  updateHero: async (data: HeroSettings): Promise<void> => {
    return apiRequest<void>("/api/admin/settings/hero", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  getScrollingText: async (): Promise<ScrollingTextSettings> => {
    return apiRequest<ScrollingTextSettings>("/api/settings/scrolling-text")
  },

  updateScrollingText: async (data: ScrollingTextSettings): Promise<void> => {
    return apiRequest<void>("/api/admin/settings/scrolling-text", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  // Our Story
  getOurStory: async (): Promise<{ enabled: boolean; title: string; description: string; video_url: string }> => {
    return apiRequest("/api/settings/our-story")
  },

  updateOurStory: async (data: { enabled: boolean; title: string; description: string; video_url: string }): Promise<void> => {
    return apiRequest<void>("/api/admin/settings/our-story", { method: "PUT", body: JSON.stringify(data) })
  },

  // Testimonials
  getTestimonials: async (): Promise<{ enabled: boolean; title: string; videos: { name: string; video_url: string; thumbnail?: string }[] }> => {
    return apiRequest("/api/settings/testimonials")
  },

  updateTestimonials: async (data: { enabled: boolean; title: string; videos: { name: string; video_url: string; thumbnail?: string }[] }): Promise<void> => {
    return apiRequest<void>("/api/admin/settings/testimonials", { method: "PUT", body: JSON.stringify(data) })
  },

  // Shop The Look
  getShopTheLook: async (): Promise<{ enabled: boolean; title: string; product_ids: number[] }> => {
    return apiRequest("/api/settings/shop-the-look")
  },

  updateShopTheLook: async (data: { enabled: boolean; title: string; product_ids: number[] }): Promise<void> => {
    return apiRequest<void>("/api/admin/settings/shop-the-look", { method: "PUT", body: JSON.stringify(data) })
  },
}

// Featured Products API
export const featuredProductsAPI = {
  getAll: async (): Promise<Product[]> => {
    return apiRequest<Product[]>("/api/featured-products")
  },

  setFeatured: async (productId: number, isFeatured: boolean): Promise<void> => {
    return apiRequest<void>(`/api/admin/products/${productId}/featured`, {
      method: "PUT",
      body: JSON.stringify({ is_featured: isFeatured }),
    })
  },
}

export const shiprocketAPI = {
  serviceability: async (pickup_postcode: string, delivery_postcode: string, weight: number, cod = 0): Promise<any> => {
    const url = `/api/admin/shiprocket/serviceability?pickup_postcode=${encodeURIComponent(pickup_postcode)}&delivery_postcode=${encodeURIComponent(delivery_postcode)}&weight=${weight}&cod=${cod}`
    return apiRequest<any>(url)
  },
  estimate: async (pickup_postcode: string, delivery_postcode: string, weight: number): Promise<any> => {
    const url = `/api/admin/shiprocket/estimate?pickup_postcode=${encodeURIComponent(pickup_postcode)}&delivery_postcode=${encodeURIComponent(delivery_postcode)}&weight=${weight}`
    return apiRequest<any>(url)
  },
  track: async (awb: string): Promise<any> => {
    const url = `/api/admin/shiprocket/track?awb=${encodeURIComponent(awb)}`
    return apiRequest<any>(url)
  },
  createOrder: async (payload: any): Promise<any> => {
    return apiRequest<any>("/api/admin/shiprocket/orders/create", { method: "POST", body: JSON.stringify(payload) })
  },
  cancelOrder: async (sr_order_id: number): Promise<any> => {
    return apiRequest<any>("/api/admin/shiprocket/orders/cancel", { method: "POST", body: JSON.stringify({ sr_order_id }) })
  },
}


