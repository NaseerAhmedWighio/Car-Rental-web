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
// import { SignOutButton } from "@clerk/nextjs"

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
                                    className="text-[#90A3BF] text-[16px] font-medium group-hover:text-white whitespace-nowrap">
                                    Dark Mode
                                </label>
                                <div className="flex justify-between p-1 items-center w-24 h-10 ml-auto bg-[#F6F7F9] rounded-full">
                                    <div className="w-8 h-8 p-1 items-center bg-[#3563E9] rounded-full">
                                        <Image src={sun} className="w-full h-full" alt="sun" />
                                    </div>
                                    <div className="w-8 h-8 p-1 items-center rounded-full">
                                        <Image src={moon} className="w-full h-full" alt="moon" />
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
                            {/* <SignOutButton /> */}
                        </label>
                    </div>
                </div>
            </main >
        </>
    );
}
