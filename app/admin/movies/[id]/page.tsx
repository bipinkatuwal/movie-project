"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MovieForm } from "@/components/movie-form";
import { fetchMovie, updateMovie } from "@/lib/client";
import { Movie } from "@/lib/types";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function EditMovie() {
  const router = useRouter();
  const params = useParams();
  const movieId = parseInt(params.id as string, 10);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        setLoading(true);
        const data = await fetchMovie(movieId);
        setMovie(data);
      } catch (error) {
        console.error("Error loading movie:", error);
        toast.error("Failed to load movie");
        router.push("/admin");
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [movieId, router]);

  const handleSubmit = async (
    data: Omit<Movie, "id" | "reviewCount" | "averageReviewRating">
  ) => {
    try {
      setIsSubmitting(true);
      await updateMovie(movieId, data);
      toast.success("Movie updated successfully");
      router.push("/admin");
    } catch (error) {
      console.error("Error updating movie:", error);
      toast.error("Failed to update movie");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/admin">
          <Button
            variant="ghost"
            className="mb-6 text-gray-200 hover:bg-white hover:text-black transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
        </Link>

        {loading ? (
          <Card className="p-6 sm:p-8">
            <Skeleton className="h-12 w-full mb-6" />
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </Card>
        ) : movie ? (
          <Card className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-200 mb-6">
              Edit Movie
            </h1>
            <MovieForm
              initialData={movie}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </Card>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-600">Movie not found</p>
          </Card>
        )}
      </div>
    </main>
  );
}
