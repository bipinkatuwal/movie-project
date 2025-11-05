"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "@/components/star-rating";
import { fetchMovie, fetchReviews, createReview } from "@/lib/client";
import { Movie, Review } from "@/lib/types";
import { toast } from "sonner";
import { ArrowLeft, User } from "lucide-react";
import { ReviewForm } from "@/components/review-form";
import { ReviewList } from "@/components/review-list";

export default function MovieDetail() {
  const params = useParams();
  const movieId = parseInt(params.id as string, 10);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [movieData, reviewsData] = await Promise.all([
          fetchMovie(movieId),
          fetchReviews(movieId),
        ]);
        setMovie(movieData);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error loading movie:", error);
        toast.error("Failed to load movie");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [movieId]);

  const handleReviewSubmit = async (
    userName: string,
    rating: number,
    reviewText: string
  ) => {
    try {
      setSubmittingReview(true);
      const newReview = await createReview({
        movieId,
        userName,
        rating,
        reviewText,
        createdAt: new Date().toISOString(),
      });
      setReviews([newReview, ...reviews]);
      toast.success("Review submitted successfully");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Skeleton className="h-10 w-32 mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="min-h-screen bg-black py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Button
              variant="ghost"
              className="mb-4 text-gray-200 hover:text-gray-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Movies
            </Button>
          </Link>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">Movie not found</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <Button
            variant="ghost"
            className="mb-8 text-gray-200 hover:bg-white hover:text-black transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Movies
          </Button>
        </Link>

        <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 sm:p-8">
            <div className="md:col-span-1">
              <div className="relative w-full aspect-2/3 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src={movie.posterUrl}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-200 mb-2">
                  {movie.title}
                </h1>
                <div className="flex flex-wrap items-center gap-8 mb-4">
                  <span className="text-gray-500 text-lg">{movie.year}</span>
                  <div className="flex items-center gap-2">
                    <StarRating
                      rating={Math.round(movie.rating / 2)}
                      size="md"
                      gap={1}
                    />
                    <span className="text-2xl font-bold text-gray-200">
                      {movie.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-200">Director</h3>
                <p className="text-gray-500">{movie.director}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-200">Runtime</h3>
                <p className="text-gray-500">{movie.runtime} minutes</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-600">Genre</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genre.map((g) => (
                    <Badge
                      key={g}
                      className="bg-gray-700 text-gray-400 hover:bg-gray-600"
                    >
                      {g}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-200">Cast</h3>
                <p className="text-gray-500">{movie.cast.join(", ")}</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-400">
                  <span className="font-semibold">{movie.reviewCount}</span>{" "}
                  {movie.reviewCount === 1 ? "review" : "reviews"} • Average
                  rating:{" "}
                  <span className="font-semibold">
                    {movie.averageReviewRating.toFixed(1)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 px-6 sm:px-8 py-6 sm:py-8">
            <h2 className="text-2xl font-bold text-gray-200 mb-4">Synopsis</h2>
            <p className="text-gray-500 leading-relaxed">{movie.synopsis}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-200 mb-6">Reviews</h2>

              {reviews.length > 0 ? (
                <ReviewList reviews={reviews} />
              ) : (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                  <p className="text-gray-600">
                    No reviews yet. Be the first to review!
                  </p>
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-200">
                Add Your Review
              </h3>
              <ReviewForm
                onSubmit={handleReviewSubmit}
                isSubmitting={submittingReview}
              />
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
