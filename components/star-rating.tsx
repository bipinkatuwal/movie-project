"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
  gap?: number;
}

export function StarRating({
  rating,
  onRate,
  interactive = false,
  size = "md",
  gap = 3,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-1 h-1",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const sizeProp = {
    sm: 14,
    md: 18,
    lg: 20,
  };

  const gapClasses: Record<number, string> = {
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
  };

  return (
    <div className={`flex ${gapClasses[gap] || "gap-2"}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onRate?.(star)}
          disabled={!interactive}
          className={`${sizeClasses[size]} transition-colors h-full ${
            star <= rating ? "text-amber-400" : "text-gray-300"
          } ${
            interactive
              ? "cursor-pointer hover:text-amber-300"
              : "cursor-default"
          }`}
          type="button"
        >
          <Star size={sizeProp[size]} fill="currentColor" />
        </button>
      ))}
    </div>
  );
}
