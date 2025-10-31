import { NextRequest, NextResponse } from "next/server";
import { getMovieById, updateMovie, deleteMovie } from "@/lib/data";
import { isAdmin } from "@/lib/helper";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const movieId = parseInt(id, 10);
    if (isNaN(movieId)) {
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
    }

    const movie = getMovieById(movieId);
    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.error("Error fetching movie:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
): Promise<NextResponse> {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const movieId = parseInt(id, 10);
    if (isNaN(movieId)) {
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
    }

    const body = await request.json();
    const validKeys = [
      "title",
      "year",
      "genre",
      "rating",
      "director",
      "runtime",
      "synopsis",
      "cast",
      "posterUrl",
      "reviewCount",
      "averageReviewRating",
    ];

    for (const key of Object.keys(body)) {
      console.log(body);
      if (!validKeys.includes(key)) {
        return NextResponse.json(
          { error: `Invalid property: ${key}` },
          { status: 400 }
        );
      }
    }
    const updatedMovie = updateMovie(movieId, body);

    if (!updatedMovie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(updatedMovie);
  } catch (error) {
    console.error("Error updating movie:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
): Promise<NextResponse> {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const movieId = parseInt(id, 10);
    if (isNaN(movieId)) {
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
    }

    const success = deleteMovie(movieId);
    if (!success) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting movie:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
