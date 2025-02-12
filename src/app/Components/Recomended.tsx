"use client"
import Link from "next/link"
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import ProductCard from "./ProductCard";


//     const Recomended_list:Car[] = [
//         {
//             id: 1,
//             image: newrush,
//             name: "All New Rush",
//             category: "SUV",
//             fuel: 70,
//             mode: "Manual",
//             capacity: 6,
//             price: 72,
//         },
//         {
//             id: 2,
//             image: crv,
//             name: "CR - V",
//             category: "SUV",
//             fuel: 80,
//             mode: "Manual",
//             capacity: 6,
//             price: 80,

//         },
//         {
//             id: 3,
//             image: newterios,
//             name: "All New Terios",
//             category: "SUV",
//             fuel: 90,
//             mode: "Manual",
//             capacity: 6,
//             price: 74,
//         },
//         {
//             id: 4,
//             image: crvblack,
//             name: "CR - V",
//             category: "SUV",
//             fuel: 80,
//             mode: "Manual",
//             capacity: 6,
//             price: 80,

//         },
//         {
//             id: 5,
//             image: mgexcite,
//             name: "MG ZX Exclusive",
//             category: "Hatchback",
//             fuel: 70,
//             mode: "Manual",
//             capacity: 4,
//             price: 76,
//         },
//         {
//             id: 6,
//             image: mgzs,
//             name: "New MG ZS",
//             category: "SUV",
//             fuel: 80,
//             mode: "Manual",
//             capacity: 6,
//             price: 80,
//         },
//         {
//             id: 7,
//             image: mgexcite,
//             name: "MG ZX Excite",
//             category: "Hatchback",
//             fuel: 90,
//             mode: "Manual",
//             capacity: 4,
//             price: 74,

//         },
//         {
//             id: 8,
//             image: mgzsgray,
//             name: "New MG ZS",
//             category: "SUV",
//             fuel: 80,
//             mode: "Manual",
//             capacity: 6,
//             price: 80,
//         },
//     ]


interface Car {
    id: string; // Added a fallback for slug if ID is not available
    slug: string;
    title: string;
    name: string;
    category: string;
    image: string; // Updated to handle Sanity image objects
    fuel: string;
    type: string;
    capacity: string;
    price: number;
    discount: number;
}


export default function Recommended() {
    const [data, setData] = useState<Car[] | undefined>([]);
    const [loading, setLoading] = useState(true);
    const [cartSlugs, setCartSlugs] = useState<Set<string>>(new Set());

        // Load cart slugs from localStorage on mount
        useEffect(() => {
            const storedCart = localStorage.getItem("cartSlugs");
            if (storedCart) {
                setCartSlugs(new Set(JSON.parse(storedCart)));
            }
        }, []);
    
        // Handle adding/removing items from the cart
        const handleAddToCart = (slug: string): void => {
            setCartSlugs((prevSlugs) => {
                const updatedSlugs = new Set(prevSlugs);
    
                if (updatedSlugs.has(slug)) {
                    updatedSlugs.delete(slug);
                } else {
                    updatedSlugs.add(slug);
                }
    
                // Update localStorage
                localStorage.setItem("cartSlugs", JSON.stringify([...updatedSlugs]));
                return updatedSlugs;
            });
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
        return <div className="bg-[#F6F7F9] h-auto text-center text-2xl font-semibold pb-5"></div>;
    }

    if (!data || data.length === 0) {
        return <div className="bg-[#F6F7F9] h-auto text-center text-xl font-semibold pb-5">No Recommended items found.<br/>Connect your internet first</div>;
    }

        // const handleToCart = async (data: Car) => {
    //     const res = fetch("/api/cart", {
    //         method: "POST",
    //         body: JSON.stringify({
    //             product_id: data._id
    //         })
    //     })
    //     const result = (await res).json()
    //     return result
    // }


    

    return (
        <>
            <main className="w-full h-auto bg-[#F6F7F9] py-2 pb-8">
                <div className="mx-4 md:mx-10 lg:mx-20">
                    <h1 className="text-[16px] text-[#90A3BF] font-semibold px-4 py-6">Recomendation Car</h1>
                    <div className="place-items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-10 lg:gap-20">
                        
                    {data?.length ? (
                            data?.map((car: Car) => {
                                return (
                                    <ProductCard
                                    key={car?.slug}
                                    id={car.id}
                                    slug={car?.slug}
                                    title={car.title}
                                    category={car.category}
                                    capacity={car.capacity}
                                    image={car.image}
                                    fuel={car.fuel}
                                    type={car.type}
                                    price={car.price}
                                    discount={car.discount}
                                    link={`../details/${car?.slug}`}
                                    onAddToCart={() => handleAddToCart(car?.slug)}
                                    isInCart={cartSlugs.has(car?.slug)}
                                />
                                );
                            })) : (<p className="text-center font-semibold text-xl">Connect your internet</p>)}
                    </div>
                    <div className="flex justify-between lg:mt-10 md:mt-6 mt-4">
                        <button className="px-10 py-5 cursor-none"></button>
                        <Link href="../category/"><button className="px-6 py-3 bg-[#3563E9] text-white font-semibold shadow-md lg:text-[16px] text-[14px] rounded-lg">Show more car</button></Link>
                        <Link href="../category/"><button className="lg:text-[14px] text-[10px] text-[#90A3BF] font-medium">120 Cars</button></Link>
                    </div>
                </div>
            </main>
        </>
    )
}