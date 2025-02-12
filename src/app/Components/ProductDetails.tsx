"use client";
import { client } from "@/sanity/lib/client";
// import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { GoHeartFill, GoHeart } from "react-icons/go";

interface Car {
  id?: string;
  slug: string;
  title: string;
  category: string;
  fuel: string;
  type: string;
  capacity: string;
  price: number;
  link?: string;
  discount?: number;
  rating?: number;
  review?: number;
  onAddToCart?: () => void;
  isInCart?: boolean;
}

interface Review {
  username: string;
  subname: string;
  comment: string;
  rating: number;
  date: string;
  imageUrl: string; // Updated property name
}

export default function ProductDetails({
  slug,
  title,
  category,
  fuel,
  type,
  capacity,
  price,
  discount,
  onAddToCart,
  isInCart,
  rating,
}: Car) {
  // const { user, isSignedIn } = useUser();
  const [fetch, setFetch] = useState<Car | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  console.log(reviews)
  useEffect(() => {
      const storedReviews = localStorage.getItem("reviews");
      if (storedReviews) {
          setReviews(JSON.parse(storedReviews));
      }
  }, []);
  
  // const ratingValue = rating

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const detailQuery = `*[_type in ["popular", "recommended"] && slug.current == $slug]{
          _id,
          title,
          price,
          type,
          image,
          category,
          fuel,
          capacity,
          "slug": slug.current,
          discount,
          "review": coalesce(round(average(review[].rating)), 0),
          review[] {
            rating,
          },
        }`;

        const detailResponse = await client.fetch(detailQuery, { slug });
        console.log("API Response:", detailResponse);

        if (detailResponse?.length > 0) {
          setFetch(detailResponse[0]);
        } else {
          setFetch(undefined);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (!fetch) return <div>No product details found</div>;

  // const ratingValue = fetch?.rating ?? 0;


  return (
    <div>
      <div className="h-full flex flex-col justify-between bg-white rounded-lg shadow-md p-4 md:p-7 lg:p-10 space-y-5">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-bold lg:text-[32px] md:text-[24px] text-[20px] text-[#1A202C]">{title}</h1>
            <div className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-lg lg:text-xl ${
                    rating >= star
                      ? "text-yellow-500"
                      : rating >= star - 0.5
                      ? "text-yellow-300"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
              {rating > 0 && (
                <span className="mt-1 text-[10px] whitespace-nowrap md:text-[14px] font-medium text-[#596780]">
                  {rating.toFixed(1)} Rating
                </span>
              )}
            </div>
          </div>
          <div onClick={onAddToCart} className="cursor-pointer p-2">
            {isInCart ? (
              <GoHeartFill className="text-red-800 w-6 h-6 scale-125 md:scale-150" />
            ) : (
              <GoHeart className="text-red-800 w-6 h-6 scale-125 md:scale-150" />
            )}
          </div>
        </div>

        <p className="text-[#596780] text-[14px] md:text-18-[px] lg:text-[20px]">
          {`NISMO has become the embodiment of Nissan's outstanding performance, inspired by the most unforgiving proving ground, the "race track".`}
        </p>


        <div className="flex justify-center items-center gap-10 md:gap-16 lg:gap-[35px]">
                     <div className="w-full">
                         <div className="flex justify-between items-center">
                             <div>
                                 <h5 className="text-[#90A3BF] text-[10px] md:text-[14px] lg:text-[20px] whitespace-nowrap">Type Car</h5>
                                 <h5 className=" text-[#90A3BF] text-[10px] md:text-[14px] lg:text-[20px]">Stearing</h5>
                             </div>
                             <div>
                                 <h5 className=" text-[#596780] text-[10px]  md:text-[14px] text-right lg:text-[20px] font-semibold">{category}</h5>
                                 <h5 className=" text-[#596780] text-right  text-[10px]  md:text-[14px] lg:text-[20px] font-semibold">{type}</h5>
                             </div>
                         </div>
                     </div>
                     <div className="w-full">
                         <div className="flex justify-between items-center">
                             <div>
                                 <h5 className="text-[#90A3BF] text-[10px]  md:text-[14px] lg:text-[20px]">Capacity</h5>
                                 <h5 className="text-[#90A3BF] text-[10px]  md:text-[14px] lg:text-[20px]">Gasoline</h5>
                             </div>
                             <div>
                                 <h5 className="text-[#596780] text-[10px]  md:text-[14px] lg:text-[20px] whitespace-nowrap font-semibold">{capacity}Person</h5>
                                 <h5 className="text-[#596780] text-right text-[10px]  md:text-[14px] lg:text-[20px] font-semibold">{fuel}L</h5>
                             </div>
                         </div>
                     </div>
                 </div>


        <div className="flex justify-between">
          <div>
            <h5 className="text-[#1A202C] text-[16px] md:text-[20px] lg:text-[24px] font-bold">
              ${price}.00/
              <span className="lg:text-base md:text-[12px] text-[10px] text-[#90A3BF] font-normal">
                days
              </span>
            </h5>
            <del className="text-[#90A3BF] text-[12px] md:text-base">${discount}.00</del>
          </div>
          <Link href={`/billing/${slug}`}>
            <button className="px-4 py-2 bg-[#3563E9] text-white font-semibold text-[12px] md:text-[16px] rounded-lg">
              Rent Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
