"use server";
import Stripe from "stripe";
import { client } from "@/sanity/lib/client";

export async function createPaymentIntent(amount: number) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-12-18.acacia",
  });
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      payment_method_types: ["card"],
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function saveRentalToSanity(rentCars: any[], customerDetails: any, rentalDetails: any, totalAmount: number) {
  try {
    const rentalId = `RNT-${Date.now().toString(36).toUpperCase()}`;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
    for (const car of rentCars) {
      await client.create({
        _type: "rental",
        carTitle: car.title,
        carSlug: car.slug,
        category: car.category || "",
        customerName: customerDetails.name || customerDetails.customerName,
        customerPhone: customerDetails.phone || customerDetails.customerPhone,
        customerEmail: customerDetails.email || customerDetails.customerEmail || "",
        pickupLocation: rentalDetails.pickupLocation || rentalDetails.location,
        pickupDate: rentalDetails.pickupDate || rentalDetails.date,
        pickupTime: rentalDetails.pickupTime || rentalDetails.time || currentTime,
        dropoffLocation: rentalDetails.dropoffLocation || rentalDetails.location,
        dropoffDate: rentalDetails.dropoffDate || rentalDetails.date,
        dropoffTime: rentalDetails.dropoffTime || rentalDetails.time || currentTime,
        totalPrice: totalAmount,
        status: "pending",
        rentalId,
        carImage: car.image ? {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: car.imageAssetId || car.image // Handle different formats
          }
        } : null,
        rentedAt: new Date().toISOString(),
      });
    }
    
    return { success: true, rentalId };
  } catch (error) {
    console.error("Error saving rental to Sanity:", error);
    throw error;
  }
}

export async function createSingleRental(rentalData: any) {
  try {
    return await client.create({
      ...rentalData,
      _type: "rental",
      rentedAt: new Date().toISOString(),
      status: rentalData.status || "pending",
    });
  } catch (error) {
    console.error("Error creating rental:", error);
    throw error;
  }
}
