import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

// GET - Fetch reviews for a car
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      // Get all reviews
      const groq = `*[_type == "review"] | order(date desc) {
        _id,
        productSlug,
        username,
        subname,
        comment,
        rating,
        date,
        imageUrl
      }[0...50]`;

      const reviews = await client.fetch(groq);
      return NextResponse.json({ reviews, count: reviews.length });
    }

    // Get reviews for specific car
    const groq = `*[_type == "review" && productSlug == $slug] | order(date desc) {
      _id,
      productSlug,
      username,
      subname,
      comment,
      rating,
      date,
      imageUrl
    }`;

    const reviews = await client.fetch(groq, { slug });

    // Calculate average rating
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
          reviews.length
        : 0;

    return NextResponse.json({
      reviews,
      count: reviews.length,
      averageRating: avgRating.toFixed(1),
    });
  } catch (error) {
    console.error("Reviews API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST - Submit a new review
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productSlug, username, subname, comment, rating, imageUrl } = body;

    if (!productSlug || !username || !comment || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Create review document in Sanity
    const review = {
      _type: "review",
      _id: `review-${productSlug}-${Date.now()}`,
      productSlug,
      username,
      subname: subname || "",
      comment,
      rating: Number(rating),
      date: new Date().toISOString(),
      imageUrl: imageUrl || "",
    };

    await client.create(review);

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Review POST error:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}