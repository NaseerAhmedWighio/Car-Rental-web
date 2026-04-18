"use client";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import ProductCard from "../Components/ProductCard";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export default function RentPage() {
  const [rentItems, setRentItems] = useState<string[]>([]);
  const [rentData, setRentData] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedRent = localStorage.getItem("rentItems");
    if (storedRent) {
      setRentItems(JSON.parse(storedRent));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (rentItems.length === 0) {
      setRentData([]);
      setLoading(false);
      return;
    }

    const fetchRentData = async () => {
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
          { slugs: rentItems }
        );
        setRentData(response);
      } catch (error) {
        console.error("Error fetching rent data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentData();
  }, [rentItems]);

  const handleRemoveFromRent = (slug: string) => {
    const updatedRentItems = rentItems.filter((itemSlug) => itemSlug !== slug);
    setRentItems(updatedRentItems);
    localStorage.setItem("rentItems", JSON.stringify(updatedRentItems));
  };

  const handleCheckout = () => {
    router.push("/billing");
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
            Your Rentals
          </h1>
          {rentData.length > 0 ? (
            <>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
                {rentData.map((car) => (
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
                    onAddToCart={() => handleRemoveFromRent(car.slug)}
                    isInCart={true}
                  />
                ))}
              </div>

              <div className="mt-8 bg-white border-t border-gray-200 py-4 rounded-lg px-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-[14px] sm:text-[16px] text-gray-600">
                      {rentData.length} car{rentData.length > 1 ? 's' : ''} selected for rent
                    </p>
                    <p className="text-[18px] sm:text-[20px] font-bold text-[#1A202C] mt-1">
                      Total: ${rentData.reduce((sum, car) => sum + Number(car.price), 0).toLocaleString()}/day
                    </p>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full sm:w-auto px-8 py-3 bg-[#3563E9] text-white font-semibold text-[14px] sm:text-[16px] rounded-lg hover:bg-[#2952cc] transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-center items-center h-64 sm:h-72 bg-white rounded-lg shadow-md">
              <p className="text-xl sm:text-2xl font-semibold text-gray-400 mb-2">
                No cars selected for rent.
              </p>
              <p className="text-sm sm:text-base text-gray-500">
                Browse our cars and add your rentals!
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}