export default function Selector() {
    return (
        <>
            <main className="w-full bg-[#F6F7F9]">
                <div className="mx-5 md:mx-8 lg:mx-20">
                    <div className="grid grid-cols-1 -space-y-4 md:space-y-0 md:flex md:justify-between place-items-center">




                        <div className=" md:w-[43%] w-full lg:px-12 md:px-5 px-1 lg:py-9 py-5 lg:h-44 h-32 bg-white ro unded-lg space-y-5 shadow-md">
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




                        <div className="flex justify-center items-center rounded-lg shadow-md z-50 md:z-0 w-[50px] h-[50px] md:w-[60px] md:h-[60px] text-white bg-[#3563E9]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.16124 3.83628L7.16124 17.4541" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3.0837 7.92862L7.16148 3.83595L11.2393 7.92862" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M17.089 20.167L17.089 6.54921" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M21.167 16.0713L17.0892 20.168L13.0114 16.0713" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>




                        <div className=" md:w-[43%] w-full lg:px-12 md:px-5 px-1 lg:py-9 py-5 lg:h-44 h-32 bg-white rounded-lg space-y-5 shadow-md">
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
                </div>
            </main>
        </>
    )
}