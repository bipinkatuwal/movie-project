import { NextRequest, NextResponse } from "next/server";
import { getAllMovies } from "@/lib/data";
import { Movie } from "@/lib/types";
import { isAdmin } from "@/lib/helper";

function escapeCsvField(field: string | number | string[]): string {
  let value = "";
  if (Array.isArray(field)) {
    value = field.join("; ");
  } else {
    value = String(field);
  }

  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
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

    const headers = [
      "ID",
      "Title",
      "Year",
      "Genre",
      "Rating",
      "Director",
      "Runtime (minutes)",
      "Synopsis",
      "Cast",
      "Poster URL",
      "Review Count",
      "Average Review Rating",
    ];

    const rows = movies.map((m: Movie) => [
      m.id,
      m.title,
      m.year,
      m.genre.join("; "),
      m.rating,
      m.director,
      m.runtime,
      m.synopsis,
      m.cast.join("; "),
      m.posterUrl,
      m.reviewCount,
      m.averageReviewRating.toFixed(2),
    ]);

    const csvContent = [
      headers.map(escapeCsvField).join(","),
      ...rows.map((row) => row.map(escapeCsvField).join(",")),
    ].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="movies-${
          new Date().toISOString().split("T")[0]
        }.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting CSV:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
