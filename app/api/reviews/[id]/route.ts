import { NextRequest, NextResponse } from "next/server";
import { getReviewById } from "@/lib/data";

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
    const reviewId = parseInt(id, 10);
    if (isNaN(reviewId)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }

    const review = getReviewById(reviewId);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
