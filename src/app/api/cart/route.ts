import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

// GET - Fetch cart items (get car details for slugs) or search by car name
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slugs = searchParams.get("slugs");
    const search = searchParams.get("search");

    // Handle search by car name
    if (search) {
      const groq = `*[_type in ["popular", "recommended"] && lower(title) contains lower($search)] | order(title asc) [0...10] {
        _id,
        "slug": slug.current,
        title,
        category,
        fuel,
        type,
        capacity,
        price,
        discount,
        image
      }`;

      const results = await client.fetch(groq, { search });
      return NextResponse.json({
        cars: results,
        count: results.length,
        message: results.length > 0 ? "Cars found" : "No cars found",
      });
    }

    if (!slugs) {
      return NextResponse.json({ cars: [], message: "No slugs provided" });
    }

    const slugArray = slugs.split(",").map((s) => s.trim());
    const groq = `*[_type in ["popular", "recommended"] && slug.current in $slugs] {
      _id,
      "slug": slug.current,
      title,
      category,
      fuel,
      type,
      capacity,
      price,
      discount,
      image
    }`;

    const results = await client.fetch(groq, { slugs: slugArray });

    return NextResponse.json({
      cars: results,
      count: results.length,
      message: "Cart retrieved successfully",
    });
  } catch (error) {
    console.error("Cart API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart items" },
      { status: 500 }
    );
  }
}

// POST - Add item to cart (stored in localStorage on client, this just validates the car exists)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, action } = body;

    if (!slug || !action) {
      return NextResponse.json(
        { error: "Missing slug or action" },
        { status: 400 }
      );
    }

    // Verify car exists in Sanity
    const groq = `*[_type in ["popular", "recommended"] && slug.current == $slug][0] {
      _id,
      "slug": slug.current,
      title,
      category,
      price,
      discount
    }`;

    const car = await client.fetch(groq, { slug });

    if (!car) {
      return NextResponse.json(
        { error: "Car not found" },
        { status: 404 }
      );
    }

    // Return the car data - actual cart storage is handled client-side
    return NextResponse.json({
      success: true,
      action,
      car,
      message: action === "add" ? "Car added to cart" : "Car removed from cart",
    });
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json(
      { error: "Failed to process cart action" },
      { status: 500 }
    );
  }
}