"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StarRating({
  rating,
  onRate,
  interactive = false,
  size = "md",
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onRate?.(star)}
          disabled={!interactive}
          className={`${sizeClasses[size]} transition-colors ${
            star <= rating ? "text-amber-400" : "text-gray-300"
          } ${
            interactive
              ? "cursor-pointer hover:text-amber-300"
              : "cursor-default"
          }`}
          type="button"
        >
          <Star fill="currentColor" />
        </button>
      ))}
    </div>
  );
}
