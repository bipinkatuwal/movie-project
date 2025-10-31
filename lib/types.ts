export interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string[];
  rating: number;
  director: string;
  runtime: number;
  synopsis: string;
  cast: string[];
  posterUrl: string;
  reviewCount: number;
  averageReviewRating: number;
}

export interface Review {
  id: number;
  movieId: number;
  userName: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface FilterParams {
  genre?: string;
  yearMin?: number;
  yearMax?: number;
  search?: string;
}

export interface SortParams {
  sortBy?: "title" | "year" | "rating" | "reviewCount";
  order?: "asc" | "desc";
}

export interface MoviesResponse {
  movies: Movie[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
