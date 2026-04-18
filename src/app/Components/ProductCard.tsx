import React from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Fuel from "../../../public/Fuel"
import { GoHeart, GoHeartFill } from "react-icons/go";
import Persons from "../../../public/Persons";
import Stearing from "../../../public/Stearing";
import router from "next/router";

interface Car {
    id?: string;
    slug: string;
    title: string;
    category: string;
    image: string;
    fuel: string;
    type: string;
    capacity: string;
    price: number;
    discount?: number;
    link: string;
    link2: string;
    onAddToCart?: () => void;
    isInCart?: boolean;
}


export default function ProductCard({ slug, title, category, image, fuel, type, capacity, price, link, link2, onAddToCart, isInCart, }: Car) {

    return (
        <div
            className="w-full max-w-[330px] h-auto p-4 sm:p-5 bg-white rounded-lg shadow-md space-y-7 hover:scale-105 transition-transform duration-300 ease-in-out"
        >
            <Link href={link2 || "/"}>
            {/* Header Section */}
            <div className="flex justify-between items-start">
                <h1 className="text-[14px] sm:text-[16px] md:text-[18px] font-bold text-[#1A202C] leading-tight">
                    {title}
                    <br />
                    <span className="text-[11px] sm:text-[12px] md:text-[14px] text-[#90A3BF] font-normal">{category}</span>
                </h1>
                <button
                    onClick={onAddToCart}
                    className="cursor-pointer p-1.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                    aria-label={isInCart ? "Remove from favorites" : "Add to favorites"}
                >
                    {isInCart ? (
                        <GoHeartFill className="text-red-800 w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                        <GoHeart className="text-red-800 w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                </button>
            </div>

            {/* Image and Features Section */}
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-2">
                <div className="w-full lg:flex-1 h-[160px] md:h-[180px] flex justify-center items-center">
                    <Image
                        className="w-full h-full object-contain"
                        src={image ? urlFor(image).url() : "/fallback-image.jpg"}
                        alt={title || "Car image"}
                        width={280}
                        height={160}
                        onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
                    />
                </div>
                <div className="flex flex-row lg:flex-col justify-between px-1 lg:px-0">
                    <div className="flex items-center gap-1.5">
                        <Fuel />
                        <p className="text-[12px] sm:text-[14px] lg:text-[15px] text-[#90A3BF] font-medium whitespace-nowrap">{fuel}L</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Stearing />
                        <p className="text-[12px] sm:text-[14px] lg:text-[15px] text-[#90A3BF] font-medium whitespace-nowrap">{type}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Persons />
                        <p className="text-[12px] sm:text-[14px] lg:text-[15px] text-[#90A3BF] font-medium whitespace-nowrap">{capacity} People</p>
                    </div>
                </div>
            </div>
            </Link>

            {/* Footer Section */}
            <div className="space-y-3 sm:space-y-4 pt-1">
                <div className="flex justify-between items-center">
                    <h2 className="text-[16px] sm:text-[18px] md:text-[20px] font-bold text-[#1A202C]">
                        ${price}.00/
                        <span className="text-[12px] sm:text-[14px] md:text-[16px] text-[#90A3BF] font-normal">day</span>
                    </h2>
                    <Link href={link}>
                        <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#3563E9] text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-[#2851c7] transition-colors whitespace-nowrap">
                            Rent Now
                        </button>
                    </Link>
                </div>
            </div>
        </div >
    // </Link>
    );
}