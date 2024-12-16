export default function Selector() {
    return (
        <>
            <main className="w-full bg-[#F6F7F9]">
                <div className="mx-20">
                    <div className="grid grid-cols-1 xl:flex xl:justify-between place-items-center">




                        <div className="w-auto px-12 py-9 h-44 bg-white rounded-lg space-y-5">
                            <div className="flex w-full gap-4">
                                <input type="radio" />
                                <h2 className="text-[#1A202C] text-[16px] font-semibold">Pick - Up</h2>
                            </div>
                            <div className="flex justify-between text-[#1A202C]">
                                <div className="w-40" >
                                    <h2 className="text-[16px] font-bold ml-[4px]">Location</h2>
                                    <div className="text-[#90A3BF] text-[12px] font-medium">
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
                                <div className="w-10">
                                    <div className="w-[1px] h-14 bg-[#C3D4E9] opacity-40">
                                    </div>
                                </div>
                                <div className="w-40" >
                                    <h2 className="text-[16px] font-bold">Date</h2>
                                    <div className="flex justify-between text-[#90A3BF] text-[12px] font-medium">
                                        <input className="bg-transparent outline-none" type="date" id="f-day" name="from-date" min="2024-12-11" max="2025-12-10" />
                                    </div>
                                </div>
                                <div className="w-10">
                                    <div className="w-[1px] h-14 bg-[#C3D4E9] opacity-40">
                                    </div>
                                </div>
                                <div className="w-40" >
                                    <h2 className="text-[16px] font-bold">Time</h2>
                                    <div className="flex justify-between text-[#90A3BF] text-[12px] font-medium">
                                        <input className="outline-none" type="time" id="time" />
                                    </div>
                                </div>
                            </div>
                        </div>




                        <div className="flex justify-center items-center rounded-lg w-[60px] h-[60px] text-white bg-[#3563E9]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.16124 3.83628L7.16124 17.4541" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3.0837 7.92862L7.16148 3.83595L11.2393 7.92862" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M17.089 20.167L17.089 6.54921" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M21.167 16.0713L17.0892 20.168L13.0114 16.0713" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>




                        <div className="w-auto px-12 py-9 h-44 bg-white rounded-lg space-y-5">
                            <div className="flex w-full gap-4">
                                <input type="radio" />
                                <h2 className="text-[#1A202C] text-[16px] font-semibold">Drop - Off</h2>
                            </div>
                            <div className="flex justify-between text-[#1A202C]">
                                <div className="w-40" >
                                    <h2 className="text-[16px] font-bold ml-[4px]">Location</h2>
                                    <div className="text-[#90A3BF] text-[12px] font-medium">
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
                                <div className="w-10">
                                    <div className="w-[1px] h-14 bg-[#C3D4E9] opacity-40">
                                    </div>
                                </div>
                                <div className="w-40" >
                                    <h2 className="text-[16px] font-bold">Date</h2>
                                    <div className="flex justify-between text-[#90A3BF] text-[12px] font-medium">
                                        <input className="bg-transparent outline-none" type="date" id="f-day" name="from-date" min="2024-12-11" max="2025-12-10" />
                                    </div>
                                </div>
                                <div className="w-10">
                                    <div className="w-[1px] h-14 bg-[#C3D4E9] opacity-40">
                                    </div>
                                </div>
                                <div className="w-40" >
                                    <h2 className="text-[16px] font-bold">Time</h2>
                                    <div className="flex justify-between text-[#90A3BF] text-[12px] font-medium">
                                        <input className="outline-none" type="time" id="time" />
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