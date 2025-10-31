import { NextRequest, NextResponse } from "next/server";
import { getAllMovies, createMovie } from "@/lib/data";
import { Movie, MoviesResponse } from "@/lib/types";
import { isAdmin } from "@/lib/helper";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const genre = searchParams.get("genre");
    const yearMin = searchParams.get("yearMin")
      ? parseInt(searchParams.get("yearMin")!, 10)
      : undefined;
    const yearMax = searchParams.get("yearMax")
      ? parseInt(searchParams.get("yearMax")!, 10)
      : undefined;
    const search = searchParams.get("search");
    const sortBy = (searchParams.get("sortBy") || "title") as
      | "title"
      | "year"
      | "rating"
      | "reviewCount";
    const order = (searchParams.get("order") || "asc") as "asc" | "desc";

    let movies = getAllMovies();

    if (genre && genre !== "all") {
      movies = movies.filter((m: Movie) => m.genre.includes(genre));
    }

    if (yearMin !== undefined) {
      movies = movies.filter((m: Movie) => m.year >= yearMin);
    }

    if (yearMax !== undefined) {
      movies = movies.filter((m: Movie) => m.year <= yearMax);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      movies = movies.filter(
        (m: Movie) =>
          m.title.toLowerCase().includes(searchLower) ||
          m.director.toLowerCase().includes(searchLower) ||
          m.synopsis.toLowerCase().includes(searchLower)
      );
    }

    movies.sort((a: Movie, b: Movie) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortBy) {
        case "title":
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case "year":
          aVal = a.year;
          bVal = b.year;
          break;
        case "rating":
          aVal = a.rating;
          bVal = b.rating;
          break;
        case "reviewCount":
          aVal = a.reviewCount;
          bVal = b.reviewCount;
          break;
        default:
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
      }

      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });

    const total = movies.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedMovies = movies.slice(start, start + limit);

    const response: MoviesResponse = {
      movies: paginatedMovies,
      total,
      page,
      limit,
      totalPages,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const requiredFields = [
      "title",
      "year",
      "genre",
      "rating",
      "director",
      "runtime",
      "synopsis",
      "cast",
      "posterUrl",
    ];
    for (const field of requiredFields) {
      if (!(field in body)) {
        return NextResponse.json(
          { error: `Missing field: ${field}` },
          { status: 400 }
        );
      }
    }

    const newMovie = createMovie({
      title: body.title,
      year: body.year,
      genre: body.genre,
      rating: body.rating,
      director: body.director,
      runtime: body.runtime,
      synopsis: body.synopsis,
      cast: body.cast,
      posterUrl: body.posterUrl,
      reviewCount: 0,
      averageReviewRating: 0,
    });

    return NextResponse.json(newMovie, { status: 201 });
  } catch (error) {
    console.error("Error creating movie:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
