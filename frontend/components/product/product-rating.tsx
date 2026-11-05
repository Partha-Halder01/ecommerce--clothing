import { Star } from "lucide-react"

interface ProductRatingProps {
  average?: number
  count?: number
  className?: string
}

// Shows the real rating from approved reviews. Products with no reviews show no
// stars; the empty line keeps product cards the same height.
export function ProductRating({ average = 0, count = 0, className = "" }: ProductRatingProps) {
  if (count <= 0) return <div className={`h-3 ${className}`} aria-hidden="true" />

  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`} aria-label={`Rated ${average.toFixed(1)} out of 5 from ${count} ${count === 1 ? "review" : "reviews"}`}>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.floor(average)
          const half = !filled && star === Math.ceil(average) && average % 1 >= 0.3
          return (
            <Star
              key={star}
              className={`w-3 h-3 ${filled ? "fill-[#D8B4A0] text-[#D8B4A0]" : half ? "fill-[#D8B4A0]/50 text-[#D8B4A0]" : "fill-transparent text-[#D8B4A0]/40"}`}
            />
          )
        })}
      </div>
      <span className="text-[10px] text-[#6B635E] tracking-wider" style={{ fontFamily: "var(--font-body)" }}>
        {average.toFixed(1)} ({count})
      </span>
    </div>
  )
}
