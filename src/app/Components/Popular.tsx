"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import ProductCard from "./ProductCard";
import { useCart } from "./cartContext"; // Import the context

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
    const { cartSlugs, addToCart, removeFromCart } = useCart(); // Use context

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
        if (cartSlugs.has(slug)) {
            removeFromCart(slug); // Remove if already in the cart
        } else {
            addToCart(slug); // Add to the cart
        }
    };

    return (
        <main className="w-full h-auto bg-[#F6F7F9] pt-16">
            <div className="mx-5 md:mx-8 lg:mx-20">
                <div className="flex justify-between items-center px-4">
                    <h1 className="text-[16px] text-[#90A3BF] font-semibold">Popular Car</h1>
                    <Link href="../category/">
                        <button className="text-[#3563E9] text-[16px] font-semibold">View All</button>
                    </Link>
                </div>
                <div className="w-full flex xl:justify-center overflow-x-auto gap-[65px] py-8 scrollbar-hidden">
                    {loading ? (
                        <p className="text-center text-2xl font-semibold py-44 uppercase">Loading...</p>
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
                                link={`../details/${car.slug}`}
                                onAddToCart={() => handleAddToCart(car.slug)}
                                isInCart={cartSlugs.has(car.slug)} // Check if in cart
                            />
                        ))
                    ) : (
                        <p className="text-center font-semibold text-xl">No cars available</p>
                    )}
                </div>
            </div>
        </main>
    );
}
