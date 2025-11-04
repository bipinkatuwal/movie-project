"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MovieCard } from "@/components/movie-card";
import { MovieFilters, FilterState } from "@/components/movie-filters";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchMovies, getAllGenres, getYearRange } from "@/lib/client";
import { Movie, MoviesResponse } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowUpDown } from "lucide-react";

type SortBy = "title" | "year" | "rating" | "reviewCount";
type Order = "asc" | "desc";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [displayedMovies, setDisplayedMovies] = useState<MoviesResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([1900, 2025]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [genre, setGenre] = useState("all");
  const [yearMin, setYearMin] = useState(yearRange[0]);
  const [yearMax, setYearMax] = useState(yearRange[1]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("title");
  const [order, setOrder] = useState<Order>("asc");

  const loadMovies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchMovies(
        page,
        limit,
        genre === "all" ? undefined : genre,
        yearMin,
        yearMax,
        search,
        sortBy,
        order
      );
      setDisplayedMovies(data);
    } catch (error) {
      console.error("Error loading movies:", error);
      toast.error("Failed to load movies");
    } finally {
      setLoading(false);
    }
  }, [page, limit, genre, yearMin, yearMax, search, sortBy, order]);

  const loadAllMovies = useCallback(async () => {
    try {
      const data = await fetchMovies(1, 1000);
      setMovies(data.movies);
      setGenres(getAllGenres(data.movies));
      setYearRange(getYearRange(data.movies));
    } catch (error) {
      console.error("Error loading all movies:", error);
    }
  }, []);

  useEffect(() => {
    loadAllMovies();
  }, [loadAllMovies]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    if (genre !== "all") params.set("genre", genre);
    if (yearMin !== yearRange[0]) params.set("yearMin", yearMin.toString());
    if (yearMax !== yearRange[1]) params.set("yearMax", yearMax.toString());
    if (search) params.set("search", search);
    if (sortBy !== "title") params.set("sortBy", sortBy);
    if (order !== "asc") params.set("order", order);

    router.push(`?${params.toString()}`);
  }, [
    page,
    limit,
    genre,
    yearMin,
    yearMax,
    search,
    sortBy,
    order,
    router,
    yearRange,
  ]);

  useEffect(() => {
    const paramsPage = searchParams.get("page");
    const paramsLimit = searchParams.get("limit");
    const paramsGenre = searchParams.get("genre");
    const paramsYearMin = searchParams.get("yearMin");
    const paramsYearMax = searchParams.get("yearMax");
    const paramsSearch = searchParams.get("search");
    const paramsSortBy = searchParams.get("sortBy");
    const paramsOrder = searchParams.get("order");

    if (paramsPage) setPage(parseInt(paramsPage, 10));
    if (paramsLimit) setLimit(parseInt(paramsLimit, 10));
    if (paramsGenre) setGenre(paramsGenre);
    if (paramsYearMin) setYearMin(parseInt(paramsYearMin, 10));
    if (paramsYearMax) setYearMax(parseInt(paramsYearMax, 10));
    if (paramsSearch) setSearch(paramsSearch);
    if (paramsSortBy) setSortBy(paramsSortBy as SortBy);
    if (paramsOrder) setOrder(paramsOrder as Order);
  }, [searchParams]);

  const handleFilter = (filters: FilterState) => {
    setGenre(filters.genre);
    setYearMin(filters.yearMin);
    setYearMax(filters.yearMax);
    setSearch(filters.search);
    setPage(1);
  };

  const handleSortChange = (field: SortBy) => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("asc");
    }
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Movie Database
          </h1>
          <p className="text-gray-600">
            Explore our collection of {movies.length} movies
          </p>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-1">
            <MovieFilters
              genres={genres}
              yearRange={yearRange}
              onFilter={handleFilter}
              currentFilters={{ genre, yearMin, yearMax, search }}
            />
          </div>

          <div className="lg:col-span-3 space-y-8">
            <div className="bg-gray-900 rounded-lg shadow-md p-4 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div className="text-sm text-gray-400">
                {displayedMovies
                  ? `Showing ${
                      (displayedMovies.page - 1) * displayedMovies.limit + 1
                    }-${Math.min(
                      displayedMovies.page * displayedMovies.limit,
                      displayedMovies.total
                    )} of ${displayedMovies.total} movies`
                  : "Loading..."}
              </div>

              <div className="flex gap-2 flex-wrap">
                <Select
                  value={sortBy}
                  onValueChange={(val) => handleSortChange(val as SortBy)}
                >
                  <SelectTrigger className="w-40 text-white border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Sort by Title</SelectItem>
                    <SelectItem value="year">Sort by Year</SelectItem>
                    <SelectItem value="rating">Sort by Rating</SelectItem>
                    <SelectItem value="reviewCount">Sort by Reviews</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                  className="border-gray-600 text-gray-600 hover:bg-teal-50"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-900 rounded-lg shadow-md overflow-hidden"
                  >
                    <Skeleton className="w-full h-72" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : displayedMovies && displayedMovies.movies.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {displayedMovies.movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>

                <Pagination
                  currentPage={displayedMovies.page}
                  totalPages={displayedMovies.totalPages}
                  limit={displayedMovies.limit}
                  onPageChange={setPage}
                  onLimitChange={setLimit}
                />
              </>
            ) : (
              <div className="bg-black rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-400 text-lg">
                  No movies found matching your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
