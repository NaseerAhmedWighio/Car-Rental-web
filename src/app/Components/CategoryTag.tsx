"use client"
import React, { useState } from "react";

export default function CategoryTag() {

    const [price, setPrice] = useState<string>("50"); // Default value is "50"

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(e.target.value); // No conversion needed
    };

    return (
        <>
            <main >
                <div className="w-auto h-auto bg-white lg:p-10 p-5">

                    {/* Type Section  */}
                    <div className="justify-start lg:space-y-5 space-y-3 ">
                        <h6 className="text-[#90A3BF] text-[12px] font-semibold">TYPE</h6>
                        <div className="flex gap-3">
                            <input type="checkbox" id="sport" />
                            <label htmlFor="sport" className="text-[#596780] text-[16px] font-medium cursor-pointer">Sport<span className="opacity-70 ml-2">(10)</span></label>
                        </div>
                        <div className="flex gap-3">
                            <input type="checkbox" id="suv" />
                            <label htmlFor="suv" className="text-[#596780] text-[16px] font-medium cursor-pointer">SUV<span className="opacity-70 ml-2">(12)</span></label>
                        </div>
                        <div className="flex gap-3">
                            <input type="checkbox" id="mpv" />
                            <label htmlFor="mpv" className="text-[#596780] text-[16px] font-medium cursor-pointer">MPV<span className="opacity-70 ml-2">(16)</span></label>
                        </div>
                        <div className="flex gap-3">
                            <input type="checkbox" id="sedan" />
                            <label htmlFor="sedan" className="text-[#596780] text-[16px] font-medium cursor-pointer">Sedan<span className="opacity-70 ml-2">(20)</span></label>
                        </div>
                        <div className="flex gap-3">
                            <input type="checkbox" id="coupe" />
                            <label htmlFor="coupe" className="text-[#596780] text-[16px] font-medium cursor-pointer">Coupe<span className="opacity-70 ml-2">(14)</span></label>
                        </div>
                        <div className="flex gap-3">
                            <input type="checkbox" id="hback" />
                            <label htmlFor="hback" className="text-[#596780] text-[16px] font-medium cursor-pointer">Hatchback<span className="opacity-70 ml-2">(14)</span></label>
                        </div>
                    </div>




                    {/* Capacity Section  */}

                    <div className="justify-start lg:space-y-5 space-y-3 py-8">
                        <h6 className="text-[#90A3BF] text-[12px] font-semibold">CAPACITY</h6>
                        <div className="flex gap-3">
                            <input type="checkbox" id="2person" />
                            <label htmlFor="2person" className="text-[#596780] text-[16px] font-medium cursor-pointer">2 Person<span className="opacity-70 ml-2">(10)</span></label>
                        </div>
                        <div className="flex gap-3">
                            <input type="checkbox" id="4person" />
                            <label htmlFor="4person" className="text-[#596780] text-[16px] font-medium cursor-pointer">4 Person<span className="opacity-70 ml-2">(14)</span></label>
                        </div>
                        <div className="flex gap-3">
                            <input type="checkbox" id="6person" />
                            <label htmlFor="6person" className="text-[#596780] text-[16px] font-medium cursor-pointer">6 Person<span className="opacity-70 ml-2">(12)</span></label>
                        </div>
                        <div className="flex gap-3">
                            <input type="checkbox" id="8person" />
                            <label htmlFor="8person" className="text-[#596780] text-[16px] font-medium cursor-pointer">8 Person <span className="opacity-70 ml-2">(16)</span></label>
                        </div>
                    </div>


                    {/* Price Section  */}

                    <div className="justify-start lg:space-y-5 space-y-3 py-8">
                        <h6 className="text-[#90A3BF] text-[12px] font-semibold">PRICE</h6>
                        <div>
                            <input
                                className="w-full outline-none border-none"
                                type="range"
                                id="rangeInput"
                                min="0"
                                max="100"
                                value={price}
                                step="1"
                                onChange={handleChange} // Update state on change
                            />
                            <input className="text-[#596780] text-[16px] font-semibold bg-transparent" type="text" value={`Max. $${price}.00`} onChange={handleChange} />
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}