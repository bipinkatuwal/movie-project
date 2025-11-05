"use client";

import { Review } from "@/lib/types";
import { StarRating } from "./star-rating";
import { formatDistanceToNow } from "date-fns";

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold text-foreground">
                {review.userName}
              </h4>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(review.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <StarRating rating={review.rating} size="sm" />
          </div>
          <p className="text-muted-foreground mt-3">{review.reviewText}</p>
        </div>
      ))}
    </div>
  );
}
