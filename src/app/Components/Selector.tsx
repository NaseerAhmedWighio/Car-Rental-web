"use client"

import { useState } from "react";

export default function Selector() {
    const today = new Date();
    const currentDate = today.toISOString().split("T")[0]; // YYYY-MM-DD
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    const nextDate = nextDay.toISOString().split("T")[0]; // YYYY-MM-DD
    const currentHour = today.toTimeString().slice(0, 5); // HH:MM format

    // State for pickup and drop-off details
    const [pickup, setPickup] = useState({
        location: "khi",
        date: currentDate,
        time: currentHour,
    });

    const [dropoff, setDropoff] = useState({
        location: "hyd",
        date: nextDate,
        time: currentHour,
    });

    // Swap Function
    const handleSwap = () => {
        setPickup((prev) => ({
            location: dropoff.location,
            date: prev.date < dropoff.date ? prev.date : dropoff.date, // Ensure pickup date is earlier
            time: dropoff.time,
        }));
        setDropoff((prev) => ({
            location: pickup.location,
            date: prev.date > pickup.date ? prev.date : nextDate, // Ensure drop-off is later
            time: pickup.time,
        }));
    };
    return (
        <>
            <main className="w-full bg-[#F6F7F9]">
                <div className="mx-4 sm:mx-5 md:mx-8 lg:mx-20">
                    <div className="flex flex-col md:flex-row items-center justify-center -space-y-3 md:gap-6">

                        {/* Pick Up */}
                        <div className="w-full md:flex-1 px-3 sm:px-4 lg:px-6 py-4 sm:py-5 lg:py-7 bg-white rounded-lg space-y-3 sm:space-y-4 shadow-md">
                            <div className="flex items-center gap-2">
                                <input type="radio" id="pick" className="accent-[#3563E9] w-4 h-4"/>
                                <label htmlFor="pick" className="text-[#1A202C] text-sm sm:text-base font-semibold">Pick - Up</label>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 text-[#1A202C]">
                                <div className="flex-1 min-w-[60px] space-y-0.5">
                                    <h2 className="text-[11px] sm:text-sm font-bold">Location</h2>
                                    <div className="text-[#90A3BF] text-[10px] sm:text-xs font-medium">
                                        <select value={pickup.location} onChange={(e) => setPickup({ ...pickup, location: e.target.value })} className="bg-transparent outline-none w-full" name="city" id="city">
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
                                <div className="w-px h-6 bg-[#C3D4E9] opacity-60"/>
                                <div className="flex-1 min-w-[60px] space-y-0.5">
                                    <h2 className="text-[11px] sm:text-sm font-bold">Date</h2>
                                    <div className="text-[#90A3BF] text-[10px] sm:text-xs font-medium">
                                        <input
                                         value={pickup.date}
                                         min={currentDate}
                                         onChange={(e) => setPickup({ ...pickup, date: e.target.value })} className="bg-transparent outline-none w-full text-[10px] sm:text-xs" type="date"/>
                                    </div>
                                </div>
                                <div className="w-px h-6 bg-[#C3D4E9] opacity-60"/>
                                <div className="flex-1 min-w-[55px] space-y-0.5">
                                    <h2 className="text-[11px] sm:text-sm font-bold">Time</h2>
                                    <div className="text-[#90A3BF] text-[10px] sm:text-xs font-medium">
                                        <input
                                        value={pickup.time}
                                        onChange={(e) => setPickup({ ...pickup, time: e.target.value })}
                                        className="outline-none bg-transparent w-full text-[10px] sm:text-xs" type="time" id="time"/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Swap Icon */}
                        <div onClick={handleSwap} id="swap-icon" className="flex justify-center items-center rounded-md shadow-zinc-400 shadow-md z-30 md:rotate-90 rotate-0 w-10 h-10 sm:w-12 sm:h-12 text-white bg-[#3563E9] cursor-pointer flex-shrink-0 hover:bg-[#2851c7] transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.16124 3.83628L7.16124 17.4541" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3.0837 7.92862L7.16148 3.83595L11.2393 7.92862" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M17.089 20.167L17.089 6.54921" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M21.167 16.0713L17.0892 20.168L13.0114 16.0713" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        {/* Drop Off */}
                        <div className="w-full md:flex-1 px-3 sm:px-4 lg:px-6 py-4 sm:py-5 lg:py-7 bg-white rounded-lg space-y-3 sm:space-y-4 shadow-md">
                            <div className="flex items-center gap-2">
                                <input type="radio" id="drop" className="accent-[#3563E9] w-4 h-4"/>
                                <label htmlFor="drop" className="text-[#1A202C] text-sm sm:text-base font-semibold">Drop - Off</label>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 text-[#1A202C]">
                                <div className="flex-1 min-w-[60px] space-y-0.5">
                                    <h2 className="text-[11px] sm:text-sm font-bold">Location</h2>
                                    <div className="text-[#90A3BF] text-[10px] sm:text-xs font-medium">
                                        <select value={dropoff.location} onChange={(e) => setDropoff({ ...dropoff, location: e.target.value })} className="bg-transparent outline-none w-full" name="city" id="city">
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
                                <div className="w-px h-6 bg-[#C3D4E9] opacity-60"/>
                                <div className="flex-1 min-w-[60px] space-y-0.5">
                                    <h2 className="text-[11px] sm:text-sm font-bold">Date</h2>
                                    <div className="text-[#90A3BF] text-[10px] sm:text-xs font-medium">
                                        <input
                                         value={dropoff.date}
                                         min={pickup.date}
                                         onChange={(e) => setDropoff({ ...dropoff, date: e.target.value })}
                                         className="bg-transparent outline-none w-full text-[10px] sm:text-xs" type="date" id="f-day" name="from-date"/>
                                    </div>
                                </div>
                                <div className="w-px h-6 bg-[#C3D4E9] opacity-60"/>
                                <div className="flex-1 min-w-[55px] space-y-0.5">
                                    <h2 className="text-[11px] sm:text-sm font-bold">Time</h2>
                                    <div className="text-[#90A3BF] text-[10px] sm:text-xs font-medium">
                                        <input
                                        type="time"
                                        value={dropoff.time}
                                        onChange={(e) => setDropoff({ ...dropoff, time: e.target.value })}
                                        className="outline-none bg-transparent w-full text-[10px] sm:text-xs" id="time"/>
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