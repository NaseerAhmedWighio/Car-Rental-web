"use client"

import Image from "next/image"
import Dashboard from "../../Components/Dashboard";
import Chart from "../../Components/Chart"
import dynamic from "next/dynamic";

const InteractiveMap = dynamic(() => import("../../Components/InteractiveMap"), { ssr: false });

import koeng from "@/Public/Koeng.png"
import gtr from "@/Public/gtr.png"
import rollsr from "@/Public/rollsr.png"
import { client } from "@/sanity/lib/client";
import { use, useState, useEffect } from "react";
import { urlFor } from "@/sanity/lib/image";
import Pattern from "@/Public/Pattern.png"

interface Car {
    id: string;
    slug: { current: string };
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
export default function Admin({ params }: { params: Promise<{ slug: string }> }) {
    const Recent_transaction = [
        {
            id: 1,
            image: koeng,
            name: "Koengsegg",
            category: "Sport",
            fuel: 90,
            mode: "Manual",
            capacity: 2,
            price: 99,
            date: "20 July"
        },
        {
            id: 2,
            image: gtr,
            name: "Nissan GT-R",
            category: "Sport",
            fuel: 80,
            mode: "Manual",
            capacity: 2,
            price: 80,
            date: "19 July"
        },
        {
            id: 3,
            image: rollsr,
            name: "Rolls-Royce",
            category: "Sedan",
            fuel: 70,
            mode: "Manual",
            capacity: 4,
            price: 96,
            date: "18 July"
        },
        {
            id: 4,
            image: gtr,
            name: "Nissan GT-R",
            category: "Sport",
            fuel: 80,
            mode: "Manual",
            capacity: 2,
            price: 80,
            date: "17 July"
        },

    ]

    const { slug } = use(params);

    const [fetch, setFetch] = useState<Car | undefined>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);

          // Query for specific item details
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
          }`;
          // Fetch data from Sanity
          const detailResponse = await client.fetch(detailQuery, { slug });

          // Set state
          setFetch(detailResponse?.length > 0 ? detailResponse[0] : undefined);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [slug]);


    if (loading) {
      return <div className="text-center text-2xl font-semibold py-44 uppercase">Loading...</div>; // Add a loading spinner or message here
    }

    if (!fetch) {
      return <div className="flex justify-center items-center text-xl min-h-[40vh] md:min-h-[70vh] font-semibold">Connect your internet first</div>;
    }
    return (
        <main className="w-full h-auto bg-[#F6F7F9]">
                <div className="flex">
                    <div className="hidden xl:block xl:w-1/5 xl:h-auto bg-white p-10">
                        <Dashboard />
                    </div>

                    <div className="w-4/5 lg:px-10 px-5 py-5">
                        <div className="lg:flex lg:justify-between gap-5 grid grid-cols-1">

                            <div className="relative w-auto lg:w-1/2 h-auto bg-white rounded-lg shadow-md space-y-5 p-5">
                                <h1 className="text-[#1A202C] text-[20px] font-bold">Details Rental</h1>
                                <div className="w-full h-[250px] rounded-lg overflow-hidden">
                                    <InteractiveMap />
                                </div>
                                <div className="flex justify-between items-center">
                                        <div className="flex gap-5 items-center">
                                        {/* <Image src={Look} alt="Car" className="w-28 md:w-36 lg:w-44 h-auto" /> */}
                                        <div className="w-24 lg:w-36 h-20 lg:h-28  p-2 shadow-md flex justify-center items-center rounded-lg" style={{backgroundImage : `url(${Pattern.src})`, backgroundSize : "cover"}} >
                                        <Image src={fetch?.image ? urlFor(fetch?.image).url() : "/default-image.jpg"}
                                        alt={fetch?.title || "Product Image"} className="" width={200} height={20} />
                                        </div>
                                        <div>
                                            <h1 className="font-bold lg:text-[24px] md:text-[20px] text-[16px]  text-[#1A202C]">{fetch?.title}</h1>
                                            <h6 className="text-[14px] text-[#3D5278] font-medium">{fetch?.category}</h6>
                                        </div>
                                            </div>
                                        <h6 className="lg:hidden text-[14px] text-right text-[#3D5278] font-medium mb-6 md:mb-0">#9761</h6>
                                    </div>


                                {/* Pickup Location  */}

                                <div className="w-full h-auto lg:h-44 py-5 bg-white rounded-lg space-y-5">
                                    <div className="flex w-full gap-3">
                                        <input type="radio" id="pick"/>
                                        <label htmlFor="pick" className="text-[#1A202C] text-[16px] font-semibold cursor-pointer">Pick - Up</label>
                                    </div>
                                    <div className="lg:flex lg:justify-between lg:items-center space-y-6 lg:space-y-0 text-[#1A202C]">
                                        <div className="lg:w-[40%] w-full space-y-2 lg:space-y-0">
                                            <h2 className="text-[16px] font-bold ">Location</h2>
                                            <div className="bg-[#F6F7F9] lg:bg-transparent rounded-lg sm:w-full sm:h-16 text-[#90A3BF] text-[12px] font-medium p-5">
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
                                        <div className="w-20 hidden lg:block">
                                            <div className="w-[1px] h-14 bg-[#C3D4E9] opacity-40">
                                            </div>
                                        </div>
                                        <div className="lg:w-[40%] w-full space-y-2 lg:space-y-0">
                                            <h2 className="text-[16px] font-bold">Date</h2>
                                            <div className="bg-[#F6F7F9] lg:bg-transparent rounded-lg sm:w-full sm:h-16 text-[#90A3BF] text-[12px] font-medium p-5">
                                                <input className="bg-[#F6F7F9] rounded-lg lg:bg-transparent outline-none" type="date" id="f-day" name="from-date" min="2024-12-11" max="2025-12-10" />
                                            </div>
                                        </div>
                                        <div className="w-20 hidden lg:block">
                                            <div className="w-[1px] h-14 bg-[#C3D4E9] opacity-40">
                                            </div>
                                        </div>
                                        <div className="lg:w-[40%] w-full space-y-2 lg:space-y-0" >
                                            <h2 className="text-[16px] font-bold">Time</h2>
                                            <div className="bg-[#F6F7F9] lg:bg-transparent rounded-lg sm:w-full sm:h-16 text-[#90A3BF] text-[12px] font-medium p-5">
                                                <input className=" bg-[#F6F7F9] lg:bg-transparent rounded-lg outline-none" type="time" id="time" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Drop off Location */}

                                <div className="w-full h-auto lg:h-44 py-5 bg-white rounded-lg space-y-5">
                                    <div className="flex w-full gap-3">
                                        <input type="radio" id="drop"/>
                                        <label htmlFor="drop" className="text-[#1A202C] text-[16px] font-semibold cursor-pointer">Drop - Off</label>
                                    </div>
                                    <div className="lg:flex lg:justify-between lg:items-center text-[#1A202C] space-y-6 lg:space-y-0 ">
                                        <div className="lg:w-[40%] w-full space-y-2 lg:space-y-0">
                                            <h2 className="text-[16px] font-bold ">Location</h2>
                                            <div className="bg-[#F6F7F9] lg:bg-transparent rounded-lg sm:w-full sm:h-16 text-[#90A3BF] text-[12px] font-medium p-5">
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
                                        <div className="w-20 hidden lg:block">
                                            <div className="w-[1px] h-14 bg-[#C3D4E9] opacity-40">
                                            </div>
                                        </div>
                                        <div className="lg:w-[40%] w-full space-y-2 lg:space-y-0" >
                                            <h2 className="text-[16px] font-bold">Date</h2>
                                            <div className="bg-[#F6F7F9] lg:bg-transparent rounded-lg sm:w-full sm:h-16 text-[#90A3BF] text-[12px] font-medium p-5">
                                                <input className="bg-[#F6F7F9] rounded-lg lg:bg-transparent outline-none" type="date" id="f-day" name="from-date" min="2024-12-11" max="2025-12-10" />
                                            </div>
                                        </div>
                                        <div className="w-20 hidden lg:block">
                                            <div className="w-[1px] h-14 bg-[#C3D4E9] opacity-40">
                                            </div>
                                        </div>
                                        <div className="lg:w-[40%] w-full space-y-2 lg:space-y-0" >
                                            <h2 className="text-[16px] font-bold">Time</h2>
                                            <div className="bg-[#F6F7F9] lg:bg-transparent rounded-lg sm:w-full sm:h-16 text-[#90A3BF] text-[12px] font-medium p-5">
                                                <input className=" bg-[#F6F7F9] lg:bg-transparent rounded-lg outline-none" type="time" id="time" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr />

                                <div className="flex justify-between lg:items-center items-start px-2 py-5">
                                    <div className="">
                                        <h1 className="font-bold lg:text-[32px] md:text-[24px] text-[16px] text-[#1A202C]">Total Rental Price</h1>
                                        <h6 className="md:text-[12px] text-[10px] text-[#90A3BF] font-medium">Overall price and includes rental discount</h6>
                                    </div>
                                    <h1 className="lg:text-[32px] md:text-[24px] text-[16px] text-[#1A202C] font-bold">${fetch?.price}.00</h1>
                                </div>

                            </div>


                            <div className="w-full space-y-5">
                                {/* Chart Card */}
                                <div className="w-full bg-white rounded-lg shadow-md p-4 lg:p-5">
                                    <div className="flex justify-between items-center">
                                        <h1 className="text-[#1A202C] text-[14px] sm:text-[16px] lg:text-[18px] font-bold">Top 5 Car Rental</h1>
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#1A202C]" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#1A202C]" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#1A202C]" />
                                        </div>
                                    </div>

                                    <div className="relative flex flex-col lg:flex-row items-center justify-between gap-4 py-4 lg:py-10">
                                        <div className="w-full max-w-[200px] sm:max-w-[250px] lg:max-w-[300px] h-full mx-auto">
                                            <Chart />
                                        </div>
                                        <div className="w-full space-y-3 lg:space-y-6">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2 lg:gap-4">
                                                    <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-[#0D3559] flex-shrink-0" />
                                                    <h2 className="text-[#85A8F8] text-[11px] sm:text-[12px] lg:text-[14px] font-medium">Sport Car</h2>
                                                </div>
                                                <h3 className="text-[#1A202C] text-[11px] sm:text-[12px] lg:text-[14px] font-semibold">17,439</h3>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2 lg:gap-4">
                                                    <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-[#175D9C] flex-shrink-0" />
                                                    <h2 className="text-[#85A8F8] text-[11px] sm:text-[12px] lg:text-[14px] font-medium">SUV</h2>
                                                </div>
                                                <h3 className="text-[#1A202C] text-[11px] sm:text-[12px] lg:text-[14px] font-semibold">9,478</h3>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2 lg:gap-4">
                                                    <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-[#2185DE] flex-shrink-0" />
                                                    <h2 className="text-[#85A8F8] text-[11px] sm:text-[12px] lg:text-[14px] font-medium">Coupe</h2>
                                                </div>
                                                <h3 className="text-[#1A202C] text-[11px] sm:text-[12px] lg:text-[14px] font-semibold">18,197</h3>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2 lg:gap-4">
                                                    <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-[#63A9E8] flex-shrink-0" />
                                                    <h2 className="text-[#85A8F8] text-[11px] sm:text-[12px] lg:text-[14px] font-medium">Hatchback</h2>
                                                </div>
                                                <h3 className="text-[#1A202C] text-[11px] sm:text-[12px] lg:text-[14px] font-semibold">12,510</h3>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2 lg:gap-4">
                                                    <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-[#A6CEF2] flex-shrink-0" />
                                                    <h2 className="text-[#85A8F8] text-[11px] sm:text-[12px] lg:text-[14px] font-medium">MPV</h2>
                                                </div>
                                                <h3 className="text-[#1A202C] text-[11px] sm:text-[12px] lg:text-[14px] font-semibold">14,406</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Cars */}
                                <div className="w-full bg-white rounded-lg shadow-md p-4 lg:p-5">
                                    <div className="flex justify-between items-center">
                                        <h1 className="text-[#1A202C] text-[14px] sm:text-[16px] lg:text-[18px] font-bold">Recent Cars</h1>
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#1A202C]" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#1A202C]" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#1A202C]" />
                                        </div>
                                    </div>
                                    <div className="space-y-4 lg:space-y-5 pt-4 lg:pt-8">
                                        {Recent_transaction.map((car) => {
                                            return (
                                                <div key={car.id} className="border-b last:border-b-0">
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pb-3 lg:pb-4">
                                                        <div className="flex gap-3 lg:gap-4 items-center">
                                                            <Image src={car.image} alt={car.name} className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 flex-shrink-0 object-contain" />
                                                            <div className="space-y-1 min-w-0 flex-1">
                                                                <h2 className="text-[#1A202C] text-[13px] sm:text-[14px] lg:text-[16px] font-bold truncate">{car.name}</h2>
                                                                <p className="text-[#90A3BF] text-[11px] sm:text-[12px] lg:text-[14px] font-medium">{car.category}</p>
                                                                <div className="flex flex-wrap gap-1 sm:gap-2 lg:gap-4 text-[#596780] text-[10px] sm:text-[11px] lg:text-[12px] font-medium">
                                                                    <h2>Fuel: {car.fuel}%</h2>
                                                                    <h2>{car.mode}</h2>
                                                                    <h2>{car.capacity} Person</h2>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-left sm:text-right pl-[60px] sm:pl-0">
                                                            <h2 className="text-[#1A202C] text-[14px] sm:text-[16px] lg:text-[18px] font-bold">
                                                                ${car.price}.00
                                                            </h2>
                                                        </div>
                                                    </div>
                                                   
                                                </div>
                                            );
                                        })}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
    )
}
