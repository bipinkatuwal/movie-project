"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { MovieCard } from "@/components/movie-card";
import { MovieFilters, FilterState } from "@/components/movie-filters";
import { PaginationComponent } from "@/components/pagination";
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
import { ArrowDownAZ, ArrowDownZA } from "lucide-react";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";

type SortBy = "title" | "year" | "rating" | "reviewCount";
type Order = "asc" | "desc";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Data
  const [movies, setMovies] = useState<Movie[]>([]);
  const [displayedMovies, setDisplayedMovies] = useState<MoviesResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [genres, setGenres] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([1900, 2025]);

  // Controls
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [genre, setGenre] = useState<string>("all");
  const [yearMin, setYearMin] = useState<number>(yearRange[0]);
  const [yearMax, setYearMax] = useState<number>(yearRange[1]);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortBy>("title");
  const [order, setOrder] = useState<Order>("asc");

  // Helpers to avoid overwriting URL params on first render and to ignore stale responses
  const hydratedFromUrl = useRef(false);
  const fetchToken = useRef(0);

  // Load metadata (all movies) for filters like genres and year range
  const loadAllMovies = useCallback(async () => {
    try {
      const data = await fetchMovies(1, 1000);
      setMovies(data.movies);
      setGenres(getAllGenres(data.movies));
      const range = getYearRange(data.movies);
      setYearRange(range);

      // initialize year bounds if unset
      setYearMin((prev) => prev ?? range[0]);
      setYearMax((prev) => prev ?? range[1]);
    } catch (err) {
      // Non-fatal: show console so developer can inspect
      // Keep UI usable even if metadata fails
      // eslint-disable-next-line no-console
      console.error("Error loading all movies:", err);
    }
  }, []);

  // Initialize component state from URL query params (run once on mount)
  useEffect(() => {
    if (!searchParams) return;

    const pPage = searchParams.get("page");
    const pLimit = searchParams.get("limit");
    const pGenre = searchParams.get("genre");
    const pYearMin = searchParams.get("yearMin");
    const pYearMax = searchParams.get("yearMax");
    const pSearch = searchParams.get("search");
    const pSortBy = searchParams.get("sortBy");
    const pOrder = searchParams.get("order");

    if (pPage) {
      const n = parseInt(pPage, 10);
      if (!Number.isNaN(n) && n > 0) setPage(n);
    }
    if (pLimit) {
      const n = parseInt(pLimit, 10);
      if (!Number.isNaN(n) && n > 0) setLimit(n);
    }
    if (pGenre) setGenre(pGenre);
    if (pYearMin) {
      const n = parseInt(pYearMin, 10);
      if (!Number.isNaN(n)) setYearMin(n);
    }
    if (pYearMax) {
      const n = parseInt(pYearMax, 10);
      if (!Number.isNaN(n)) setYearMax(n);
    }
    if (pSearch) {
      setSearch(pSearch);
      setDebouncedSearch(pSearch);
    }
    if (pSortBy && ["title", "year", "rating", "reviewCount"].includes(pSortBy))
      setSortBy(pSortBy as SortBy);
    if (pOrder && (pOrder === "asc" || pOrder === "desc"))
      setOrder(pOrder as Order);

    hydratedFromUrl.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once

  // Load filter metadata once
  useEffect(() => {
    void loadAllMovies();
  }, [loadAllMovies]);

  // Debounce search input to avoid firing on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch the paginated/filtered movies; use token to discard stale responses
  const loadMovies = useCallback(async () => {
    const token = ++fetchToken.current;
    setLoading(true);
    try {
      const data = await fetchMovies(
        page,
        limit,
        genre === "all" ? undefined : genre,
        yearMin,
        yearMax,
        debouncedSearch,
        sortBy,
        order
      );
      // if a newer fetch started after this one, ignore this result
      if (token !== fetchToken.current) return;
      setDisplayedMovies(data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error loading movies:", err);
      toast.error("Failed to load movies");
    } finally {
      if (token === fetchToken.current) setLoading(false);
    }
  }, [page, limit, genre, yearMin, yearMax, debouncedSearch, sortBy, order]);

  // Trigger movies fetch when relevant params change (debouncedSearch included)
  useEffect(() => {
    void loadMovies();
  }, [loadMovies]);

  // Sync state -> URL but avoid overwriting the initial URL on first mount
  useEffect(() => {
    if (!hydratedFromUrl.current) {
      // If we have not hydrated from URL yet, skip syncing and mark hydrated to allow sync
      // on subsequent changes. This prevents an immediate push that wipes server-provided params.
      hydratedFromUrl.current = true;
      return;
    }

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (genre && genre !== "all") params.set("genre", genre);
    if (yearMin !== yearRange[0]) params.set("yearMin", String(yearMin));
    if (yearMax !== yearRange[1]) params.set("yearMax", String(yearMax));
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (sortBy !== "title") params.set("sortBy", sortBy);
    if (order !== "asc") params.set("order", order);

    // Use replace to avoid creating a history entry for every small interaction
    router.replace(`?${params.toString()}`);
  }, [
    page,
    limit,
    genre,
    yearMin,
    yearMax,
    debouncedSearch,
    sortBy,
    order,
    router,
    yearRange,
  ]);

  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    const prev = prevPathRef.current;
    // Only act on real navigations (prev exists and differs) and when target is root
    if (prev && prev !== pathname && pathname === "/") {
      // Reset filter state to defaults
      setGenre("all");
      setYearMin(yearRange[0]);
      setYearMax(yearRange[1]);
      setSearch("");
      setDebouncedSearch("");
      setPage(1);

      // Ensure query string is cleared without adding history entry
      router.replace("/");
    }
    // update previous path for next navigation
    prevPathRef.current = pathname;
  }, [pathname, router, yearRange]);

  // Handlers
  const handleFilter = useCallback((filters: FilterState) => {
    setGenre(filters.genre);
    setYearMin(filters.yearMin);
    setYearMax(filters.yearMax);
    setSearch(filters.search);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((field: SortBy) => {
    setPage(1);
    setSortBy((prev) => {
      if (prev === field) {
        setOrder((o) => (o === "asc" ? "desc" : "asc"));
        return prev;
      }
      setOrder("asc");
      return field;
    });
  }, []);

  const rangeText = useMemo(() => {
    if (!displayedMovies) return "Loading...";
    const start = (displayedMovies.page - 1) * displayedMovies.limit + 1;
    const end = Math.min(
      displayedMovies.page * displayedMovies.limit,
      displayedMovies.total
    );
    return `Showing ${start}-${end} of ${displayedMovies.total} movies`;
  }, [displayedMovies]);

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          <aside className="lg:col-span-1">
            <MovieFilters
              genres={genres}
              yearRange={yearRange}
              onFilter={handleFilter}
              currentFilters={{ genre, yearMin, yearMax, search }}
            />
          </aside>

          <section className="lg:col-span-3 space-y-8">
            <Card className="py-4">
              <CardHeader className="flex justify-between items-center">
                <CardTitle>{rangeText}</CardTitle>
                <CardAction className="flex gap-2">
                  <Select
                    value={sortBy}
                    onValueChange={(val) => handleSortChange(val as SortBy)}
                  >
                    <SelectTrigger aria-label="Sort by" size="sm">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="title">Sort by Title</SelectItem>
                      <SelectItem value="year">Sort by Year</SelectItem>
                      <SelectItem value="rating">Sort by Rating</SelectItem>
                      <SelectItem value="reviewCount">
                        Sort by Reviews
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setOrder((o) => (o === "asc" ? "desc" : "asc"))
                    }
                    aria-label="Toggle sort order"
                  >
                    {order === "asc" ? (
                      <ArrowDownAZ className="w-4 h-4" />
                    ) : (
                      <ArrowDownZA className="w-4 h-4" />
                    )}
                  </Button>
                </CardAction>
              </CardHeader>
            </Card>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="card overflow-hidden">
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

                <PaginationComponent
                  currentPage={displayedMovies.page}
                  totalPages={displayedMovies.totalPages}
                  limit={displayedMovies.limit}
                  onPageChange={setPage}
                  onLimitChange={setLimit}
                />
              </>
            ) : (
              <div className="card p-12 text-center">
                <p className="text-muted text-lg">
                  No movies found matching your filters.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
