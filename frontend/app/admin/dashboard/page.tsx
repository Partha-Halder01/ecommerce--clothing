"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Package, ShoppingCart, Users, IndianRupee, TrendingUp, TrendingDown, ArrowUpRight, Clock, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { dashboardAPI, getCurrentUser, authAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

const COLORS = {
  accent: "#D8B4A0",
  dark: "#1C1615",
  light: "#FCFBF8",
  success: "#10B981",
  danger: "#EF4444",
}

export default function AdminDashboard() {
  const router = useRouter()
  const { toast } = useToast()

  const [stats, setStats] = useState({
    total_revenue: 0,
    total_orders: 0,
    total_products: 0,
    total_customers: 0,
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [weeklyData, setWeeklyData] = useState<{ name: string, revenue: number, orders: number }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState<"revenue" | "orders">("revenue")

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || !user.is_admin) {
      router.push("/login")
      return
    }

    const fetchStats = async () => {
      try {
        const data = await dashboardAPI.getStats()
        setStats({
          total_revenue: Number(data.total_revenue) || 0,
          total_orders: Number(data.total_orders) || 0,
          total_products: Number(data.total_products) || 0,
          total_customers: Number(data.total_customers) || 0,
        })
        setRecentOrders(data.recent_orders || [])

        const weekly = await dashboardAPI.getWeeklyStats()
        setWeeklyData(weekly || [])
      } catch (error: any) {
        if (error.message.includes("401") || error.message.includes("403")) {
          authAPI.logout()
          router.push("/login")
        } else {
          toast({
            title: "Error",
            description: "Failed to load dashboard data",
            variant: "destructive",
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [router, toast])

  const { chartData, isUpTrend } = useMemo(() => {
    const data = weeklyData.map(day => ({
      name: day.name,
      value: selectedMetric === "revenue" ? day.revenue : day.orders
    }))
    const isUp = data.length > 1 && data[data.length - 1].value >= data[0].value
    return { chartData: data, isUpTrend: isUp }
  }, [weeklyData, selectedMetric])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1C1615] p-4 shadow-2xl border border-[#D8B4A0]/20 min-w-[160px]">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#D8B4A0] mb-1">{label}</p>
          <p className="text-lg font-medium text-[#FCFBF8]" style={{ fontFamily: "var(--font-body)" }}>
            {selectedMetric === 'revenue' ? '₹' : ''}
            {payload[0].value.toLocaleString('en-IN')}
          </p>
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-10 h-10 border-2 border-[#D8B4A0] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-[1px] w-8 bg-[#D8B4A0]"></div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#D8B4A0] font-semibold">Overview</p>
          </div>
          <h1 className="text-3xl md:text-4xl font-light text-[#1C1615] uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>
            Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-4 bg-white p-1.5 border border-[#D8B4A0]/20 shadow-sm">
          <button 
            onClick={() => setSelectedMetric("revenue")}
            className={`px-6 py-2 text-[10px] uppercase tracking-[0.2em] transition-all ${selectedMetric === 'revenue' ? 'bg-[#1C1615] text-[#FCFBF8]' : 'text-[#6B635E] hover:bg-[#F4F1EB]'}`}
          >
            Revenue
          </button>
          <button 
            onClick={() => setSelectedMetric("orders")}
            className={`px-6 py-2 text-[10px] uppercase tracking-[0.2em] transition-all ${selectedMetric === 'orders' ? 'bg-[#1C1615] text-[#FCFBF8]' : 'text-[#6B635E] hover:bg-[#F4F1EB]'}`}
          >
            Orders
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: `₹${stats.total_revenue.toLocaleString('en-IN')}`, icon: IndianRupee, trend: "+12.5%", color: "text-emerald-600" },
          { label: "Total Orders", value: stats.total_orders, icon: ShoppingCart, trend: "+8.2%", color: "text-blue-600" },
          { label: "Active Products", value: stats.total_products, icon: Package, trend: "0%", color: "text-amber-600" },
          { label: "Total Customers", value: stats.total_customers, icon: Users, trend: "+5.4%", color: "text-purple-600" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="rounded-none border-[#D8B4A0]/20 hover:border-[#D8B4A0]/50 transition-all duration-500 hover:shadow-[0_10px_30px_rgba(216,180,160,0.1)] group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-[#F4F1EB] group-hover:bg-[#1C1615] transition-colors duration-500">
                    <stat.icon className="w-5 h-5 text-[#1C1615] group-hover:text-[#D8B4A0] transition-colors duration-500" />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </div>
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B635E] mb-1">{stat.label}</p>
                <p className="text-2xl font-medium text-[#1C1615]" style={{ fontFamily: "var(--font-body)" }}>{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Chart */}
        <Card className="lg:col-span-2 rounded-none border-[#D8B4A0]/20 shadow-sm">
          <CardHeader className="border-b border-[#D8B4A0]/10 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-light uppercase tracking-widest text-[#1C1615]" style={{ fontFamily: "var(--font-playfair)" }}>
                Performance Analysis
              </CardTitle>
              <div className="flex items-center gap-2 text-[10px] text-[#6B635E] uppercase tracking-widest">
                <Clock className="w-3 h-3" />
                Last 7 Days
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D8B4A0" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#D8B4A0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E3DC" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B635E', fontSize: 10, letterSpacing: '0.1em' }} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B635E', fontSize: 10 }} 
                    tickFormatter={(val) => selectedMetric === 'revenue' ? `₹${val >= 1000 ? (val/1000).toFixed(1) + 'k' : val}` : val}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#1C1615" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Recent Activity */}
        <div className="space-y-8">
          <Card className="rounded-none border-[#D8B4A0]/20 bg-[#1C1615] text-[#FCFBF8] shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D8B4A0]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <CardHeader>
              <CardTitle className="text-sm font-light uppercase tracking-widest text-[#D8B4A0]" style={{ fontFamily: "var(--font-playfair)" }}>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <button 
                onClick={() => router.push("/admin/products")}
                className="w-full flex items-center justify-between p-4 border border-[#D8B4A0]/20 hover:bg-[#D8B4A0] hover:text-[#1C1615] transition-all duration-300 group"
              >
                <span className="text-[10px] uppercase tracking-[0.2em]">Add New Product</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
              <button 
                onClick={() => router.push("/admin/orders")}
                className="w-full flex items-center justify-between p-4 border border-[#D8B4A0]/20 hover:bg-[#D8B4A0] hover:text-[#1C1615] transition-all duration-300 group"
              >
                <span className="text-[10px] uppercase tracking-[0.2em]">Manage Orders</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
              <button 
                onClick={() => router.push("/admin/settings")}
                className="w-full flex items-center justify-between p-4 border border-[#D8B4A0]/20 hover:bg-[#D8B4A0] hover:text-[#1C1615] transition-all duration-300 group"
              >
                <span className="text-[10px] uppercase tracking-[0.2em]">Store Settings</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </CardContent>
          </Card>

          <Card className="rounded-none border-[#D8B4A0]/20 shadow-sm">
            <CardHeader className="border-b border-[#D8B4A0]/10 pb-4">
              <CardTitle className="text-sm font-light uppercase tracking-widest text-[#1C1615]" style={{ fontFamily: "var(--font-playfair)" }}>System Health</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#6B635E]">API Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#6B635E]">Database</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Connected</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Orders Table */}
      <Card className="rounded-none border-[#D8B4A0]/20 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-[#D8B4A0]/10 p-6 flex flex-row items-center justify-between bg-[#F4F1EB]/30">
          <CardTitle className="text-sm font-light uppercase tracking-widest text-[#1C1615]" style={{ fontFamily: "var(--font-playfair)" }}>Recent Orders</CardTitle>
          <button 
            onClick={() => router.push("/admin/orders")}
            className="text-[10px] uppercase tracking-[0.2em] text-[#D8B4A0] hover:text-[#1C1615] transition-colors"
          >
            View All
          </button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FCFBF8] border-b border-[#D8B4A0]/10">
                  <th className="text-left py-4 px-6 text-[10px] font-bold text-[#6B635E] uppercase tracking-[0.2em]">Order</th>
                  <th className="text-left py-4 px-6 text-[10px] font-bold text-[#6B635E] uppercase tracking-[0.2em]">Customer</th>
                  <th className="text-left py-4 px-6 text-[10px] font-bold text-[#6B635E] uppercase tracking-[0.2em]">Amount</th>
                  <th className="text-left py-4 px-6 text-[10px] font-bold text-[#6B635E] uppercase tracking-[0.2em]">Status</th>
                  <th className="text-right py-4 px-6 text-[10px] font-bold text-[#6B635E] uppercase tracking-[0.2em]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8B4A0]/10">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#6B635E] text-xs uppercase tracking-widest">No recent orders found</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#F4F1EB]/30 transition-colors group">
                      <td className="py-4 px-6">
                        <span className="text-xs font-medium text-[#1C1615]" style={{ fontFamily: "var(--font-body)" }}>#{order.id}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-[#1C1615]">{order.customer}</span>
                          <span className="text-[10px] text-[#6B635E] lowercase">{order.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs font-medium text-[#1C1615]" style={{ fontFamily: "var(--font-body)" }}>₹{order.total.toLocaleString('en-IN')}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest ${
                          order.status === "Delivered" ? "bg-emerald-50 text-emerald-700" :
                          order.status === "Shipped" ? "bg-blue-50 text-blue-700" :
                          "bg-amber-50 text-amber-700"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-[10px] uppercase tracking-[0.2em] text-[#D8B4A0] hover:text-[#1C1615] opacity-0 group-hover:opacity-100 transition-all">Details</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
