"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Mail, Calendar, ShoppingBag, CreditCard, RefreshCw, Users, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCurrentUser, getAuthToken } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface Customer {
  id: number
  first_name: string
  last_name: string
  email: string
  phone?: string
  created_at: string
  total_orders: number
  total_spent: number
}

export default function AdminCustomers() {
  const router = useRouter()
  const { toast } = useToast()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user?.is_admin) { router.push("/login"); return }
    fetchCustomers()
  }, [router])

  const fetchCustomers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/admin/customers`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      })
      if (!response.ok) throw new Error('Failed to load customers')
      const data = await response.json()
      setCustomers(data)
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
  }

  const filteredCustomers = customers.filter(c =>
    `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalSpent = customers.reduce((sum, c) => sum + (parseFloat(String(c.total_spent)) || 0), 0)
  const totalOrders = customers.reduce((sum, c) => sum + (parseInt(String(c.total_orders)) || 0), 0)

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light text-[#1C1615] uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>Customers</h1>
            <p className="text-[#6B635E] text-sm tracking-wide" style={{ fontFamily: "var(--font-body)" }}>View and manage your customer base</p>
          </div>
          <Button onClick={fetchCustomers} variant="outline" size="sm" className="rounded-none border-[#D8B4A0] text-[#1C1615] hover:bg-[#1C1615] hover:text-[#FCFBF8] uppercase tracking-widest text-xs">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-none p-4 border border-[#D8B4A0]/30">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#D8B4A0]" />
              <p className="text-xs text-[#6B635E] uppercase tracking-widest" style={{ fontFamily: "var(--font-body)" }}>Total Customers</p>
            </div>
            <p className="text-2xl font-light mt-1 text-[#1C1615]" style={{ fontFamily: "var(--font-playfair)" }}>{customers.length}</p>
          </div>
          <div className="bg-white rounded-none p-4 border border-[#D8B4A0]/30">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D8B4A0]" />
              <p className="text-xs text-[#6B635E] uppercase tracking-widest" style={{ fontFamily: "var(--font-body)" }}>Total Orders</p>
            </div>
            <p className="text-2xl font-light mt-1 text-[#1C1615]" style={{ fontFamily: "var(--font-playfair)" }}>{totalOrders}</p>
          </div>
          <div className="bg-white rounded-none p-4 border border-[#D8B4A0]/30">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#D8B4A0]" />
              <p className="text-xs text-[#6B635E] uppercase tracking-widest" style={{ fontFamily: "var(--font-body)" }}>Total Revenue</p>
            </div>
            <p className="text-2xl font-light mt-1 text-[#1C1615]" style={{ fontFamily: "var(--font-playfair)" }}>₹{totalSpent.toFixed(2)}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B635E]" />
            <Input placeholder="Search customers..." className="pl-10 rounded-none border-[#D8B4A0]/30"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-none border border-[#D8B4A0]/30 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-[#6B635E]">Loading customers...</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-8 text-center text-[#6B635E]">No customers found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F4F1EB] border-b border-[#D8B4A0]/20">
                  <tr>
                    <th className="text-left p-4 text-xs font-semibold text-[#6B635E] uppercase tracking-widest" style={{ fontFamily: "var(--font-body)" }}>Customer</th>
                    <th className="text-left p-4 text-xs font-semibold text-[#6B635E] uppercase tracking-widest" style={{ fontFamily: "var(--font-body)" }}>Email</th>
                    <th className="text-left p-4 text-xs font-semibold text-[#6B635E] uppercase tracking-widest" style={{ fontFamily: "var(--font-body)" }}>Phone</th>
                    <th className="text-left p-4 text-xs font-semibold text-[#6B635E] uppercase tracking-widest" style={{ fontFamily: "var(--font-body)" }}>Joined</th>
                    <th className="text-left p-4 text-xs font-semibold text-[#6B635E] uppercase tracking-widest" style={{ fontFamily: "var(--font-body)" }}>Orders</th>
                    <th className="text-left p-4 text-xs font-semibold text-[#6B635E] uppercase tracking-widest" style={{ fontFamily: "var(--font-body)" }}>Total Spent</th>
                    <th className="text-left p-4 text-xs font-semibold text-[#6B635E] uppercase tracking-widest" style={{ fontFamily: "var(--font-body)" }}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8B4A0]/10">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-[#F4F1EB]/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-none bg-[#1C1615] flex items-center justify-center text-[#D8B4A0] font-light text-sm" style={{ fontFamily: "var(--font-playfair)" }}>
                            {customer.first_name?.charAt(0)}{customer.last_name?.charAt(0)}
                          </div>
                          <span className="font-medium text-[#1C1615]" style={{ fontFamily: "var(--font-body)" }}>{customer.first_name} {customer.last_name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-[#6B635E]">
                          <Mail className="w-4 h-4" />
                          {customer.email}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-[#6B635E]">
                          {customer.phone || "-"}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-[#6B635E]">
                          <Calendar className="w-4 h-4" />
                          {formatDate(customer.created_at)}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-none text-xs font-medium bg-[#1C1615]/5 text-[#1C1615]">
                          <ShoppingBag className="w-3 h-3" /> {customer.total_orders || 0}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-[#1C1615]">
                        ₹{(parseFloat(String(customer.total_spent)) || 0).toFixed(2)}
                      </td>
                      <td className="p-4">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/admin/customers/${customer.id}`)}
                          className="rounded-none border-[#D8B4A0] text-[#1C1615] hover:bg-[#1C1615] hover:text-[#FCFBF8] uppercase tracking-widest text-xs">
                          <Eye className="w-4 h-4 mr-1" /> View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
