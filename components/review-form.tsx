"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "./star-rating";

interface ReviewFormProps {
  onSubmit: (
    userName: string,
    rating: number,
    reviewText: string,
  ) => Promise<void>;
  isSubmitting: boolean;
}

export function ReviewForm({ onSubmit, isSubmitting }: ReviewFormProps) {
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!userName.trim()) {
      newErrors.userName = "Name is required";
    }

    if (!reviewText.trim()) {
      newErrors.reviewText = "Review text is required";
    } else if (reviewText.trim().length < 10) {
      newErrors.reviewText = "Review must be at least 10 characters";
    }

    if (!rating || rating < 1 || rating > 5) {
      newErrors.rating = "Please select a rating";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await onSubmit(userName, rating, reviewText);
      setUserName("");
      setRating(5);
      setReviewText("");
      setErrors({});
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="userName" className="text-sm font-medium  mb-1 block">
          Your Name
        </Label>
        <Input
          id="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
          disabled={isSubmitting}
          className={`${
            errors.userName ? "border-red-500" : "border-gray-600"
          } text-muted-foreground`}
        />
        {errors.userName && (
          <p className="text-sm text-red-600 mt-1">{errors.userName}</p>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium  mb-2 block">Rating</Label>
        <StarRating
          rating={rating}
          onRate={setRating}
          interactive
          size="lg"
          gap={1}
        />
        {errors.rating && (
          <p className="text-sm text-red-600 mt-1">{errors.rating}</p>
        )}
      </div>

      <div>
        <Label htmlFor="reviewText" className="text-sm font-medium mb-1 block">
          Your Review
        </Label>
        <Textarea
          id="reviewText"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your thoughts about this movie..."
          rows={4}
          disabled={isSubmitting}
          className={`${
            errors.reviewText ? "border-red-500" : "border-gray-600"
          } text-gray-200`}
        />
        {errors.reviewText && (
          <p className="text-sm text-red-600 mt-1">{errors.reviewText}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
