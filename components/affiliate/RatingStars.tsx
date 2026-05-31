import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number; // 0–10
  showNumber?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function RatingStars({
  rating,
  showNumber = true,
  size = "md",
  className,
}: RatingStarsProps) {
  const stars = Math.round((rating / 10) * 5 * 2) / 2; // map 0-10 to 0-5 with 0.5 steps
  const sizeClass = { sm: "w-3 h-3", md: "w-4 h-4", lg: "w-5 h-5" }[size];
  const textClass = { sm: "text-xs", md: "text-sm", lg: "text-base" }[size];

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = stars >= star;
          const half = !filled && stars >= star - 0.5;
          return (
            <svg key={star} className={cn(sizeClass)} viewBox="0 0 20 20" fill="none">
              <defs>
                <linearGradient id={`half-${star}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#d1d5db" />
                </linearGradient>
              </defs>
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                fill={filled ? "#f59e0b" : half ? `url(#half-${star})` : "#d1d5db"}
              />
            </svg>
          );
        })}
      </div>
      {showNumber && (
        <span className={cn("font-semibold text-gray-700", textClass)}>
          {rating.toFixed(1)}<span className="text-gray-400 font-normal">/10</span>
        </span>
      )}
    </div>
  );
}
