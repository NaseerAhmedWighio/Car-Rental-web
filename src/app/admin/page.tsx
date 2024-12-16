"use client"

import Image from "next/image"
import AdminHeader from "../Components/AdminHeader"
import Look from "@/Public/Look.png"
import Dashboard from "../Components/Dashboard";
// import chart from "../Components/chart"

import koeng from "@/Public/Koeng.png"
import gtr from "@/Public/gtr.png"
import rollsr from "@/Public/rollsr.png"
import Charts from "../charts/Charts";


export default function Admin() {


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

    return (
        <>
            <AdminHeader />
            <main className="w-full h-auto bg-[#F6F7F9]">
                <div className="flex">
                    <div className="hidden xl:block xl:w-1/4 xl:h-auto bg-white p-10">
                        <Dashboard />
                    </div>

                    <div className="px-10 py-5">
                        <div className="lg:flex lg:justify-between gap-5 grid grid-cols-1 ">

                            <div className="relative w-auto h-auto bg-white rounded-lg space-y-5 p-5">
                                <h1 className="text-[#1A202C] text-[20px] font-bold">Details Rental</h1>
                                <div className="w-full h-auto">
                                    <svg className="w-full h-full" viewBox="0 0 486 272" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_35_8520)">
                                            <rect width="486" height="272" rx="10" fill="#F6F7F9" />
                                            <path d="M230.5 273C295 142.5 391.909 251.5 506.007 97.4999" stroke="#A6CEF2" strokeWidth="16" strokeLinecap="round" />
                                            <path d="M144.04 150.107L174.391 143.5L192.377 153L204.742 198L217.108 209L226.663 240.311L169.332 256.5L144.04 150.107Z" fill="#A6CEF2" />
                                            <path d="M57 64.6899L123.861 62L140 125.481L57 147V64.6899Z" fill="#A6CEF2" />
                                            <line x1="8" y1="-8" x2="313.27" y2="-8" transform="matrix(0.19443 0.980916 -0.98792 0.154963 214.86 -41)" stroke="white" strokeWidth="16" strokeLinecap="round" />
                                            <line x1="5" y1="-5" x2="316.27" y2="-5" transform="matrix(0.19443 0.980916 -0.98792 0.154963 105.82 -23)" stroke="white" strokeWidth="10" strokeLinecap="round" />
                                            <path d="M502.5 177L97.4756 278.998" stroke="white" strokeWidth="16" strokeLinecap="round" />
                                            <line x1="8" y1="-8" x2="322.378" y2="-8" transform="matrix(0.544406 0.838822 -0.889535 0.456866 309.286 -41)" stroke="white" strokeWidth="16" strokeLinecap="round" />
                                            <path d="M-16.5 171.5C149.023 114.177 302.973 83.4419 488.623 87.9815" stroke="white" strokeWidth="16" strokeLinecap="round" />
                                            <path d="M423.225 113L392.81 128L368.079 158.5L423.224 417.371" stroke="white" strokeWidth="10" strokeLinecap="round" />
                                            <path d="M154.156 209.403L137.299 218.683L123.904 238.053L159.347 406.031" stroke="white" strokeWidth="10" strokeLinecap="round" />
                                            <path d="M149.661 148.5L174.953 142.5L194.626 153L204.743 199.5L218.794 209L227.787 242" stroke="white" strokeWidth="8" strokeLinecap="round" />
                                            <path d="M388.038 128.439L360.995 90.9845" stroke="white" strokeWidth="10" strokeLinecap="round" />
                                            <path d="M265.445 145L300.293 131.5L308.724 96.5" stroke="white" strokeWidth="10" strokeLinecap="round" />
                                            <path d="M244.087 40.0466L287.928 37.5L325.586 57L338.513 85" stroke="white" strokeWidth="10" strokeLinecap="round" />
                                            <path d="M100.199 180.833L90.082 140.317" stroke="white" strokeWidth="10" strokeLinecap="round" />
                                            <path d="M133.923 221.833L123.806 181.317" stroke="white" strokeWidth="10" strokeLinecap="round" />
                                            <path d="M209.962 199.943L268.699 188" stroke="white" strokeWidth="10" strokeLinecap="round" />
                                            <path d="M122.99 16.9717L155.23 11.0006" stroke="white" strokeWidth="10" strokeLinecap="round" />
                                            <path d="M52.025 144.962L51.8159 69.0155" stroke="white" strokeWidth="10" strokeLinecap="round" />
                                            <path d="M195.577 151.335L225.539 140.5" stroke="white" strokeWidth="10" strokeLinecap="round" />
                                            <path d="M198.542 108.037L192.615 83.8928L170.951 73.248L147.975 -32.0002" stroke="white" strokeWidth="10" strokeLinecap="round" />
                                            <path d="M228.566 137.663L249.145 116.5" stroke="white" strokeWidth="10" strokeLinecap="round" />
                                            <path d="M230.598 143.202L257.752 150.403" stroke="white" strokeWidth="10" strokeLinecap="round" />
                                            <path d="M314.345 44.5L352.178 21.4032" stroke="white" strokeWidth="10" strokeLinecap="round" />
                                            <path d="M289.052 35L289.052 -20.5" stroke="white" strokeWidth="10" strokeLinecap="round" />
                                            <path d="M-46 73L185.633 53" stroke="white" strokeWidth="10" strokeLinecap="round" />
                                            <path d="M144.83 167.001L72.0002 196L44.9998 274.5" stroke="white" strokeWidth="10" strokeLinecap="round" />
                                            <path d="M328 92.9999L257.552 100.707C254.037 101.092 251.615 104.417 252.328 107.88L270.187 194.715L288.874 289.006" stroke="#3563E9" strokeWidth="8" strokeLinecap="round" />
                                            <path d="M337.62 72.45C336.57 67.83 332.54 65.75 329 65.75C329 65.75 329 65.75 328.99 65.75C325.46 65.75 321.42 67.82 320.37 72.44C319.2 77.6 322.36 81.97 325.22 84.72C326.28 85.74 327.64 86.25 329 86.25C330.36 86.25 331.72 85.74 332.77 84.72C335.63 81.97 338.79 77.61 337.62 72.45ZM329 77.46C327.26 77.46 325.85 76.05 325.85 74.31C325.85 72.57 327.26 71.16 329 71.16C330.74 71.16 332.15 72.57 332.15 74.31C332.15 76.05 330.74 77.46 329 77.46Z" fill="#3563E9" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_35_8520">
                                                <rect width="486" height="272" rx="10" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <div className="flex items-center">
                                    <Image src={Look} alt="Car" className="w-44 h-32" />
                                    <div className="flex justify-between items-start px-2 py-5 gap-[160px] lg:gap-[135px]">
                                        <div>
                                            <h1 className="font-bold lg:text-[24px] text-[18px]  text-[#1A202C]">Nissan GT-R</h1>
                                            <div className="flex justify-between gap-[185px]">
                                                <h6 className="text-[14px] text-[#3D5278] font-medium">Sport</h6>
                                                <h6 className="lg:hidden text-[14px] text-[#3D5278] font-medium">#9761</h6>
                                            </div>
                                        </div>
                                        <h6 className="hidden lg:block text-[14px] mt-2 text-[#3D5278] font-medium">#9761</h6>
                                    </div>
                                </div>

                                {/* Pickup Location  */}

                                <div className="w-full h-auto lg:h-44 py-5 bg-white rounded-lg space-y-5">
                                    <div className="flex w-full gap-3">
                                        <input type="radio" />
                                        <h2 className="text-[#1A202C] text-[16px] font-semibold">Pick - Up</h2>
                                    </div>
                                    <div className="lg:flex lg:justify-between lg:items-center text-[#1A202C]">
                                        <div className="lg:w-[40%] w-full">
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
                                        <div className="lg:w-[40%] w-full" >
                                            <h2 className="text-[16px] font-bold">Date</h2>
                                            <div className="bg-[#F6F7F9] lg:bg-transparent rounded-lg sm:w-full sm:h-16 text-[#90A3BF] text-[12px] font-medium p-5">
                                                <input className="bg-[#F6F7F9] rounded-lg lg:bg-transparent outline-none" type="date" id="f-day" name="from-date" min="2024-12-11" max="2025-12-10" />
                                            </div>
                                        </div>
                                        <div className="w-20 hidden lg:block">
                                            <div className="w-[1px] h-14 bg-[#C3D4E9] opacity-40">
                                            </div>
                                        </div>
                                        <div className="lg:w-[40%] w-full" >
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
                                        <input type="radio" />
                                        <h2 className="text-[#1A202C] text-[16px] font-semibold">Drop - Off</h2>
                                    </div>
                                    <div className="lg:flex lg:justify-between lg:items-center text-[#1A202C]">
                                        <div className="lg:w-[40%] w-full">
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
                                        <div className="lg:w-[40%] w-full" >
                                            <h2 className="text-[16px] font-bold">Date</h2>
                                            <div className="bg-[#F6F7F9] lg:bg-transparent rounded-lg sm:w-full sm:h-16 text-[#90A3BF] text-[12px] font-medium p-5">
                                                <input className="bg-[#F6F7F9] rounded-lg lg:bg-transparent outline-none" type="date" id="f-day" name="from-date" min="2024-12-11" max="2025-12-10" />
                                            </div>
                                        </div>
                                        <div className="w-20 hidden lg:block">
                                            <div className="w-[1px] h-14 bg-[#C3D4E9] opacity-40">
                                            </div>
                                        </div>
                                        <div className="lg:w-[40%] w-full" >
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
                                        <h1 className="font-bold text-[20px] w-60 text-[#1A202C]">Total Rental Price</h1>
                                        <h6 className="text-[12px] text-[#90A3BF]  font-medium">Overall price and includes rental discount</h6>
                                    </div>
                                    <h1 className="text-[32px] text-[#1A202C] font-bold">$80.00</h1>
                                </div>

                            </div>


                            <div className="space-y-5">
                                <div className="w-full h-auto bg-white rounded-lg p-5">
                                    <div className="flex justify-between items-center text-[#90A3BF] text-[14px] font-medium">
                                        <h1 className="text-[#1A202C] text-[20px] font-bold">Top 5 Car Rental</h1>
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 rounded-full bg-[#1A202C]" />
                                            <div className="w-2 h-2 rounded-full bg-[#1A202C]" />
                                            <div className="w-2 h-2 rounded-full bg-[#1A202C]" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:flex justify-between items-start gap-4 py-10">
                                        <div className="w-auto lg:px-0 px-[21%]">
                                            <Charts />
                                        </div>
                                        <div className="w-full space-y-10">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4 mr-40">
                                                    <div className="w-3 h-3 rounded-full bg-[#0D3559]" />
                                                    <h2 className="text-[#85A8F8] text-[14px] font-medium">Sport Car</h2>
                                                </div>
                                                <h3 className="text-[#1A202C] text-[14px] font-semibold">17,439</h3>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4 mr-40">
                                                    <div className="w-3 h-3 rounded-full bg-[#175D9C]" />
                                                    <h2 className="text-[#85A8F8] text-[14px] font-medium">SUV</h2>
                                                </div>
                                                <h3 className="text-[#1A202C] text-[14px] font-semibold">9,478</h3>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4 mr-40">
                                                    <div className="w-3 h-3 rounded-full bg-[#2185DE]" />
                                                    <h2 className="text-[#85A8F8] text-[14px] font-medium">Coupe</h2>
                                                </div>
                                                <h3 className="text-[#1A202C] text-[14px] font-semibold">18,197</h3>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4 mr-40">
                                                    <div className="w-3 h-3 rounded-full bg-[#63A9E8]" />
                                                    <h2 className="text-[#85A8F8] text-[14px] font-medium">Hatchback</h2>
                                                </div>
                                                <h3 className="text-[#1A202C] text-[14px] font-semibold">12,510</h3>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4 mr-40">
                                                    <div className="w-3 h-3 rounded-full bg-[#A6CEF2]" />
                                                    <h2 className="text-[#85A8F8] text-[14px] font-medium">MPV</h2>
                                                </div>
                                                <h3 className="text-[#1A202C] text-[14px] font-semibold">14,406</h3>
                                            </div>

                                        </div>
                                    </div>
                                </div>


                                {/* cars  */}
                                <div className="w-auto h-auto bg-white rounded-lg p-5">
                                    <div className="flex justify-between items-center text-[#90A3BF] text-[14px] font-medium">
                                        <h1 className="text-[#1A202C] text-[20px] font-bold">Recent Transaction</h1>
                                        <button className="text-[#3563E9] text-[16px] font-semibold">View All</button>
                                    </div>

                                    <div className="py-12 space-y-10">
                                        {Recent_transaction.map((car) => {
                                            return (
                                                <div key={car.id}>
                                                    <div className="flex items-center justify-between mb-5 max-w-full gap-5">
                                                        <div className="flex gap-5 items-center">
                                                            {/* Image */}
                                                            <Image
                                                                src={car.image}
                                                                className="w-40 h-26"
                                                                alt="rented car"
                                                            />

                                                            <div className="flex flex-col">
                                                                <h2 className="text-[#1A202C] text-[20px] font-bold">
                                                                    {car.name}
                                                                </h2>
                                                                <h3 className="text-[#90A3BF] text-[14px] font-medium">
                                                                    {car.date}
                                                                </h3>
                                                            </div>
                                                        </div>

                                                        <div className="text-right">
                                                            <h3 className="text-[#90A3BF] text-[14px] font-medium">
                                                                {car.category}
                                                            </h3>
                                                            <h2 className="text-[#1A202C] text-[20px] font-bold">
                                                                ${car.price}.00
                                                            </h2>
                                                        </div>
                                                    </div>
                                                    <hr />
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
        </>
    )
}