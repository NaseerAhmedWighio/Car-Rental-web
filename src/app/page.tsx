"use client"
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Popular from "./Components/Popular";
import Recomended from "./Components/Recomended";
import Selector from "./Components/Selector";
import Hero from "./Components/Hero";
import Header2 from "./Components/Header2"
import { ClerkProvider } from "@clerk/nextjs";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Home(){

  return(
    <>
      <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
    <Elements stripe={stripePromise}>
    <Header2/>
    <Hero/>
    <Selector/>
    <Popular/>
    <Recomended/>
    </Elements>
    </ClerkProvider>
    </>
  )
}