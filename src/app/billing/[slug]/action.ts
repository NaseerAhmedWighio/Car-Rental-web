"use server";
import Stripe from "stripe";



export async function createPaymentIntent(amount:number) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-12-18.acacia", // or the latest stable version
  });
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      // Optionally, you can add metadata or other parameters
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    // In a real app, you should handle the error properly
    console.error(error);
    throw error;
  }
}
