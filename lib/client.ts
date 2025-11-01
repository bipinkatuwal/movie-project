"use client";

import { Movie, Review, MoviesResponse } from "./types";

export async function fetchMovies(
  page: number = 1,
  limit: number = 10,
  genre?: string,
  yearMin?: number,
  yearMax?: number,
  search?: string,
  sortBy?: "title" | "year" | "rating" | "reviewCount",
  order?: "asc" | "desc"
): Promise<MoviesResponse> {
  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("limit", limit.toString());
  if (genre) params.set("genre", genre);
  if (yearMin !== undefined) params.set("yearMin", yearMin.toString());
  if (yearMax !== undefined) params.set("yearMax", yearMax.toString());
  if (search) params.set("search", search);
  if (sortBy) params.set("sortBy", sortBy);
  if (order) params.set("order", order);

  const response = await fetch(`/api/movies?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch movies");
  return response.json();
}

export async function fetchMovie(id: number): Promise<Movie> {
  const response = await fetch(`/api/movies/${id}`);
  if (!response.ok) throw new Error("Failed to fetch movie");
  return response.json();
}

export async function createMovie(
  movie: Omit<Movie, "id" | "reviewCount" | "averageReviewRating">
): Promise<Movie> {
  const response = await fetch("/api/movies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...movie, reviewCount: 0, averageReviewRating: 0 }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create movie");
  }
  return response.json();
}

export async function updateMovie(
  id: number,
  updates: Partial<Omit<Movie, "id" | "reviewCount" | "averageReviewRating">>
): Promise<Movie> {
  const response = await fetch(`/api/movies/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update movie");
  }
  return response.json();
}

export async function deleteMovie(id: number): Promise<void> {
  const response = await fetch(`/api/movies/${id}`, { method: "DELETE" });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete movie");
  }
}

export async function fetchReviews(movieId: number): Promise<Review[]> {
  const response = await fetch(`/api/reviews?movieId=${movieId}`);
  if (!response.ok) throw new Error("Failed to fetch reviews");
  return response.json();
}

export async function fetchReview(id: number): Promise<Review> {
  const response = await fetch(`/api/reviews/${id}`);
  if (!response.ok) throw new Error("Failed to fetch review");
  return response.json();
}

export async function createReview(
  review: Omit<Review, "id">
): Promise<Review> {
  const response = await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create review");
  }
  return response.json();
}

export async function login(password: string): Promise<void> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Login failed");
  }
}

export function getAllGenres(movies: Movie[]): string[] {
  const genresSet = new Set<string>();
  movies.forEach((movie) => {
    movie.genre.forEach((g) => genresSet.add(g));
  });
  return Array.from(genresSet).sort();
}

export function getYearRange(movies: Movie[]): [number, number] {
  if (movies.length === 0) return [1900, new Date().getFullYear()];
  const years = movies.map((m) => m.year);
  return [Math.min(...years), Math.max(...years)];
}

export async function exportMoviesCSV(
  genre?: string,
  yearMin?: number,
  yearMax?: number,
  search?: string,
  sortBy?: "title" | "year" | "rating" | "reviewCount",
  order?: "asc" | "desc"
): Promise<void> {
  const params = new URLSearchParams();
  if (genre) params.set("genre", genre);
  if (yearMin !== undefined) params.set("yearMin", yearMin.toString());
  if (yearMax !== undefined) params.set("yearMax", yearMax.toString());
  if (search) params.set("search", search);
  if (sortBy) params.set("sortBy", sortBy);
  if (order) params.set("order", order);

  const response = await fetch(`/api/movies/export/csv?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to export CSV");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const filename =
    response.headers
      .get("content-disposition")
      ?.match(/filename="(.+)"/)?.[1] || "movies.csv";
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
