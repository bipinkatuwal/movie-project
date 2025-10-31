import { NextRequest, NextResponse } from "next/server";
import { getReviewsByMovieId, createReview } from "@/lib/data";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const movieId = searchParams.get("movieId");

    if (!movieId) {
      return NextResponse.json(
        { error: "movieId parameter is required" },
        { status: 400 }
      );
    }

    const id = parseInt(movieId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid movieId" }, { status: 400 });
    }

    const reviews = getReviewsByMovieId(id);
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    const requiredFields = ["movieId", "userName", "rating", "reviewText"];
    for (const field of requiredFields) {
      if (!(field in body)) {
        return NextResponse.json(
          { error: `Missing field: ${field}` },
          { status: 400 }
        );
      }
    }

    if (!Number.isInteger(body.movieId) || body.movieId <= 0) {
      return NextResponse.json({ error: "Invalid movieId" }, { status: 400 });
    }

    if (!Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (
      typeof body.userName !== "string" ||
      body.userName.trim().length === 0
    ) {
      return NextResponse.json({ error: "Invalid userName" }, { status: 400 });
    }

    if (
      typeof body.reviewText !== "string" ||
      body.reviewText.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid reviewText" },
        { status: 400 }
      );
    }

    const newReview = createReview({
      movieId: body.movieId,
      userName: body.userName.trim(),
      rating: body.rating,
      reviewText: body.reviewText.trim(),
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
