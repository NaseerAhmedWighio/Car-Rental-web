import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { carSlug, days, pricePerDay, customerName, customerEmail, customerPhone } = body;

    if (!carSlug || !days || !pricePerDay) {
      return NextResponse.json(
        { error: "Missing required fields: carSlug, days, pricePerDay" },
        { status: 400 }
      );
    }

    const totalPrice = days * pricePerDay;
    const amountInCents = Math.round(totalPrice * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        carSlug,
        days: String(days),
        pricePerDay: String(pricePerDay),
        totalPrice: String(totalPrice),
        customerName: customerName || "",
        customerEmail: customerEmail || "",
        customerPhone: customerPhone || "",
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amountInCents,
      totalPrice,
    });
  } catch (error: any) {
    console.error("Payment Intent Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment intent" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get("paymentIntentId");

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Missing paymentIntentId" },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return NextResponse.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      metadata: paymentIntent.metadata,
    });
  } catch (error: any) {
    console.error("Payment Retrieval Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve payment" },
      { status: 500 }
    );
  }
}