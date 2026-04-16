import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

// GET - Fetch rentals (for admin/dashboard)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");

    let groq = `*[_type == "rental"] | order(rentedAt desc)[0...${limit}] {
      _id,
      carTitle,
      carSlug,
      category,
      customerName,
      customerPhone,
      customerEmail,
      pickupLocation,
      pickupDate,
      pickupTime,
      dropoffLocation,
      dropoffDate,
      dropoffTime,
      totalPrice,
      status,
      rentalId,
      rentedAt
    }`;

    if (status) {
      groq = `*[_type == "rental" && status == $status] | order(rentedAt desc)[0...${limit}] {
        _id,
        carTitle,
        carSlug,
        category,
        customerName,
        customerPhone,
        customerEmail,
        pickupLocation,
        pickupDate,
        pickupTime,
        dropoffLocation,
        dropoffDate,
        dropoffTime,
        totalPrice,
        status,
        rentalId,
        rentedAt
      }`;
    }

    const rentals = await client.fetch(groq, status ? { status } : {});

    return NextResponse.json({
      rentals,
      count: rentals.length,
    });
  } catch (error) {
    console.error("Rentals API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rentals" },
      { status: 500 }
    );
  }
}

// POST - Create a new rental
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      carTitle,
      carSlug,
      category,
      customerName,
      customerPhone,
      customerEmail,
      pickupLocation,
      pickupDate,
      pickupTime,
      dropoffLocation,
      dropoffDate,
      dropoffTime,
      totalPrice,
      carImage,
    } = body;

    // Validate required fields
    if (
      !carTitle ||
      !carSlug ||
      !customerName ||
      !customerPhone ||
      !pickupLocation ||
      !pickupDate ||
      !dropoffLocation ||
      !dropoffDate ||
      !totalPrice
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate unique rental ID
    const rentalId = `RNT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Create rental document in Sanity
    const rental = {
      _type: "rental",
      _id: `rental-${Date.now()}`,
      carTitle,
      carSlug,
      category: category || "",
      customerName,
      customerPhone,
      customerEmail: customerEmail || "",
      pickupLocation,
      pickupDate,
      pickupTime: pickupTime || "",
      dropoffLocation,
      dropoffDate,
      dropoffTime: dropoffTime || "",
      totalPrice: Number(totalPrice),
      status: "pending",
      rentalId,
      carImage: carImage || null,
      rentedAt: new Date().toISOString(),
    };

    await client.create(rental);

    return NextResponse.json({
      success: true,
      message: "Rental created successfully",
      rentalId,
      rental,
    });
  } catch (error) {
    console.error("Rental POST error:", error);
    return NextResponse.json(
      { error: "Failed to create rental" },
      { status: 500 }
    );
  }
}