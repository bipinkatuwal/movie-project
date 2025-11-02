"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MovieForm } from "@/components/movie-form";
import { createMovie } from "@/lib/client";
import { Movie } from "@/lib/types";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function NewMovie() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    data: Omit<Movie, "id" | "reviewCount" | "averageReviewRating">
  ) => {
    try {
      setIsSubmitting(true);
      await createMovie(data);
      toast.success("Movie created successfully");
      router.push("/admin");
    } catch (error) {
      console.error("Error creating movie:", error);
      toast.error("Failed to create movie");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/admin">
          <Button
            variant="ghost"
            className="mb-6 text-teal-600 hover:text-teal-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
        </Link>

        <Card className="p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Add New Movie
          </h1>
          <MovieForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </Card>
      </div>
    </main>
  );
}
