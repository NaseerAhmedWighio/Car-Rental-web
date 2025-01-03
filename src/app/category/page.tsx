"use client"
import { useState } from "react"
import type { StaticImageData } from "next/image";
import Link from "next/link"

interface Car {
    id: number;
    image: StaticImageData;
    name: string;
    category: string;
    fuel: number;
    mode: string;
    capacity: number;
    price: number;
}

import Image from "next/image"

import Header from "../Components/Header"
import crv from "@/Public/crv.png"
import crvblack from "@/Public/crvblack.png"
import mgexcite from "@/Public/mgexcite.png"
import mgzs from "@/Public/mgzs.png"

import newrush from "@/Public/newrush.png"
import newterios from "@/Public/newterios.png"
// import Selector from "@/app/Components/Selector";
import CategoryTag from "../Components/CategoryTag"

export default function Category() {

    type LikedItemsState = { [key: string]: boolean }; // Define the shape of the state

    const [likedItems, setLikedItems] = useState<LikedItemsState>({}); // Use this type for the state

    const toggleLike = (id: string) => {
        setLikedItems((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const Recomended_list: Car[] = [
        {
            id: 1,
            image: newrush,
            name: "All New Rush",
            category: "SUV",
            fuel: 70,
            mode: "Manual",
            capacity: 6,
            price: 72,
        },
        {
            id: 2,
            image: crv,
            name: "CR - V",
            category: "SUV",
            fuel: 80,
            mode: "Manual",
            capacity: 6,
            price: 80,

        },
        {
            id: 3,
            image: newterios,
            name: "All New Terios",
            category: "SUV",
            fuel: 90,
            mode: "Manual",
            capacity: 6,
            price: 74,
        },
        {
            id: 4,
            image: crvblack,
            name: "CR - V",
            category: "SUV",
            fuel: 80,
            mode: "Manual",
            capacity: 6,
            price: 80,

        },
        {
            id: 5,
            image: mgexcite,
            name: "MG ZX Exclusive",
            category: "Hatchback",
            fuel: 70,
            mode: "Manual",
            capacity: 4,
            price: 76,
        },
        {
            id: 6,
            image: mgzs,
            name: "New MG ZS",
            category: "SUV",
            fuel: 80,
            mode: "Manual",
            capacity: 6,
            price: 80,
        },
        {
            id: 7,
            image: mgexcite,
            name: "MG ZX Excite",
            category: "Hatchback",
            fuel: 90,
            mode: "Manual",
            capacity: 4,
            price: 74,

        },
        {
            id: 8,
            image: mgexcite,
            name: "New MG ZS",
            category: "SUV",
            fuel: 80,
            mode: "Manual",
            capacity: 6,
            price: 80,
        },
    ]


    return (
        <>
            <Header />
            <main className="w-full h-auto bg-[#F6F7F9]">
                <div className="flex justify-center">
                <div className="hidden xl:block w-0 xl:w-[20%] h-auto bg-white p-10">
                    <CategoryTag />
                </div>


                <div className="px-5 md:px-8 lg:px-10 py-10">

                    <div className="grid grid-cols-1 -space-y-4 lg:space-y-0 lg:-space-x-4 lg:flex lg:justify-center place-items-center">
                        <div className="lg:w-[45%] w-full lg:px-12 md:px-5 px-1 lg:py-9 py-5 lg:h-44 h-32 bg-white rounded-lg space-y-5 shadow-md">
                            <div className="flex w-full lg:gap-4 gap-2 ml-2 lg:ml-0">
                                <input type="radio" id="pick"/>
                                <label htmlFor="pick" className="text-[#1A202C] lg:text-[16px] text-xs font-semibold">Pick - Up</label>
                            </div>
                            <div className="flex justify-between items-center text-[#1A202C]">
                                <div className="lg:w-40 w-auto space-y-2" >
                                    <h2 className="lg:text-[16px] text-xs font-bold ml-[4px]">Location</h2>
                                    <div className="text-[#90A3BF] lg:text-[12px] text-[10px] font-medium">
                                        <select className="bg-transparent outline-none" name="city" id="city">
                                            {[
                                                { value: "none", label: "Select your city" },
                                                { value: "khi", label: "Karachi" },
                                                { value: "hyd", label: "Hyderabad" },
                                                { value: "lhr", label: "Lahore" },
                                                { value: "qta", label: "Quetta" },
                                                { value: "isb", label: "Islamabad" },
                                                { value: "nbs", label: "Nawabshah" },
                                            ].map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="w-10 px-1">
                                    <div className="w-[1px] h-10 lg:h-14 bg-[#C3D4E9] opacity-60">
                                    </div>
                                </div>
                                <div className="lg:w-40 w-auto space-y-2" >
                                    <h2 className="lg:text-[16px] text-xs font-bold">Date</h2>
                                    <div className="flex justify-between text-[#90A3BF] lg:text-[12px] text-[10px] font-medium">
                                        <input className="bg-transparent outline-none" type="date" id="f-day" name="from-date" min="2024-12-11" max="2025-12-10" />
                                    </div>
                                </div>
                                <div className="w-10 px-1">
                                    <div className="w-[1px] lg:h-14 h-10 bg-[#C3D4E9] opacity-60">
                                    </div>
                                </div>
                                <div className="lg:w-40 w-auto space-y-2" >
                                    <h2 className="lg:text-[16px] text-xs font-bold">Time</h2>
                                    <div className="flex justify-between text-[#90A3BF] text-[12px] font-medium">
                                        <input className="outline-none bg-transparent" type="time" id="time" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center items-center rounded-lg shadow-md z-50 w-[50px] h-[50px] md:w-[60px] md:h-[60px] text-white bg-[#3563E9]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.16124 3.83628L7.16124 17.4541" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3.0837 7.92862L7.16148 3.83595L11.2393 7.92862" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M17.089 20.167L17.089 6.54921" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M21.167 16.0713L17.0892 20.168L13.0114 16.0713" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        <div className="lg:w-[45%] w-full lg:px-12 md:px-5 px-1 lg:py-9 py-5 lg:h-44 h-32 bg-white rounded-lg space-y-5 shadow-md">
                            <div className="flex w-full lg:gap-4 gap-2 ml-2 lg:ml-0">
                                <input type="radio" id="drop"/>
                                <label htmlFor="drop" className="text-[#1A202C] lg:text-[16px] text-xs font-semibold">Drop - Off</label>
                            </div>
                            <div className="flex justify-between items-center text-[#1A202C]">
                                <div className="lg:w-40 w-auto space-y-2" >
                                    <h2 className="lg:text-[16px] text-xs font-bold ml-[4px]">Location</h2>
                                    <div className="text-[#90A3BF] lg:text-[12px] text-[10px] font-medium">
                                        <select className="bg-transparent outline-none" name="city" id="city">
                                            {[
                                                { value: "none", label: "Select your city" },
                                                { value: "khi", label: "Karachi" },
                                                { value: "hyd", label: "Hyderabad" },
                                                { value: "lhr", label: "Lahore" },
                                                { value: "qta", label: "Quetta" },
                                                { value: "isb", label: "Islamabad" },
                                                { value: "nbs", label: "Nawabshah" },
                                            ].map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="w-10 px-1">
                                    <div className="w-[1px] h-10 lg:h-14 bg-[#C3D4E9] opacity-60">
                                    </div>
                                </div>
                                <div className="lg:w-40 w-auto space-y-2" >
                                    <h2 className="lg:text-[16px] text-xs font-bold">Date</h2>
                                    <div className="flex justify-between text-[#90A3BF] lg:text-[12px] text-[10px] font-medium">
                                        <input className="bg-transparent outline-none" type="date" id="f-day" name="from-date" min="2024-12-11" max="2025-12-10" />
                                    </div>
                                </div>
                                <div className="w-10 px-1">
                                    <div className="w-[1px] lg:h-14 h-10 bg-[#C3D4E9] opacity-60">
                                    </div>
                                </div>
                                <div className="lg:w-40 w-auto space-y-2" >
                                    <h2 className="lg:text-[16px] text-xs font-bold">Time</h2>
                                    <div className="flex justify-between text-[#90A3BF] text-[12px] font-medium">
                                        <input className="outline-none bg-transparent" type="time" id="time" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="place-items-center my-10">
                        <div className="place-items-center grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-10 lg:grid-cols-3 2xl:grid-cols-4 lg:gap-20">
                            {
                                Recomended_list.map((car) => {
                                    const isLiked = likedItems[car.id];
                                    return (
                                        <div
                                            key={car.id}
                                            className="min-w-[270px] md:min-w-[250px] md:max-w-[300px] h-auto p-5 bg-white rounded-lg shadow-md space-y-6 md:space-y-28"
                                        >
        
                                            {/* Header Section */}
                                            <div className="flex justify-between items-center">
                                                <h1 className="text-[18px] font-bold text-[#1A202C]">
                                                    {car.name}
                                                    <br />
                                                    <span className="text-[14px] text-[#90A3BF]">{car.category}</span>
                                                </h1>
                                                <svg
                                                    onClick={() => toggleLike(car.id.toString())}
                                                    className="cursor-pointer"
                                                    id="heart-icon"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill={isLiked ? "red" : "none"}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M12.62 20.8096C12.28 20.9296 11.72 20.9296 11.38 20.8096C8.48 19.8196 2 15.6896 2 8.68961C2 5.59961 4.49 3.09961 7.56 3.09961C9.38 3.09961 10.99 3.97961 12 5.33961C13.01 3.97961 14.63 3.09961 16.44 3.09961C19.51 3.09961 22 5.59961 22 8.68961C22 15.6896 15.52 19.8196 12.62 20.8096Z"
                                                        stroke={isLiked ? "red" : "#90A3BF"}
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </div>
        
                                            {/* Image and Features Section */}
                                            <div className="flex flex-row md:flex-col items-center gap-5">
                                                <Image
                                                    className="md:w-[400px] w-[150px] h-auto object-cover rounded-md"
                                                    src={car.image}
                                                    alt={car.name}
                                                />
                                                <div className="flex flex-col md:hidden justify-between h-full items-start gap-12">
                                                    <div className="flex gap-1">
                                                        <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M21.34 7.33L19.34 6.33C18.97 6.15 18.51 6.29 18.33 6.66C18.14 7.04 18.29 7.49 18.66 7.67L20.25 8.46V13.25L16.5 13.26V3C16.5 1 15.16 0 13.5 0H5.5C3.84 0 2.5 1 2.5 3V19.25H1C0.59 19.25 0.25 19.59 0.25 20C0.25 20.41 0.59 20.75 1 20.75H18C18.41 20.75 18.75 20.41 18.75 20C18.75 19.59 18.41 19.25 18 19.25H16.5V14.76L21 14.75C21.42 14.75 21.75 14.41 21.75 14V8C21.75 7.72 21.59 7.46 21.34 7.33ZM5 4.89C5 3.5 5.85 3 6.89 3H12.12C13.15 3 14 3.5 14 4.89V6.12C14 7.5 13.15 8 12.11 8H6.89C5.85 8 5 7.5 5 6.11V4.89ZM5.5 10.25H8.5C8.91 10.25 9.25 10.59 9.25 11C9.25 11.41 8.91 11.75 8.5 11.75H5.5C5.09 11.75 4.75 11.41 4.75 11C4.75 10.59 5.09 10.25 5.5 10.25Z" fill="#90A3BF" />
                                                        </svg>
                                                        <p className="text-[16px] text-[#90A3BF] font-medium">{car.fuel}L</p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.53 2 12 2Z" fill="#90A3BF" />
                                                            <rect x="4" y="4" width="16" height="16" rx="8" fill="white" />
                                                            <path d="M12 6C8.688 6 6 8.688 6 12C6 15.312 8.688 18 12 18C15.312 18 18 15.312 18 12C18 8.688 15.318 6 12 6Z" fill="#90A3BF" />
                                                            <rect x="8" y="8" width="8" height="8" rx="4" fill="white" />
                                                            <rect x="11" y="17" width="2" height="4" fill="#90A3BF" />
                                                            <rect x="17" y="11" width="4" height="2" fill="#90A3BF" />
                                                            <rect x="3" y="11" width="4" height="2" fill="#90A3BF" />
                                                        </svg>
                                                        <p className="text-[16px] text-[#90A3BF] font-medium">{car.mode}</p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9 2C6.38 2 4.25 4.13 4.25 6.75C4.25 9.32 6.26 11.4 8.88 11.49C8.96 11.48 9.04 11.48 9.1 11.49C9.12 11.49 9.13 11.49 9.15 11.49C9.16 11.49 9.16 11.49 9.17 11.49C11.73 11.4 13.74 9.32 13.75 6.75C13.75 4.13 11.62 2 9 2Z" fill="#90A3BF" />
                                                            <path d="M14.08 14.1499C11.29 12.2899 6.73996 12.2899 3.92996 14.1499C2.65996 14.9999 1.95996 16.1499 1.95996 17.3799C1.95996 18.6099 2.65996 19.7499 3.91996 20.5899C5.31996 21.5299 7.15996 21.9999 8.99996 21.9999C10.84 21.9999 12.68 21.5299 14.08 20.5899C15.34 19.7399 16.04 18.5999 16.04 17.3599C16.03 16.1299 15.34 14.9899 14.08 14.1499Z" fill="#90A3BF" />
                                                            <path d="M19.9904 7.3401C20.1504 9.2801 18.7704 10.9801 16.8604 11.2101C16.8504 11.2101 16.8504 11.2101 16.8404 11.2101H16.8104C16.7504 11.2101 16.6904 11.2101 16.6404 11.2301C15.6704 11.2801 14.7804 10.9701 14.1104 10.4001C15.1404 9.4801 15.7304 8.1001 15.6104 6.6001C15.5404 5.7901 15.2604 5.0501 14.8404 4.4201C15.2204 4.2301 15.6604 4.1101 16.1104 4.0701C18.0704 3.9001 19.8204 5.3601 19.9904 7.3401Z" fill="#90A3BF" />
                                                            <path d="M21.9902 16.5904C21.9102 17.5604 21.2902 18.4004 20.2502 18.9704C19.2502 19.5204 17.9902 19.7804 16.7402 19.7504C17.4602 19.1004 17.8802 18.2904 17.9602 17.4304C18.0602 16.1904 17.4702 15.0004 16.2902 14.0504C15.6202 13.5204 14.8402 13.1004 13.9902 12.7904C16.2002 12.1504 18.9802 12.5804 20.6902 13.9604C21.6102 14.7004 22.0802 15.6304 21.9902 16.5904Z" fill="#90A3BF" />
                                                        </svg>
                                                        <p className="text-[16px] text-[#90A3BF] font-medium">{car.capacity}People</p>
                                                    </div>
                                                </div>
                                            </div>
                                             {/* Footer Section */}
                                             <div className="space-y-5">
                                            <div className="hidden md:flex justify-between">
                                                        <div className="flex gap-1 ">
                                                            <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M21.34 7.33L19.34 6.33C18.97 6.15 18.51 6.29 18.33 6.66C18.14 7.04 18.29 7.49 18.66 7.67L20.25 8.46V13.25L16.5 13.26V3C16.5 1 15.16 0 13.5 0H5.5C3.84 0 2.5 1 2.5 3V19.25H1C0.59 19.25 0.25 19.59 0.25 20C0.25 20.41 0.59 20.75 1 20.75H18C18.41 20.75 18.75 20.41 18.75 20C18.75 19.59 18.41 19.25 18 19.25H16.5V14.76L21 14.75C21.42 14.75 21.75 14.41 21.75 14V8C21.75 7.72 21.59 7.46 21.34 7.33ZM5 4.89C5 3.5 5.85 3 6.89 3H12.12C13.15 3 14 3.5 14 4.89V6.12C14 7.5 13.15 8 12.11 8H6.89C5.85 8 5 7.5 5 6.11V4.89ZM5.5 10.25H8.5C8.91 10.25 9.25 10.59 9.25 11C9.25 11.41 8.91 11.75 8.5 11.75H5.5C5.09 11.75 4.75 11.41 4.75 11C4.75 10.59 5.09 10.25 5.5 10.25Z" fill="#90A3BF" />
                                                            </svg>
                                                            <p className="text-[16px] text-[#90A3BF] font-medium">{car.fuel}L</p>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.53 2 12 2Z" fill="#90A3BF" />
                                                                <rect x="4" y="4" width="16" height="16" rx="8" fill="white" />
                                                                <path d="M12 6C8.688 6 6 8.688 6 12C6 15.312 8.688 18 12 18C15.312 18 18 15.312 18 12C18 8.688 15.318 6 12 6Z" fill="#90A3BF" />
                                                                <rect x="8" y="8" width="8" height="8" rx="4" fill="white" />
                                                                <rect x="11" y="17" width="2" height="4" fill="#90A3BF" />
                                                                <rect x="17" y="11" width="4" height="2" fill="#90A3BF" />
                                                                <rect x="3" y="11" width="4" height="2" fill="#90A3BF" />
                                                            </svg>
                                                            <p className="text-[16px] text-[#90A3BF] font-medium">{car.mode}</p>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M9 2C6.38 2 4.25 4.13 4.25 6.75C4.25 9.32 6.26 11.4 8.88 11.49C8.96 11.48 9.04 11.48 9.1 11.49C9.12 11.49 9.13 11.49 9.15 11.49C9.16 11.49 9.16 11.49 9.17 11.49C11.73 11.4 13.74 9.32 13.75 6.75C13.75 4.13 11.62 2 9 2Z" fill="#90A3BF" />
                                                                <path d="M14.08 14.1499C11.29 12.2899 6.73996 12.2899 3.92996 14.1499C2.65996 14.9999 1.95996 16.1499 1.95996 17.3799C1.95996 18.6099 2.65996 19.7499 3.91996 20.5899C5.31996 21.5299 7.15996 21.9999 8.99996 21.9999C10.84 21.9999 12.68 21.5299 14.08 20.5899C15.34 19.7399 16.04 18.5999 16.04 17.3599C16.03 16.1299 15.34 14.9899 14.08 14.1499Z" fill="#90A3BF" />
                                                                <path d="M19.9904 7.3401C20.1504 9.2801 18.7704 10.9801 16.8604 11.2101C16.8504 11.2101 16.8504 11.2101 16.8404 11.2101H16.8104C16.7504 11.2101 16.6904 11.2101 16.6404 11.2301C15.6704 11.2801 14.7804 10.9701 14.1104 10.4001C15.1404 9.4801 15.7304 8.1001 15.6104 6.6001C15.5404 5.7901 15.2604 5.0501 14.8404 4.4201C15.2204 4.2301 15.6604 4.1101 16.1104 4.0701C18.0704 3.9001 19.8204 5.3601 19.9904 7.3401Z" fill="#90A3BF" />
                                                                <path d="M21.9902 16.5904C21.9102 17.5604 21.2902 18.4004 20.2502 18.9704C19.2502 19.5204 17.9902 19.7804 16.7402 19.7504C17.4602 19.1004 17.8802 18.2904 17.9602 17.4304C18.0602 16.1904 17.4702 15.0004 16.2902 14.0504C15.6202 13.5204 14.8402 13.1004 13.9902 12.7904C16.2002 12.1504 18.9802 12.5804 20.6902 13.9604C21.6102 14.7004 22.0802 15.6304 21.9902 16.5904Z" fill="#90A3BF" />
                                                            </svg>
                                                            <p className="text-[16px] text-[#90A3BF] font-medium">{car.capacity}People</p>
                                                        </div>
                                                        {/* </div> */}
                                                    </div>
                                            <div className="flex justify-between items-center">
                                                <h2 className="text-[20px] font-bold text-[#1A202C]">
                                                    ${car.price}.00/
                                                    <span className="text-[16px] text-[#90A3BF]">day</span>
                                                </h2>
                                                <Link href="../details">
                                                    <button className="px-4 py-2 bg-[#3563E9] text-white font-semibold rounded-lg">
                                                        Rent Now
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
                </div>
            </main>
        </>
    )
}