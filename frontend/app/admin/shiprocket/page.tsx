"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Rocket, X } from "lucide-react"
import { shiprocketAPI, getCurrentUser } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ShiprocketAdminPage() {
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)
  const [showComingSoon, setShowComingSoon] = useState(true)

  useEffect(() => {
    const u = getCurrentUser()
    if (!u || !u.is_admin) {
      router.push("/login")
    } else {
      setAllowed(true)
    }
  }, [router])

  const [pickupPin, setPickupPin] = useState("")
  const [deliveryPin, setDeliveryPin] = useState("")
  const [weight, setWeight] = useState("0.5")
  const [serviceability, setServiceability] = useState<any>(null)
  const [awb, setAwb] = useState("")
  const [trackData, setTrackData] = useState<any>(null)
  const [srOrderId, setSrOrderId] = useState("")
  const [createPayload, setCreatePayload] = useState<any>({
    order_id: "",
    order_date: new Date().toISOString().slice(0, 10),
    pickup_location: "",
    billing_customer_name: "",
    billing_address: "",
    billing_city: "",
    billing_pincode: "",
    billing_state: "",
    billing_country: "India",
    billing_email: "",
    billing_phone: "",
    shipping_is_billing: true,
    order_items: [],
    payment_method: "COD",
    sub_total: 0,
    length: 10,
    breadth: 10,
    height: 10,
    weight: 0.5,
  })

  if (!allowed) return null

  return (
    <div className="relative">
      {/* Coming Soon overlay */}
      {showComingSoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#1C1615]/60 backdrop-blur-sm"
            onClick={() => setShowComingSoon(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-white border border-[#E8E3DC] shadow-2xl p-8 sm:p-10 text-center">
            <button
              onClick={() => setShowComingSoon(false)}
              className="absolute top-4 right-4 text-[#6B635E] hover:text-[#1C1615] transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="w-16 h-16 mx-auto mb-6 bg-[#F4F1EB] border border-[#E8E3DC] rounded-full flex items-center justify-center">
              <Rocket className="h-7 w-7 text-[#D8B4A0]" />
            </div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#D8B4A0] mb-3 font-semibold" style={{ fontFamily: "var(--font-body)" }}>
              In You · Logistics
            </p>
            <h2 className="text-2xl sm:text-3xl font-light text-[#1C1615] uppercase tracking-wide mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
              Coming Soon
            </h2>
            <p className="text-[#6B635E] leading-relaxed tracking-wide mb-8" style={{ fontFamily: "var(--font-body)" }}>
              The Shiprocket integration is being polished and will be available shortly. Thank you for your patience.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/admin/dashboard"
                className="px-6 py-3 bg-[#1C1615] text-[#FCFBF8] text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#D8B4A0] hover:text-[#1C1615] transition-all duration-300"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Back to Dashboard
              </Link>
              <button
                onClick={() => setShowComingSoon(false)}
                className="px-6 py-3 border border-[#E8E3DC] text-[#1C1615] text-[11px] font-bold tracking-[0.2em] uppercase hover:border-[#D8B4A0] transition-all duration-300"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Preview Page
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`p-6 lg:p-8 space-y-8 ${showComingSoon ? "blur-sm pointer-events-none select-none" : ""}`}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-light text-[#1C1615] uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>Shiprocket</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Serviceability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Pickup PIN" value={pickupPin} onChange={(e) => setPickupPin(e.target.value)} />
              <Input placeholder="Delivery PIN" value={deliveryPin} onChange={(e) => setDeliveryPin(e.target.value)} />
            </div>
            <Input placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} />
            <Button onClick={async () => {
              const d = await shiprocketAPI.serviceability(pickupPin, deliveryPin, parseFloat(weight || "0.5"), 0)
              setServiceability(d)
            }}>Check</Button>
            {serviceability && (
              <pre className="text-xs bg-[#FCFBF8] p-3 border overflow-auto max-h-56">{JSON.stringify(serviceability, null, 2)}</pre>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Track Shipment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="AWB" value={awb} onChange={(e) => setAwb(e.target.value)} />
            <Button onClick={async () => {
              const d = await shiprocketAPI.track(awb)
              setTrackData(d)
            }}>Track</Button>
            {trackData && (
              <pre className="text-xs bg-[#FCFBF8] p-3 border overflow-auto max-h-56">{JSON.stringify(trackData, null, 2)}</pre>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="SR order_id" value={createPayload.order_id} onChange={(e) => setCreatePayload({ ...createPayload, order_id: e.target.value })} />
            <Input placeholder="Pickup Location" value={createPayload.pickup_location} onChange={(e) => setCreatePayload({ ...createPayload, pickup_location: e.target.value })} />
            <Input placeholder="Customer Name" value={createPayload.billing_customer_name} onChange={(e) => setCreatePayload({ ...createPayload, billing_customer_name: e.target.value })} />
            <Input placeholder="Address" value={createPayload.billing_address} onChange={(e) => setCreatePayload({ ...createPayload, billing_address: e.target.value })} />
            <div className="grid grid-cols-3 gap-2">
              <Input placeholder="City" value={createPayload.billing_city} onChange={(e) => setCreatePayload({ ...createPayload, billing_city: e.target.value })} />
              <Input placeholder="State" value={createPayload.billing_state} onChange={(e) => setCreatePayload({ ...createPayload, billing_state: e.target.value })} />
              <Input placeholder="Pincode" value={createPayload.billing_pincode} onChange={(e) => setCreatePayload({ ...createPayload, billing_pincode: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Email" value={createPayload.billing_email} onChange={(e) => setCreatePayload({ ...createPayload, billing_email: e.target.value })} />
              <Input placeholder="Phone" value={createPayload.billing_phone} onChange={(e) => setCreatePayload({ ...createPayload, billing_phone: e.target.value })} />
            </div>
            <Button onClick={async () => {
              const d = await shiprocketAPI.createOrder(createPayload)
              alert("Created: " + JSON.stringify(d))
            }}>Create</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cancel Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Shiprocket Order ID" value={srOrderId} onChange={(e) => setSrOrderId(e.target.value)} />
          <Button onClick={async () => {
            const d = await shiprocketAPI.cancelOrder(parseInt(srOrderId || "0"))
            alert("Canceled: " + JSON.stringify(d))
          }}>Cancel</Button>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
