// "use client"

// import { useState } from "react";

// export default function Dashboard() {

//     const [isActive, setIsActive] = useState(false);

//     const toggleActive = () => {
//         setIsActive(!isActive);
//     };

//     return (
//         <>
//             <main >
//                 <div className="w-auto h-auto bg-white ">

//                     {/* Type Section  */}
//                     <div className="justify-start space-y-6">
//                         <h6 className="text-[#90A3BF] text-[12px] font-semibold">MAIN MANU</h6>


//                         {/* Dashboard  */}
//                         <div
//                             className={`flex gap-3 px-4 py-4 rounded-lg group cursor-pointer ${isActive ? "bg-[#3563E9] text-white" : "bg-white"} hover:bg-blue-200`}
//                             onClick={toggleActive}
//                         >
//                             <svg
//                                 width="24"
//                                 height="24"
//                                 viewBox="0 0 24 24"
//                                 fill="white"
//                                 xmlns="http://www.w3.org/2000/svg"
//                             >
//                                 <path
//                                     d="M10.0427 3.15016L10.0431 3.14985C11.1273 2.27903 12.8675 2.28414 13.968 3.16076C13.9681 3.16086 13.9682 3.16095 13.9684 3.16105L20.514 8.39756C20.5146 8.39802 20.5152 8.39849 20.5157 8.39895C20.893 8.70711 21.2196 9.18942 21.4304 9.74099C21.641 10.2922 21.7196 10.8699 21.6462 11.351L20.3873 18.8845C20.3872 18.885 20.3872 18.8855 20.3871 18.8859C20.1374 20.3188 18.7432 21.5 17.3 21.5H6.69996C5.23549 21.5 3.8725 20.3476 3.62294 18.8965C3.62288 18.8961 3.62282 18.8958 3.62276 18.8955L2.36313 11.3576L2.36293 11.3565C2.28079 10.8718 2.35452 10.293 2.56465 9.74192C2.77476 9.19094 3.10548 8.70909 3.4918 8.40086L3.49267 8.40016L10.0427 3.15016ZM12 19.25C12.6861 19.25 13.25 18.6862 13.25 18V15C13.25 14.3139 12.6861 13.75 12 13.75C11.3138 13.75 10.75 14.3139 10.75 15V18C10.75 18.6862 11.3138 19.25 12 19.25Z"
//                                     fill="white"
//                                     stroke="#90A3BF"
//                                     strokeOpacity={isActive ? "0" : "1"} /* Keep visible unless hovered */
//                                     className="group-hover:stroke-opacity-0 transition-opacity duration-300"
//                                 />
//                             </svg>

//                             <label htmlFor="dashboard" className={`${isActive ? " text-white" : "text-[#90A3BF]"} group-hover:text-white text-[16px] font-medium`}>Dashboard<span className="opacity-70 ml-2">(14)</span></label>
//                         </div>

//                         {/* Car Rent  */}
//                         <div
//                             className={`flex gap-3 px-4 py-4 rounded-lg group cursor-pointer ${isActive ? "bg-[#3563E9] text-white" : "bg-white"} hover:bg-blue-200`}
//                             onClick={toggleActive}
//                         >
//                             <svg width="24" height="24" viewBox="0 0 24 24" fill="white"

//                                 xmlns="http://www.w3.org/2000/svg">
//                                 <path d="M15.51 2.83008H8.49C6 2.83008 5.45 4.07008 5.13 5.59008L4 11.0001H20L18.87 5.59008C18.55 4.07008 18 2.83008 15.51 2.83008Z" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M21.99 19.82C22.1 20.99 21.16 22 19.96 22H18.08C17 22 16.85 21.54 16.66 20.97L16.46 20.37C16.18 19.55 16 19 14.56 19H9.43998C7.99998 19 7.78998 19.62 7.53998 20.37L7.33998 20.97C7.14998 21.54 6.99998 22 5.91998 22H4.03998C2.83998 22 1.89998 20.99 2.00998 19.82L2.56998 13.73C2.70998 12.23 2.99998 11 5.61998 11H18.38C21 11 21.29 12.23 21.43 13.73L21.99 19.82Z" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M4 8H3" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M21 8H20" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M12 3V5" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M10.5 5H13.5" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M6 15H9" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M15 15H18" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
//                                 />
//                             </svg>


//                             <label htmlFor="dashboard" className={`${isActive ? " text-white" : "text-[#90A3BF]"} group-hover:text-white text-[16px] font-medium`}>Car Rent<span className="opacity-70 ml-2">(14)</span></label>
//                         </div>

//                         {/* Insight  */}
//                         <div
//                             className={`flex gap-3 px-4 py-4 rounded-lg group cursor-pointer ${isActive ? "bg-[#3563E9] text-white" : "bg-white"} hover:bg-blue-200`}
//                             onClick={toggleActive}
//                         >
//                             <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
//                                 <path d="M3 22H21" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M5.59998 8.37988H4C3.45 8.37988 3 8.82988 3 9.37988V17.9999C3 18.5499 3.45 18.9999 4 18.9999H5.59998C6.14998 18.9999 6.59998 18.5499 6.59998 17.9999V9.37988C6.59998 8.82988 6.14998 8.37988 5.59998 8.37988Z" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M12.7999 5.19043H11.2C10.65 5.19043 10.2 5.64043 10.2 6.19043V18.0004C10.2 18.5504 10.65 19.0004 11.2 19.0004H12.7999C13.3499 19.0004 13.7999 18.5504 13.7999 18.0004V6.19043C13.7999 5.64043 13.3499 5.19043 12.7999 5.19043Z" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M19.9999 2H18.3999C17.8499 2 17.3999 2.45 17.3999 3V18C17.3999 18.55 17.8499 19 18.3999 19H19.9999C20.5499 19 20.9999 18.55 20.9999 18V3C20.9999 2.45 20.5499 2 19.9999 2Z" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                             </svg>


//                             <label htmlFor="dashboard" className={`${isActive ? " text-white" : "text-[#90A3BF]"} group-hover:text-white text-[16px] font-medium`}>Insight<span className="opacity-70 ml-2">(14)</span></label>
//                         </div>

//                         {/* Reimburse  */}
//                         <div
//                             className={`flex gap-3 px-4 py-4 rounded-lg group cursor-pointer ${isActive ? "bg-[#3563E9] text-white" : "bg-white"} hover:bg-blue-200`}
//                             onClick={toggleActive}
//                         >
//                             <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
//                                 <path d="M2.5 13.24V11.51C2.5 9.44001 4.18999 7.75 6.25999 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H12.26" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M2.5 12.4103V7.84035C2.5 6.65035 3.23 5.5903 4.34 5.1703L12.28 2.1703C13.52 1.7003 14.85 2.62033 14.85 3.95033V7.75032" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M22.5588 13.9702V16.0302C22.5588 16.5802 22.1188 17.0302 21.5588 17.0502H19.5988C18.5188 17.0502 17.5288 16.2602 17.4388 15.1802C17.3788 14.5502 17.6188 13.9602 18.0388 13.5502C18.4088 13.1702 18.9188 12.9502 19.4788 12.9502H21.5588C22.1188 12.9702 22.5588 13.4202 22.5588 13.9702Z" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M7 12H14" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M3 16.5H8.34C8.98 16.5 9.5 17.02 9.5 17.66V18.94" stroke="#90A3BF" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M4.22 15.2803L3 16.5002L4.22 17.7202" stroke="#90A3BF" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M9.5 21.7798H4.16C3.52 21.7798 3 21.2598 3 20.6198V19.3398" stroke="#90A3BF" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M8.28125 23.0005L9.50125 21.7806L8.28125 20.5605" stroke="#90A3BF" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
//                             </svg>


//                             <label htmlFor="dashboard" className={`${isActive ? " text-white" : "text-[#90A3BF]"} group-hover:text-white text-[16px] font-medium`}>Reimburse<span className="opacity-70 ml-2">(14)</span></label>
//                         </div>

//                         {/* Inbox  */}
//                         <div
//                             className={`flex gap-3 px-4 py-4 rounded-lg group cursor-pointer ${isActive ? "bg-[#3563E9] text-white" : "bg-white"} hover:bg-blue-200`}
//                             onClick={toggleActive}
//                         >
//                             <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
//                                 <path d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z" stroke="#90A3BF" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M15.9965 11H16.0054" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M11.9955 11H12.0045" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M7.99451 11H8.00349" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                             </svg>


//                             <label htmlFor="dashboard" className={`${isActive ? " text-white" : "text-[#90A3BF]"} group-hover:text-white text-[16px] font-medium`}>Inbox<span className="opacity-70 ml-2">(14)</span></label>
//                         </div>

//                         {/* Calender  */}
//                         <div
//                             className={`flex gap-3 px-4 py-4 rounded-lg group cursor-pointer ${isActive ? "bg-[#3563E9] text-white" : "bg-white"} hover:bg-blue-200`}
//                             onClick={toggleActive}
//                         >
//                             <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
//                                 <path d="M8 2V5" stroke="#90A3BF" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M16 2V5" stroke="#90A3BF" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M3.5 9.08984H20.5" stroke="#90A3BF" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="#90A3BF" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M15.6947 13.7002H15.7037" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M15.6947 16.7002H15.7037" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M11.9955 13.7002H12.0045" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M11.9955 16.7002H12.0045" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M8.29431 13.7002H8.30329" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                 <path d="M8.29431 16.7002H8.30329" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                             </svg>
//                             <label htmlFor="dashboard" className={`${isActive ? " text-white" : "text-[#90A3BF]"} group-hover:text-white text-[16px] font-medium`}>Calender<span className="opacity-70 ml-2">(14)</span></label>
//                         </div>





//                         {/* Capacity Section  */}

//                         <div className="justify-start space-y-5 py-8">

//                         </div>


//                         {/* Price Section  */}

//                         <div className="justify-start space-y-5 py-8">
//                         </div>
//                     </div>
//                 </div>
//             </main>
//         </>
//     )
// }









"use client";
import Image from "next/image"

import home from "@/Public/Dashboard/home.png"
import car from "@/Public/Dashboard/car.png"
import chart from "@/Public/Dashboard/chart.png"
import wallet from "@/Public/Dashboard/wallet.png"
import message from "@/Public/Dashboard/message.png"
import calendar from "@/Public/Dashboard/calendar.png"

import setting from "@/Public/Dashboard/setting.png"
import help from "@/Public/Dashboard/help.png"
import briefcase from "@/Public/Dashboard/briefcase.png"

import logout from "@/Public/Dashboard/logout.png"

import sun from "@/Public/Dashboard/sun.png"
import moon from "@/Public/Dashboard/moon.png"

import { useState } from "react";

export default function Dashboard() {
    // State to keep track of the active item (by index)
    const [activeIndex, setActiveIndex] = useState(0);

    const menuItems = [
        {
            label: "Dashboard",
            image: home,
        },
        {
            label: "Car Rent",
            image: car,
        },
        {
            label: "Insight",
            image: chart,
        },
        {
            label: "Reimburse",
            image: wallet,
        },
        {
            label: "Inbox",
            image: message,
        },
        {
            label: "Calender",
            image: calendar
        },
    ];


    return (
        <>
            <main>
                <div className="w-auto h-auto bg-white">


                    {/* Main Menu Section */}
                    <div className="justify-start">
                        <h6 className="text-[#90A3BF] text-[12px] font-semibold ml-6">MAIN MENU</h6>
                        <div className="space-y-3 pt-5">
                        {/* Loop through menu items */}
                        {menuItems.map((item, index) => (
                            <div
                                key={index}
                                className={`flex items-center gap-3 px-4 py-4 rounded-lg group cursor-pointer ${activeIndex === index ? "bg-[#3563E9] text-white" : "bg-white"
                                    } hover:bg-blue-200`}
                                onClick={() => setActiveIndex(index)} // Set this item as active
                            >
                                {/* icon */}

                                <Image src={item.image} className="w-8 h-8 fill-white" alt="Icon" />

                                {/* Label */}
                                <label
                                    htmlFor={item.label}
                                    className={`${activeIndex === index ? "text-white" : "text-[#90A3BF]"
                                        } group-hover:text-white text-[16px] font-medium`}
                                >
                                    {item.label}
                                </label>
                            </div>
                        ))}
                    </div>
                        </div>

                    {/* Prefrences  */}
                    <div className="justify-start pt-20">
                        <h6 className="text-[#90A3BF] text-[12px] font-semibold ml-6">PREFERENCES</h6>
                        <div className="space-y-3 pt-5">
                            <div className="flex items-center gap-3 px-4 py-4 rounded-lg group cursor-pointer bg-white hover:bg-blue-200">
                                <Image src={setting} id="logout" className="w-8 h-8 fill-white" alt="Icon" />
                                <label
                                    htmlFor="setting"
                                    className="text-[#90A3BF] text-[16px] font-medium group-hover:text-white">
                                    Setting
                                </label>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-4 rounded-lg group cursor-pointer bg-white hover:bg-blue-200">
                                <Image src={help} id="logout" className="w-8 h-8 fill-white" alt="Icon" />
                                <label
                                    htmlFor="help"
                                    className="text-[#90A3BF] text-[16px] font-medium group-hover:text-white">
                                    Help
                                </label>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-4 rounded-lg group cursor-pointer bg-white hover:bg-blue-200">
                                <Image src={briefcase} id="logout" className="w-8 h-8 fill-white" alt="Icon" />
                                <label
                                    htmlFor="darkmode"
                                    className="text-[#90A3BF] text-[16px] font-medium group-hover:text-white">
                                    Dark Mode
                                </label>
                                <div className="flex justify-between p-1 items-center w-24 h-10 ml-auto bg-[#F6F7F9] rounded-full">
                                    <div className="w-8 h-8 p-1 items-center bg-[#3563E9] rounded-full">
                                        <Image src={sun} className="w-full h-full" alt="sun"/>
                                    </div>
                                    <div className="w-8 h-8 p-1 items-center rounded-full">
                                        <Image src={moon} className="w-full h-full" alt="moon"/>
                                    </div>
                                </div>
                            </div>
                       </div>
                    </div>
                    <div className="flex gap-3 px-4 py-4 mt-60 rounded-lg group cursor-pointer bg-white hover:bg-blue-200">
                        <Image src={logout} id="logout" className="w-8 h-8 fill-white" alt="Icon" />
                        <label
                            htmlFor="logout"
                            className="text-[#90A3BF] text-[16px] font-medium group-hover:text-white">
                            Log Out
                        </label>
                    </div>
                </div>
            </main >
        </>
    );
}
