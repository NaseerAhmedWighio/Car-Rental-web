"use client";
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation";

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

import { useClerk } from "@clerk/nextjs";

const menuItems = [
    {
        label: "Dashboard",
        image: home,
        path: "/admin",
    },
    {
        label: "Car Rent",
        image: car,
        path: "/admin/car-rent",
    },
    {
        label: "Insight",
        image: chart,
        path: "/admin/insight",
    },
    {
        label: "Reimburse",
        image: wallet,
        path: "/admin/reimburse",
    },
    {
        label: "Inbox",
        image: message,
        path: "/admin/inbox",
    },
    {
        label: "Calender",
        image: calendar,
        path: "/admin/calender",
    },
];

export default function Dashboard() {
    const router = useRouter();
    const pathname = usePathname();
    const { signOut } = useClerk();

    const isActive = (path: string) => {
        if (path === "/admin") return pathname === "/admin" || pathname === "/admin/";
        return pathname === path;
    };

    const handleClick = (path: string) => {
        router.push(path);
    };

    const handleSignOut = async () => {
        localStorage.clear();
        sessionStorage.clear();
        await signOut();
        router.push("/");
    };

    return (
        <>
            <main>
                <div className="w-auto h-auto bg-white">

                    {/* Main Menu Section */}
                    <div className="justify-start">
                        <h6 className="text-[#90A3BF] text-[10px] lg:text-[12px] font-semibold ml-2 lg:ml-4">MAIN MENU</h6>
                        <div className="space-y-2 lg:space-y-3 pt-3 lg:pt-5">
                            {menuItems.map((item) => {
                                const active = isActive(item.path);
                                return (
                                    <div
                                        key={item.path}
                                        className={`flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-lg group cursor-pointer transition-colors ${active ? "bg-[#3563E9] text-white" : "bg-white hover:bg-[#3563E9]"
                                            }`}
                                        onClick={() => handleClick(item.path)}
                                    >
                                        {/* icon */}
                                        <Image src={item.image} className="w-5 h-5 lg:w-8 lg:h-8 flex-shrink-0" alt="Icon" />

                                        {/* Label */}
                                        <label
                                            className={`${active ? "text-white" : "text-[#90A3BF] group-hover:text-white"
                                                } text-[13px] lg:text-[16px] font-medium cursor-pointer`}
                                        >
                                            {item.label}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="justify-start pt-10 lg:pt-20">
                        <h6 className="text-[#90A3BF] text-[10px] lg:text-[12px] font-semibold ml-2 lg:ml-4">PREFERENCES</h6>
                        <div className="space-y-2 lg:space-y-3 pt-3 lg:pt-5">
                            <div className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-lg group cursor-pointer bg-white hover:bg-[#3563E9] transition-colors"
                                onClick={() => handleClick("/admin/setting")}
                            >
                                <Image src={setting} className="w-5 h-5 lg:w-8 lg:h-8 flex-shrink-0" alt="Icon" />
                                <label
                                    className="text-[#90A3BF] text-[13px] lg:text-[16px] font-medium group-hover:text-white cursor-pointer">
                                    Setting
                                </label>
                            </div>
                            <div className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-lg group cursor-pointer bg-white hover:bg-[#3563E9] transition-colors"
                                onClick={() => handleClick("/admin/help")}
                            >
                                <Image src={help} className="w-5 h-5 lg:w-8 lg:h-8 flex-shrink-0" alt="Icon" />
                                <label
                                    className="text-[#90A3BF] text-[13px] lg:text-[16px] font-medium group-hover:text-white cursor-pointer">
                                    Help
                                </label>
                            </div>
                            <div className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-lg group cursor-pointer bg-white hover:bg-[#3563E9] transition-colors">
                                <Image src={briefcase} className="w-5 h-5 lg:w-8 lg:h-8 flex-shrink-0" alt="Icon" />
                                <label
                                    className="text-[#90A3BF] text-[13px] lg:text-[16px] font-medium group-hover:text-white whitespace-nowrap cursor-pointer">
                                    Dark Mode
                                </label>
                                <div className="flex justify-between items-center w-16 h-6 lg:w-16 lg:h-8 ml-auto bg-[#F6F7F9] rounded-full p-0.5 lg:p-1">
                                    <div className="w-3 h-3 lg:w-6 lg:h-6 bg-[#3563E9] rounded-full flex items-center justify-center">
                                        <Image src={sun} className="w-2 h-2 lg:w-full lg:h-full" alt="sun" />
                                    </div>
                                    <div className="w-3 h-3 lg:w-6 lg:h-6 rounded-full flex items-center justify-center">
                                        <Image src={moon} className="w-2 h-2 lg:w-full lg:h-full opacity-50 lg:opacity-100" alt="moon" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-start items-center gap-2 lg:gap-3 p-2 lg:p-3 mt-20 lg:mt-60 rounded-lg group cursor-pointer bg-white hover:bg-[#3563E9] transition-colors">
                        <Image src={logout} className="w-5 h-5 lg:w-8 lg:h-8 flex-shrink-0" alt="Icon" />

                        <label
                            className="text-[#90A3BF] text-[13px] lg:text-[16px] font-medium group-hover:text-white cursor-pointer"
                            onClick={handleSignOut}>
                            Sign Out
                        </label>
                    </div>
                </div>
            </main >
        </>
    );
}
