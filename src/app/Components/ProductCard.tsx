import React from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Fuel from "../../../public/Fuel"
import { GoHeart, GoHeartFill } from "react-icons/go";
import Persons from "../../../public/Persons";
import Stearing from "../../../public/Stearing";

interface Car {
    id?: string; // Added a fallback for slug if ID is not available
    slug: string;
    title: string;
    category: string;
    image: string; // Updated to handle Sanity image objects
    fuel: string;
    type: string;
    capacity: string;
    price: number;
    discount?: number;
    link: string; // Added optional link prop
    onAddToCart?: () => void;
    isInCart?: boolean;
}


export default function ProductCard({ slug, title, category, image, fuel, type, capacity, price, link, onAddToCart, isInCart, }: Car) {

    return (
        <div
            key={slug}
            className="min-w-[300px] md:min-w-[300px] md:max-w-[330px] h-auto p-5 bg-white rounded-lg shadow-md space-y-6 md:space-y-28 hover:scale-105 transition-transform duration-300 ease-in-out"
        >

            {/* Header Section */}
            <div className="flex justify-between items-start">
                <h1 className="text-[18px] font-bold text-[#1A202C]">
                    {title}
                    <br />
                    <span className="text-[14px] text-[#90A3BF]">{category}</span>
                </h1>
                <div
                    onClick={onAddToCart}
                    className={`cursor-pointer py-2 px-1 ${isInCart
                            ? <GoHeartFill className="text-red-800 w-6 h-6 scale-125 md:scale-150" />
                            : <GoHeart className="text-red-800 w-6 h-6 scale-125 md:scale-150" />
                        }`}
                >
                    {isInCart ? <GoHeartFill className="text-red-800 w-6 h-6 scale-125 md:scale-150" /> : <GoHeart className="text-red-800 w-6 h-6 scale-125 md:scale-150"/>}
                </div>
            </div>

            {/* Image and Features Section */}
            <div className="flex flex-row md:flex-col justify-between items-center gap-5">
                <div className="h-[180px] md:h-[40%] flex flex-col justify-center items-center">
                    <Image
                        className="md:w-[400px] w-[130px] md:h-32 "
                        src={image ? urlFor(image).url() : "/fallback-image.jpg"}
                        alt={slug || "Car image"}
                        width={220}
                        height={400}
                        onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")} // Optional: Fallback for broken URLs
                    />
                </div>
                <div className="flex flex-col md:hidden justify-between mb-7 h-full items-start gap-12">
                    <div className="flex gap-1">
                        <Fuel />
                        <p className="text-[16px] text-[#90A3BF] font-medium">{fuel}L</p>
                    </div>
                    <div className="flex gap-1">
                        <Stearing />
                        <p className="text-[16px] text-[#90A3BF] font-medium">{type}</p>
                    </div>
                    <div className="flex gap-1">
                        <Persons />
                        <p className="text-[16px] text-[#90A3BF] font-medium">{capacity}People</p>
                    </div>
                </div>
            </div>
            {/* Footer Section */}
            <div className="space-y-5">
                <div className="relative hidden md:flex justify-center scale-95 gap-3">
                    <div className="flex gap-1">
                        <Fuel />
                        <p className="text-[16px] text-[#90A3BF] font-medium">{fuel}L</p>
                    </div>
                    <div className="flex gap-1">
                        <Stearing />
                        <p className="text-[16px] text-[#90A3BF] font-medium">{type}</p>
                    </div>
                    <div className="flex gap-1">
                        <Persons />
                        <p className="text-[16px] text-[#90A3BF] font-medium">{capacity}People</p>
                    </div>

                </div>
                <div className="flex justify-between items-center">
                    <h2 className="text-[20px] font-bold text-[#1A202C]">
                        ${price}.00/
                        <span className="text-[16px] text-[#90A3BF]">day</span>
                    </h2>
                    <Link href={link}>
                        <button className="px-4 py-2 bg-[#3563E9] text-white font-semibold rounded-lg">
                            Rent Now
                        </button>
                    </Link>
                </div>
            </div>
        </div >
    );
}

