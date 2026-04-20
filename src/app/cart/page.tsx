"use client";
import { Metadata } from "next";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import ProductCard from "../Components/ProductCard";

export const metadata: Metadata = {
  title: "Favorites | Morent Car Rental",
  description: "Save your favorite cars for later. Browse and save cars you like in Pakistan.",
  keywords: ["favorites", "saved cars", "car wishlist", "liked cars", "Morent favorites"],
  openGraph: {
    title: "Favorites | Morent Car Rental",
    description: "Save your favorite cars for later.",
    url: "https://morents.vercel.app/cart",
  },
};

interface Car {
  _id: string;
  id: string;
  slug: string;
  title: string;
  category: string;
  image: string;
  fuel: string;
  type: string;
  capacity: string;
  price: number;
  discount: number;
}

export default function CartPage() {
  const [cartSlugs, setCartSlugs] = useState<string[]>([]);
  const [cartData, setCartData] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedCart = localStorage.getItem("cartSlugs");
    if (storedCart) {
      setCartSlugs(JSON.parse(storedCart));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cartSlugs.length === 0) {
      setCartData([]);
      setLoading(false);
      return;
    }

    const fetchCartData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(
          `*[_type in ["popular","recommended"] && slug.current in $slugs]{
            _id,
            id,
            "slug": slug.current,
            title,
            category,
            image,
            fuel,
            type,
            capacity,
            price,
            discount
          }`,
          { slugs: cartSlugs }
        );
        setCartData(response);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [cartSlugs]);

  const handleRemoveFromCart = (slug: string) => {
    const updatedCartSlugs = cartSlugs.filter((itemSlug) => itemSlug !== slug);
    setCartSlugs(updatedCartSlugs);
    localStorage.setItem("cartSlugs", JSON.stringify(updatedCartSlugs));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center text-blue-500 text-2xl font-semibold min-h-[40vh] md:min-h-[70vh]">
        Loading...
      </div>
    );
  }

  return (
    <>
      <main className="w-full min-h-[40vh] md:min-h-[70vh] bg-[#F6F7F9] py-6 sm:py-8 lg:py-10">
        <div className="mx-5 md:mx-8 lg:mx-20">
          <h1 className="w-full bg-[#3563E9] rounded-lg shadow-md text-[20px] sm:text-[24px] font-semibold text-white text-center mb-6 sm:mb-8 py-3 sm:py-4">
            Your Favorites
          </h1>
          {cartData.length > 0 ? (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
              {cartData.map((car) => (
                <ProductCard
                  key={car.slug}
                  id={car.id}
                  slug={car.slug}
                  title={car.title}
                  category={car.category}
                  capacity={car.capacity}
                  image={car.image}
                  fuel={car.fuel}
                  type={car.type}
                  price={car.price}
                  discount={car.discount}
                  link={`/details/${car.slug}`}
                  link2={`/billing/${car.slug}`}
                  onAddToCart={() => handleRemoveFromCart(car.slug)}
                  isInCart={true}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-64 sm:h-72 bg-white rounded-lg shadow-md">
              <p className="text-xl sm:text-2xl font-semibold text-gray-400 mb-2">
                Your cart is empty.
              </p>
              <p className="text-sm sm:text-base text-gray-500">
                Browse our cars and add your favorites!
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
