"use client";

import Link from "next/link";
import { Movie } from "@/lib/types";
import { StarRating } from "./star-rating";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movies/${movie.id}`}>
      <div className="group h-full bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden cursor-pointer">
        <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-teal-600 transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">{movie.year}</span>
            <div className="flex items-center gap-1">
              <StarRating rating={Math.round(movie.rating / 2)} size="sm" />
              <span className="text-xs text-gray-600 font-medium">
                {movie.rating.toFixed(1)}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            {movie.genre.slice(0, 2).map((g) => (
              <Badge
                key={g}
                variant="secondary"
                className="text-xs bg-teal-100 text-teal-700 hover:bg-teal-100"
              >
                {g}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{movie.runtime} min</span>
            <span>{movie.reviewCount} reviews</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
