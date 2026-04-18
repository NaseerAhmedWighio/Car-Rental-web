"use client"
import Link from "next/link"
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import ProductCard from "./ProductCard";
import { useCart } from "./cartContext";


interface Car {
    id: string;
    slug: string;
    title: string;
    name: string;
    category: string;
    image: string;
    fuel: string;
    type: string;
    capacity: string;
    price: number;
    discount: number;
}


export default function Recommended() {
    const [data, setData] = useState<Car[] | undefined>([]);
    const [loading, setLoading] = useState(true);
    const { addToRent, removeFromRent, isInRent } = useCart();

    const handleAddToCart = (slug: string): void => {
        if (isInRent(slug)) {
            removeFromRent(slug);
        } else {
            addToRent(slug);
        }
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await client.fetch(
                    `*[_type == "recommended"]{
                    _id,
                    "slug": slug.current,
                    title,
                    category,
                    image,
                    fuel,
                    type,
                    capacity,
                    price,
                    discount
                  }`
                );
                setData(response);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        getData();
    }, []);

    if (loading) {
        return <div className="bg-[#F6F7F9] h-auto text-center text-xl sm:text-2xl font-semibold pb-10 min-h-[40vh] md:min-h-[70vh] flex items-center justify-center">Loading...</div>;
    }

    if (!data || data.length === 0) {
        return <div className="bg-[#F6F7F9] h-auto text-center text-base sm:text-lg font-semibold pb-10 px-4">No Recommended items found.</div>;
    }

    return (
        <>
            <main className="w-full h-auto bg-[#F6F7F9] py-4 sm:py-6 pb-8 sm:pb-12">
                <div className="mx-4 sm:mx-8 lg:mx-20">
                    <h1 className="text-[14px] sm:text-[16px] text-[#90A3BF] font-semibold px-4 py-4 sm:py-6">Recommendation Car</h1>
                    <div className="place-items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">

                    {data?.length ? (
                            data?.map((car: Car) => {
                                return (
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
                                    link={`/billing/${car.slug}`}
                                    link2={`/details/${car.slug}`}
                                    onAddToCart={() => handleAddToCart(car.slug)}
                                    isInCart={isInRent(car.slug)}
                                />
                                );
                            })) : (<p className="text-center font-semibold text-lg">Connect your internet</p>)}
                    </div>
                    <div className="flex justify-between items-center pt-5 md:pt-8 lg:pt-10 px-4">
                        <button className="px-4 sm:px-6 py-3 cursor-pointer"></button>
                        <Link href="/category/"><button className="px-4 sm:px-6 py-2 sm:py-3 bg-[#3563E9] hover:bg-[#2851c7] text-white font-semibold shadow-md text-sm sm:text-base rounded-lg transition-colors">Show more car</button></Link>
                        <Link href="/category/"><button className="text-[#90A3BF] text-xs sm:text-sm md:text-base font-medium hover:text-[#3563E9] transition-colors">120 Cars</button></Link>
                    </div>
                </div>
            </main>
        </>
    )
}
