"use client"

import Image from "next/image"
import AdminHeader from "../Components/AdminHeader"
import Look from "@/Public/Look.png"
import Dashboard from "../Components/Dashboard";
// import chart from "../Components/chart"

import koeng from "@/Public/Koeng.png"
import gtr from "@/Public/gtr.png"
import rollsr from "@/Public/rollsr.png"
// import Charts from "../charts/Charts";


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
                                            {/* <Charts /> */}

                                            <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M13.0097 78.4267C10.3648 77.5657 9.0423 77.1352 7.80403 77.3584C6.76488 77.5457 5.69012 78.1427 4.98203 78.926C4.13821 79.8593 3.82709 81.1199 3.20483 83.641C-0.718887 99.5379 -1.05199 116.146 2.27318 132.247C5.59836 148.349 12.4831 163.466 22.3831 176.508C23.9532 178.576 24.7382 179.61 25.8827 180.133C26.8431 180.572 28.0665 180.694 29.0948 180.455C30.3202 180.169 31.3639 179.25 33.4514 177.412L37.7462 173.629C39.8469 171.779 40.8973 170.854 41.3417 169.817C41.7575 168.846 41.8549 167.954 41.6582 166.917C41.448 165.808 40.5459 164.574 38.7418 162.107C31.3023 151.933 26.1086 140.257 23.5471 127.854C20.9855 115.45 21.1292 102.672 23.9299 90.3835C24.6091 87.4034 24.9487 85.9134 24.7024 84.8119C24.472 83.7814 24.0293 83.0009 23.263 82.2744C22.4439 81.4978 21.1131 81.0646 18.4514 80.1981L13.0097 78.4267Z" fill="#63A9E8" />
                                                <path d="M37.8751 182.125C35.9082 184.092 34.9248 185.075 34.5622 186.28C34.2579 187.291 34.3026 188.52 34.6795 189.506C35.1287 190.681 36.1111 191.53 38.0759 193.228C57.0981 209.668 81.2548 219.151 106.545 219.946C131.835 220.74 156.539 212.793 176.556 197.58C178.624 196.009 179.658 195.223 180.18 194.079C180.618 193.118 180.74 191.894 180.499 190.866C180.213 189.641 179.293 188.598 177.454 186.511L173.669 182.219C171.818 180.119 170.893 179.069 169.855 178.625C168.884 178.21 167.992 178.113 166.955 178.31C165.846 178.521 164.613 179.424 162.146 181.23C146.313 192.822 126.993 198.855 107.227 198.234C87.4615 197.612 68.5585 190.378 53.4841 177.815C51.1361 175.858 49.9621 174.879 48.8686 174.599C47.8457 174.337 46.9492 174.378 45.9543 174.732C44.8906 175.109 43.901 176.099 41.9217 178.078L37.8751 182.125Z" fill="#2185DE" />
                                                <path d="M182.125 182.125C184.092 184.092 185.075 185.075 186.28 185.438C187.291 185.742 188.52 185.697 189.506 185.32C190.681 184.871 191.53 183.889 193.228 181.924C200.904 173.041 207.121 162.973 211.627 152.095C216.133 141.217 218.856 129.702 219.709 117.993C219.898 115.403 219.992 114.108 219.479 112.96C219.048 111.996 218.211 111.095 217.281 110.596C216.172 110 214.782 110 212 110H206.277C203.478 110 202.078 110 201.059 110.485C200.106 110.939 199.443 111.544 198.905 112.452C198.33 113.423 198.192 114.945 197.915 117.989C197.11 126.843 194.971 135.54 191.557 143.782C188.144 152.024 183.506 159.686 177.814 166.516C175.858 168.864 174.879 170.038 174.599 171.131C174.337 172.154 174.378 173.051 174.731 174.046C175.109 175.109 176.099 176.099 178.078 178.078L182.125 182.125Z" fill="#175D9C" />
                                                <path d="M211.746 102.803C214.52 102.607 215.908 102.508 216.971 101.836C217.864 101.272 218.635 100.315 218.997 99.3229C219.428 98.1409 219.243 96.8557 218.872 94.2854C215.449 70.566 204.355 48.5306 187.174 31.6149C169.993 14.6993 147.787 3.94985 124.017 0.896602C121.441 0.56574 120.154 0.400309 118.978 0.849781C117.992 1.22698 117.047 2.01332 116.497 2.91455C115.841 3.98846 115.765 5.37714 115.612 8.15449L115.297 13.8686C115.143 16.6635 115.066 18.0609 115.494 19.1054C115.894 20.0824 116.462 20.7773 117.34 21.3645C118.278 21.9922 119.79 22.214 122.814 22.6576C141.298 25.369 158.523 33.8912 171.933 47.0944C185.344 60.2977 194.133 77.3876 197.132 95.8274C197.623 98.8441 197.868 100.352 198.51 101.281C199.111 102.149 199.815 102.706 200.798 103.091C201.849 103.503 203.245 103.404 206.037 103.207L211.746 102.803Z" fill="#0D3559" />
                                                <path d="M110 8.00001C110 5.21847 110 3.8277 109.404 2.71934C108.905 1.78921 108.004 0.952046 107.04 0.521171C105.892 0.00772927 104.597 0.102064 102.007 0.290735C82.7746 1.69179 64.197 8.12976 48.1708 19.0211C32.1446 29.9125 19.3199 44.8155 10.9374 62.1814C9.80858 64.52 9.24417 65.6893 9.29869 66.9463C9.34444 68.0012 9.79137 69.1465 10.4722 69.9536C11.2835 70.9154 12.5766 71.4273 15.1628 72.4513L20.4837 74.558C23.0863 75.5884 24.3876 76.1037 25.5138 76.028C26.5673 75.9573 27.4062 75.6385 28.2409 74.9919C29.1332 74.3006 29.822 72.9364 31.1998 70.2081C37.9312 56.8775 47.9574 45.4306 60.3809 36.9876C72.8043 28.5447 87.1382 23.4365 102.011 22.085C105.055 21.8084 106.577 21.6701 107.548 21.0949C108.456 20.5569 109.061 19.8943 109.515 18.9408C110 17.9215 110 16.5219 110 13.7228V8.00001Z" fill="#A6CEF2" />
                                            </svg>


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