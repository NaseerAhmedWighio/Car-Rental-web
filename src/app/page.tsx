"use client"
import Popular from "./Components/Popular";
import Recomended from "./Components/Recomended";
import Selector from "./Components/Selector";
import Hero from "./Components/Hero";
import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkData = async () => {
      try {
        await client.fetch(`*[_type in ["popular", "recommended"]][0]._id`);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    checkData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[40vh] md:min-h-[70vh] flex items-center justify-center bg-[#F6F7F9]">
        <p className="text-center text-xl sm:text-2xl font-semibold uppercase text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Hero />
      <div className="bg-[#F6F7F9] px-4 sm:px-5 md:px-8 lg:px-20">
      <Selector />
      </div>
      <Popular />
      <Recomended />
    </>
  )
}
