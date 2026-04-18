"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import ProductCard from "./ProductCard";
import { useCart } from "./cartContext"; // Import the context
import router from "next/router";

interface Car {
    _id?: string;
    id?: string;
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

export default function Popular() {
    const [data, setData] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToRent, removeFromRent, isInRent } = useCart();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await client.fetch(
                    `*[_type == "popular"]{
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
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddToCart = (slug: string): void => {
        if (isInRent(slug)) {
            removeFromRent(slug);
        } else {
            addToRent(slug);
        }
    };

    return (
        <main className="w-full h-auto bg-[#F6F7F9] pt-16">
            <div className="mx-4 sm:mx-5 md:mx-8 lg:mx-20">
                <div className="flex justify-between items-center px-2 sm:px-4">
                    <h1 className="text-[14px] sm:text-[16px] text-[#90A3BF] font-semibold">Popular Car</h1>
                    <Link href="/category/">
                        <button className="text-[#3563E9] text-[14px] sm:text-[16px] font-semibold hover:text-[#2851c7] transition-colors">View All</button>
                    </Link>
                </div>

                {/* Mobile/Tablet: Horizontal scroll | Desktop: Grid */}
                <div className="lg:hidden w-full flex overflow-x-auto gap-4 sm:gap-6 py-6 sm:py-8 px-2 sm:px-4 snap-x snap-mandatory scrollbar-hide">
                    {loading ? (
                        <p className="text-center text-xl sm:text-2xl font-semibold py-40 uppercase w-full min-h-[40vh] md:min-h-[70vh] flex items-center justify-center">Loading...</p>
                    ) : data?.length > 0 ? (
                        data.map((car) => (
                            <div key={car.slug} className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start">
                                
                                <ProductCard
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
                                
                            </div>
                        ))
                    ) : (
                        <p className="text-center font-semibold text-lg sm:text-xl w-full">No cars available</p>
                    )}
                </div>

                {/* Desktop: Grid (4 cards on xl, responsive below) */}
                <div className="hidden lg:block">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 py-6 sm:py-8 justify-items-center">
                        {loading ? (
                            <p className="text-center text-xl sm:text-2xl font-semibold py-40 uppercase col-span-full min-h-[40vh] md:min-h-[70vh] flex items-center justify-center">Loading...</p>
                        ) : data?.length > 0 ? (
                            data.map((car) => (
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
                            ))
                        ) : (
                            <p className="text-center font-semibold text-lg col-span-full">No cars available</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
