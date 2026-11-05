import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

type AppliedCoupon = { id: number; discount: number; code: string }

// Re-checks an applied coupon whenever the order value changes, so a coupon can't
// stay on an order that has moved outside its limits, and the discount stays correct.
export function useCouponRecheck(
  coupon: AppliedCoupon | null,
  subtotal: number,
  setCoupon: (coupon: AppliedCoupon | null) => void
) {
  const { toast } = useToast()

  useEffect(() => {
    if (!coupon || subtotal <= 0) return
    let cancelled = false

    const recheck = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/coupons/validate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: coupon.code, order_total: subtotal }),
        })
        const data = await response.json()
        if (cancelled) return

        if (data.valid === false) {
          setCoupon(null)
          localStorage.removeItem("appliedCoupon")
          toast({ title: "Coupon Removed", description: data.message, variant: "destructive" })
        } else if (response.ok && data.discount !== coupon.discount) {
          const updated = { ...coupon, discount: data.discount }
          setCoupon(updated)
          localStorage.setItem("appliedCoupon", JSON.stringify(updated))
        }
      } catch {
        // Network problem: keep the coupon rather than dropping it without a real answer
      }
    }
    recheck()

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal, coupon?.code])
}
