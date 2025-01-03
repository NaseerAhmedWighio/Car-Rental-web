"use client"
import { useState } from "react"
import type { StaticImageData } from "next/image";
import Link from "next/link"

interface Car {
    id: number;
    image: StaticImageData;
    name: string;
    category: string;
    fuel: number;
    mode: string;
    capacity: number;
    price: number;
}

import CategoryTag from "../Components/CategoryTag"
import Header from "../Components/Header"
import Image from "next/image"
import Ad2 from "@/Public/Ads2.png"
import v1 from "@/Public/v1.png"
import v2 from "@/Public/v2.png"
import v3 from "@/Public/v3.png"
import p1 from "@/Public/p1.png"
import p2 from "@/Public/p2.png"

import koeng from "@/Public/Koeng.png"
import gtr from "@/Public/gtr.png"
import rollsr from "@/Public/rollsr.png"
import crv from "@/Public/crv.png"
import crvblack from "@/Public/crvblack.png"
import mgexcite from "@/Public/mgexcite.png"
import mgzs from "@/Public/mgzs.png"
// import mgzsgray from "@/public/mgzsgray.png"
import newrush from "@/Public/newrush.png"
import newterios from "@/Public/newterios.png"


export default function DetailsPage() {

    type LikedItemsState = { [key: string]: boolean }; // Define the shape of the state

    const [likedItems, setLikedItems] = useState<LikedItemsState>({}); // Use this type for the state

    const toggleLike = (id: string) => {
        setLikedItems((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };
    const Popular_list: Car[] = [
        {
            id: 1,
            image: koeng,
            name: "Koengsegg",
            category: "Sport",
            fuel: 90,
            mode: "Manual",
            capacity: 2,
            price: 99,
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
        },
    ]

    const Recomended_list: Car[] = [
        {
            id: 15,
            image: newrush,
            name: "All New Rush",
            category: "SUV",
            fuel: 70,
            mode: "Manual",
            capacity: 6,
            price: 72,
        },
        {
            id: 16,
            image: crv,
            name: "CR - V",
            category: "SUV",
            fuel: 80,
            mode: "Manual",
            capacity: 6,
            price: 80,

        },
        {
            id: 17,
            image: newterios,
            name: "All New Terios",
            category: "SUV",
            fuel: 90,
            mode: "Manual",
            capacity: 6,
            price: 74,
        },
        {
            id: 18,
            image: crvblack,
            name: "CR - V",
            category: "SUV",
            fuel: 80,
            mode: "Manual",
            capacity: 6,
            price: 80,

        },
        {
            id: 19,
            image: mgexcite,
            name: "MG ZX Exclusive",
            category: "Hatchback",
            fuel: 70,
            mode: "Manual",
            capacity: 4,
            price: 76,
        },
        {
            id: 20,
            image: mgzs,
            name: "New MG ZS",
            category: "SUV",
            fuel: 80,
            mode: "Manual",
            capacity: 6,
            price: 80,
        },
        {
            id: 21,
            image: mgexcite,
            name: "MG ZX Excite",
            category: "Hatchback",
            fuel: 90,
            mode: "Manual",
            capacity: 4,
            price: 74,

        },
        {
            id: 22,
            image: newterios,
            name: "New MG ZS",
            category: "SUV",
            fuel: 80,
            mode: "Manual",
            capacity: 6,
            price: 80,
        },
    ]


    return (
        <div>
            <Header />
            <main className="w-screen h-auto bg-[#F6F7F9]">
                <div className="xl:flex">
                    <div className="hidden xl:block xl:w-1/4 xl:h-auto bg-white p-10">
                        <CategoryTag />
                    </div>


                    <div className="mx-5 md:mx-8 lg:mx-10 py-5">
                        {/* Product Details  */}

                        <div className="grid grid-cols-1 lg:grid-cols-2 py-10 gap-7">
                            <div className="relative bg-white rounded-lg shadow-md p-3 md:p-5 lg:p-7">
                                <div className="relative rounded-lg text-black">
                                    <Image
                                        className="w-full rounded-lg shadow-md" src={Ad2} alt="Ad-1" />

                                    <div className="w-full lg:w-[52%] absolute top-5 lg:left-7 left-4 space-y-2 text-white">
                                        <h1 className="text-[16px] md:text-[22px] lg:[28px] font-semibold leading-relaxed">
                                            Sports car with the best design<br className="lg:hidden" />and acceleration
                                        </h1>
                                        <p className="font-medium text-[8px] md:text-[12px] lg:text-[14px]">
                                            Safety and comfort while driving a<br />
                                            futuristic and elegant sports car
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-between py-5 gap-4">
                                    <div className="w-1/3 lg:w-[160px]  rounded-lg shadow-md p-2 border-2 border-[#3563E9]">
                                        <Image src={v1} className="w-full h-full" alt="View1" />
                                    </div>
                                    <div className="w-1/3 lg:w-[160px]  shadow-md rounded-lg">
                                        <Image src={v2} className="w-full h-full" alt="View2" />
                                    </div>
                                    <div className="w-1/3 lg:w-[160px]  shadow-md rounded-lg">
                                        <Image src={v3} className="w-full h-full" alt="View3" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-between bg-white rounded-lg shadow-md p-4 md:p-7 lg:p-10">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="font-bold lg:text-[32px] md:text-[24px] text-[20px] text-[#1A202C]">Nissan GT-R</h1>
                                        <div className="flex gap-2 items-center">
                                            <svg className="w-[70px] h-[17px] md:w-[108px] md:h-[20px]" viewBox="0 0 108 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_35_8274)">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M9.1667 2.65862C9.22427 2.47609 9.33852 2.31666 9.49287 2.20349C9.64723 2.09031 9.83364 2.0293 10.025 2.0293C10.2164 2.0293 10.4028 2.09031 10.5572 2.20349C10.7116 2.31666 10.8258 2.47609 10.8834 2.65862L12.4334 7.42529H17.4334C17.6316 7.41779 17.8269 7.47541 17.9893 7.58932C18.1517 7.70324 18.2723 7.86719 18.3328 8.05614C18.3933 8.24508 18.3902 8.44862 18.3241 8.63567C18.258 8.82271 18.1325 8.98297 17.9667 9.09196L13.9084 12.0336L15.4584 16.8086C15.5197 16.9905 15.5212 17.1872 15.4628 17.3701C15.4043 17.5529 15.289 17.7122 15.1336 17.8249C14.9781 17.9375 14.7908 17.9975 14.5988 17.996C14.4069 17.9946 14.2204 17.9319 14.0667 17.817L10 14.842L5.9417 17.792C5.78796 17.9069 5.60151 17.9696 5.40957 17.971C5.21764 17.9725 5.03028 17.9125 4.87485 17.7999C4.71942 17.6872 4.60406 17.5279 4.54563 17.3451C4.48719 17.1622 4.48874 16.9655 4.55004 16.7836L6.10004 12.0086L2.0417 9.06696C1.87594 8.95797 1.75041 8.79771 1.6843 8.61067C1.61819 8.42362 1.61514 8.22008 1.6756 8.03114C1.73606 7.84219 1.85672 7.67824 2.01914 7.56432C2.18155 7.45041 2.3768 7.39279 2.57504 7.40029H7.57504L9.1667 2.65862Z" fill="#FBAD39" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M31.1667 2.65862C31.2243 2.47609 31.3385 2.31666 31.4929 2.20349C31.6472 2.09031 31.8336 2.0293 32.025 2.0293C32.2164 2.0293 32.4028 2.09031 32.5572 2.20349C32.7116 2.31666 32.8258 2.47609 32.8834 2.65862L34.4334 7.42529H39.4334C39.6316 7.41779 39.8269 7.47541 39.9893 7.58932C40.1517 7.70324 40.2723 7.86719 40.3328 8.05614C40.3933 8.24508 40.3902 8.44862 40.3241 8.63567C40.258 8.82271 40.1325 8.98297 39.9667 9.09196L35.9084 12.0336L37.4584 16.8086C37.5197 16.9905 37.5212 17.1872 37.4628 17.3701C37.4043 17.5529 37.289 17.7122 37.1336 17.8249C36.9781 17.9375 36.7908 17.9975 36.5988 17.996C36.4069 17.9946 36.2204 17.9319 36.0667 17.817L32 14.842L27.9417 17.792C27.788 17.9069 27.6015 17.9696 27.4096 17.971C27.2176 17.9725 27.0303 17.9125 26.8748 17.7999C26.7194 17.6872 26.6041 17.5279 26.5456 17.3451C26.4872 17.1622 26.4887 16.9655 26.55 16.7836L28.1 12.0086L24.0417 9.06696C23.8759 8.95797 23.7504 8.79771 23.6843 8.61067C23.6182 8.42362 23.6151 8.22008 23.6756 8.03114C23.7361 7.84219 23.8567 7.67824 24.0191 7.56432C24.1816 7.45041 24.3768 7.39279 24.575 7.40029H29.575L31.1667 2.65862Z" fill="#FBAD39" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M53.1667 2.65862C53.2243 2.47609 53.3385 2.31666 53.4929 2.20349C53.6472 2.09031 53.8336 2.0293 54.025 2.0293C54.2164 2.0293 54.4028 2.09031 54.5572 2.20349C54.7116 2.31666 54.8258 2.47609 54.8834 2.65862L56.4334 7.42529H61.4334C61.6316 7.41779 61.8269 7.47541 61.9893 7.58932C62.1517 7.70324 62.2723 7.86719 62.3328 8.05614C62.3933 8.24508 62.3902 8.44862 62.3241 8.63567C62.258 8.82271 62.1325 8.98297 61.9667 9.09196L57.9084 12.0336L59.4584 16.8086C59.5197 16.9905 59.5212 17.1872 59.4628 17.3701C59.4043 17.5529 59.289 17.7122 59.1336 17.8249C58.9781 17.9375 58.7908 17.9975 58.5988 17.996C58.4069 17.9946 58.2204 17.9319 58.0667 17.817L54 14.842L49.9417 17.792C49.788 17.9069 49.6015 17.9696 49.4096 17.971C49.2176 17.9725 49.0303 17.9125 48.8748 17.7999C48.7194 17.6872 48.6041 17.5279 48.5456 17.3451C48.4872 17.1622 48.4887 16.9655 48.55 16.7836L50.1 12.0086L46.0417 9.06696C45.8759 8.95797 45.7504 8.79771 45.6843 8.61067C45.6182 8.42363 45.6151 8.22008 45.6756 8.03114C45.7361 7.84219 45.8567 7.67824 46.0191 7.56432C46.1816 7.45041 46.3768 7.39279 46.575 7.40029H51.575L53.1667 2.65862Z" fill="#FBAD39" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M75.1667 2.65862C75.2243 2.47609 75.3385 2.31666 75.4929 2.20349C75.6472 2.09031 75.8336 2.0293 76.025 2.0293C76.2164 2.0293 76.4028 2.09031 76.5572 2.20349C76.7116 2.31666 76.8258 2.47609 76.8834 2.65862L78.4334 7.42529H83.4334C83.6316 7.41779 83.8269 7.47541 83.9893 7.58932C84.1517 7.70324 84.2723 7.86719 84.3328 8.05614C84.3933 8.24508 84.3902 8.44862 84.3241 8.63567C84.258 8.82271 84.1325 8.98297 83.9667 9.09196L79.9084 12.0336L81.4584 16.8086C81.5197 16.9905 81.5212 17.1872 81.4628 17.3701C81.4043 17.5529 81.289 17.7122 81.1336 17.8249C80.9781 17.9375 80.7908 17.9975 80.5988 17.996C80.4069 17.9946 80.2204 17.9319 80.0667 17.817L76 14.842L71.9417 17.792C71.788 17.9069 71.6015 17.9696 71.4096 17.971C71.2176 17.9725 71.0303 17.9125 70.8748 17.7999C70.7194 17.6872 70.6041 17.5279 70.5456 17.3451C70.4872 17.1622 70.4887 16.9655 70.55 16.7836L72.1 12.0086L68.0417 9.06696C67.8759 8.95797 67.7504 8.79771 67.6843 8.61067C67.6182 8.42362 67.6151 8.22008 67.6756 8.03114C67.7361 7.84219 67.8567 7.67824 68.0191 7.56432C68.1816 7.45041 68.3768 7.39279 68.575 7.40029H73.575L75.1667 2.65862Z" fill="#FBAD39" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M97.1667 2.65862C97.2243 2.47609 97.3385 2.31666 97.4929 2.20349C97.6472 2.09031 97.8336 2.0293 98.025 2.0293C98.2164 2.0293 98.4028 2.09031 98.5572 2.20349C98.7116 2.31666 98.8258 2.47609 98.8834 2.65862L100.433 7.42529H105.433C105.632 7.41779 105.827 7.47541 105.989 7.58932C106.152 7.70324 106.272 7.86719 106.333 8.05614C106.393 8.24508 106.39 8.44862 106.324 8.63567C106.258 8.82271 106.132 8.98297 105.967 9.09196L101.908 12.0336L103.458 16.8086C103.52 16.9905 103.521 17.1872 103.463 17.3701C103.404 17.5529 103.289 17.7122 103.134 17.8249C102.978 17.9375 102.791 17.9975 102.599 17.996C102.407 17.9946 102.22 17.9319 102.067 17.817L98 14.842L93.9417 17.792C93.788 17.9069 93.6015 17.9696 93.4096 17.971C93.2176 17.9725 93.0303 17.9125 92.8748 17.7999C92.7194 17.6872 92.6041 17.5279 92.5456 17.3451C92.4872 17.1622 92.4887 16.9655 92.55 16.7836L94.1 12.0086L90.0417 9.06696C89.8759 8.95797 89.7504 8.79771 89.6843 8.61067C89.6182 8.42363 89.6151 8.22008 89.6756 8.03114C89.7361 7.84219 89.8567 7.67824 90.0191 7.56432C90.1816 7.45041 90.3768 7.39279 90.575 7.40029H95.575L97.1667 2.65862Z" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_35_8274">
                                                        <rect width="108" height="20" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            <p className="text-[10px] whitespace-nowrap md:text-[14px] font-medium text-[#596780]">440+ Reviewer</p>
                                        </div>
                                    </div>

                                    <svg
                                        className="cursor-pointer"
                                        id="heart-icon"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="red"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M12.62 20.8096C12.28 20.9296 11.72 20.9296 11.38 20.8096C8.48 19.8196 2 15.6896 2 8.68961C2 5.59961 4.49 3.09961 7.56 3.09961C9.38 3.09961 10.99 3.97961 12 5.33961C13.01 3.97961 14.63 3.09961 16.44 3.09961C19.51 3.09961 22 5.59961 22 8.68961C22 15.6896 15.52 19.8196 12.62 20.8096Z"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>

                                </div>

                                <p className="text-[#596780] text-[14px] md:text-18-[px] lg:text-[20px]">{`NISMO has become the embodiment of Nissan's outstanding performance, inspired by the most unforgiving proving ground, the "race track".`}</p>

                                <div className="flex justify-center items-center gap-10 md:gap-16 lg:gap-20">
                                    <div className="w-full">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h5 className="text-[#90A3BF] text-[10px] md:text-[14px] lg:text-[20px] whitespace-nowrap">Type Car</h5>
                                                <h5 className=" text-[#90A3BF] text-[10px] md:text-[14px] lg:text-[20px]">Stearing</h5>
                                            </div>
                                            <div>
                                                <h5 className=" text-[#596780] text-[10px]  md:text-[14px] text-right lg:text-[20px] font-semibold">Sport</h5>
                                                <h5 className=" text-[#596780] text-right  text-[10px]  md:text-[14px] lg:text-[20px] font-semibold">Manual</h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h5 className="text-[#90A3BF] text-[10px]  md:text-[14px] lg:text-[20px]">Capacity</h5>
                                                <h5 className="text-[#90A3BF] text-[10px]  md:text-[14px] lg:text-[20px]">Gasoline</h5>
                                            </div>
                                            <div>
                                                <h5 className="text-[#596780] text-[10px]  md:text-[14px] lg:text-[20px] whitespace-nowrap font-semibold">2 Person</h5>
                                                <h5 className="text-[#596780] text-right text-[10px]  md:text-[14px] lg:text-[20px] font-semibold">70L</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <div>
                                        <h5 className="text-[#1A202C] text-[16px] md:text-[20px] lg:text-[24px] font-bold">$80.00/<span className="lg:text-base md:text-[12px] text-[10px] text-[#90A3BF] font-normal">days</span></h5>
                                        <del className="text-[#90A3BF] text-[12px] md:text-base">$100.00</del>
                                    </div>
                                    <Link href="../billing/"><button className="px-4 py-2 bg-[#3563E9] text-white font-semibold text-[12px] md:text-[16px] rounded-lg">Rent Now</button></Link>
                                </div>
                            </div>
                        </div>


                        {/* Reviews Area  */}
                        <div className="w-full h-auto rounded-lg shadow-md bg-white p-4 md:p-7 lg:p-10">
                            <div className="flex items-center gap-3">
                                <h1 className="font-semibold text-[#1A202C] text-[14px] md:text-[20px]">Reviews</h1>
                                <h2 className="py-1 px-2 md:py-2 md:px-4 bg-[#3563E9] text-[10px] md:text-[14px] font-bold rounded-md text-white">13</h2>
                            </div>
                            <div>
                                <div className="flex justify-between items-center py-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full">
                                            <Image src={p1} alt="user1" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="space-y-[1px]">
                                            <h2 className="text-[#1A202C] text-[16px] md:text-[20px] font-bold whitespace-nowrap">Alex Stanton</h2>
                                            <p className="text-[#90A3BF] text-[12px] md:text-[14px] font-medium whitespace-nowrap">CEO at Bukalapak</p>
                                        </div>
                                    </div>
                                    <div className="space-y-[1px]">
                                        <h2 className="text-[#90A3BF] text-[10px] md:text-[14px] font-medium ml-6 whitespace-nowrap">21 July 2022</h2>
                                        <div>
                                            <svg className="w-[70px] h-[17px] md:w-[108px] md:h-[20px] ml-4 md:ml-1" viewBox="0 0 108 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_35_8274)">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M9.1667 2.65862C9.22427 2.47609 9.33852 2.31666 9.49287 2.20349C9.64723 2.09031 9.83364 2.0293 10.025 2.0293C10.2164 2.0293 10.4028 2.09031 10.5572 2.20349C10.7116 2.31666 10.8258 2.47609 10.8834 2.65862L12.4334 7.42529H17.4334C17.6316 7.41779 17.8269 7.47541 17.9893 7.58932C18.1517 7.70324 18.2723 7.86719 18.3328 8.05614C18.3933 8.24508 18.3902 8.44862 18.3241 8.63567C18.258 8.82271 18.1325 8.98297 17.9667 9.09196L13.9084 12.0336L15.4584 16.8086C15.5197 16.9905 15.5212 17.1872 15.4628 17.3701C15.4043 17.5529 15.289 17.7122 15.1336 17.8249C14.9781 17.9375 14.7908 17.9975 14.5988 17.996C14.4069 17.9946 14.2204 17.9319 14.0667 17.817L10 14.842L5.9417 17.792C5.78796 17.9069 5.60151 17.9696 5.40957 17.971C5.21764 17.9725 5.03028 17.9125 4.87485 17.7999C4.71942 17.6872 4.60406 17.5279 4.54563 17.3451C4.48719 17.1622 4.48874 16.9655 4.55004 16.7836L6.10004 12.0086L2.0417 9.06696C1.87594 8.95797 1.75041 8.79771 1.6843 8.61067C1.61819 8.42362 1.61514 8.22008 1.6756 8.03114C1.73606 7.84219 1.85672 7.67824 2.01914 7.56432C2.18155 7.45041 2.3768 7.39279 2.57504 7.40029H7.57504L9.1667 2.65862Z" fill="#FBAD39" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M31.1667 2.65862C31.2243 2.47609 31.3385 2.31666 31.4929 2.20349C31.6472 2.09031 31.8336 2.0293 32.025 2.0293C32.2164 2.0293 32.4028 2.09031 32.5572 2.20349C32.7116 2.31666 32.8258 2.47609 32.8834 2.65862L34.4334 7.42529H39.4334C39.6316 7.41779 39.8269 7.47541 39.9893 7.58932C40.1517 7.70324 40.2723 7.86719 40.3328 8.05614C40.3933 8.24508 40.3902 8.44862 40.3241 8.63567C40.258 8.82271 40.1325 8.98297 39.9667 9.09196L35.9084 12.0336L37.4584 16.8086C37.5197 16.9905 37.5212 17.1872 37.4628 17.3701C37.4043 17.5529 37.289 17.7122 37.1336 17.8249C36.9781 17.9375 36.7908 17.9975 36.5988 17.996C36.4069 17.9946 36.2204 17.9319 36.0667 17.817L32 14.842L27.9417 17.792C27.788 17.9069 27.6015 17.9696 27.4096 17.971C27.2176 17.9725 27.0303 17.9125 26.8748 17.7999C26.7194 17.6872 26.6041 17.5279 26.5456 17.3451C26.4872 17.1622 26.4887 16.9655 26.55 16.7836L28.1 12.0086L24.0417 9.06696C23.8759 8.95797 23.7504 8.79771 23.6843 8.61067C23.6182 8.42362 23.6151 8.22008 23.6756 8.03114C23.7361 7.84219 23.8567 7.67824 24.0191 7.56432C24.1816 7.45041 24.3768 7.39279 24.575 7.40029H29.575L31.1667 2.65862Z" fill="#FBAD39" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M53.1667 2.65862C53.2243 2.47609 53.3385 2.31666 53.4929 2.20349C53.6472 2.09031 53.8336 2.0293 54.025 2.0293C54.2164 2.0293 54.4028 2.09031 54.5572 2.20349C54.7116 2.31666 54.8258 2.47609 54.8834 2.65862L56.4334 7.42529H61.4334C61.6316 7.41779 61.8269 7.47541 61.9893 7.58932C62.1517 7.70324 62.2723 7.86719 62.3328 8.05614C62.3933 8.24508 62.3902 8.44862 62.3241 8.63567C62.258 8.82271 62.1325 8.98297 61.9667 9.09196L57.9084 12.0336L59.4584 16.8086C59.5197 16.9905 59.5212 17.1872 59.4628 17.3701C59.4043 17.5529 59.289 17.7122 59.1336 17.8249C58.9781 17.9375 58.7908 17.9975 58.5988 17.996C58.4069 17.9946 58.2204 17.9319 58.0667 17.817L54 14.842L49.9417 17.792C49.788 17.9069 49.6015 17.9696 49.4096 17.971C49.2176 17.9725 49.0303 17.9125 48.8748 17.7999C48.7194 17.6872 48.6041 17.5279 48.5456 17.3451C48.4872 17.1622 48.4887 16.9655 48.55 16.7836L50.1 12.0086L46.0417 9.06696C45.8759 8.95797 45.7504 8.79771 45.6843 8.61067C45.6182 8.42363 45.6151 8.22008 45.6756 8.03114C45.7361 7.84219 45.8567 7.67824 46.0191 7.56432C46.1816 7.45041 46.3768 7.39279 46.575 7.40029H51.575L53.1667 2.65862Z" fill="#FBAD39" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M75.1667 2.65862C75.2243 2.47609 75.3385 2.31666 75.4929 2.20349C75.6472 2.09031 75.8336 2.0293 76.025 2.0293C76.2164 2.0293 76.4028 2.09031 76.5572 2.20349C76.7116 2.31666 76.8258 2.47609 76.8834 2.65862L78.4334 7.42529H83.4334C83.6316 7.41779 83.8269 7.47541 83.9893 7.58932C84.1517 7.70324 84.2723 7.86719 84.3328 8.05614C84.3933 8.24508 84.3902 8.44862 84.3241 8.63567C84.258 8.82271 84.1325 8.98297 83.9667 9.09196L79.9084 12.0336L81.4584 16.8086C81.5197 16.9905 81.5212 17.1872 81.4628 17.3701C81.4043 17.5529 81.289 17.7122 81.1336 17.8249C80.9781 17.9375 80.7908 17.9975 80.5988 17.996C80.4069 17.9946 80.2204 17.9319 80.0667 17.817L76 14.842L71.9417 17.792C71.788 17.9069 71.6015 17.9696 71.4096 17.971C71.2176 17.9725 71.0303 17.9125 70.8748 17.7999C70.7194 17.6872 70.6041 17.5279 70.5456 17.3451C70.4872 17.1622 70.4887 16.9655 70.55 16.7836L72.1 12.0086L68.0417 9.06696C67.8759 8.95797 67.7504 8.79771 67.6843 8.61067C67.6182 8.42362 67.6151 8.22008 67.6756 8.03114C67.7361 7.84219 67.8567 7.67824 68.0191 7.56432C68.1816 7.45041 68.3768 7.39279 68.575 7.40029H73.575L75.1667 2.65862Z" fill="#FBAD39" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M97.1667 2.65862C97.2243 2.47609 97.3385 2.31666 97.4929 2.20349C97.6472 2.09031 97.8336 2.0293 98.025 2.0293C98.2164 2.0293 98.4028 2.09031 98.5572 2.20349C98.7116 2.31666 98.8258 2.47609 98.8834 2.65862L100.433 7.42529H105.433C105.632 7.41779 105.827 7.47541 105.989 7.58932C106.152 7.70324 106.272 7.86719 106.333 8.05614C106.393 8.24508 106.39 8.44862 106.324 8.63567C106.258 8.82271 106.132 8.98297 105.967 9.09196L101.908 12.0336L103.458 16.8086C103.52 16.9905 103.521 17.1872 103.463 17.3701C103.404 17.5529 103.289 17.7122 103.134 17.8249C102.978 17.9375 102.791 17.9975 102.599 17.996C102.407 17.9946 102.22 17.9319 102.067 17.817L98 14.842L93.9417 17.792C93.788 17.9069 93.6015 17.9696 93.4096 17.971C93.2176 17.9725 93.0303 17.9125 92.8748 17.7999C92.7194 17.6872 92.6041 17.5279 92.5456 17.3451C92.4872 17.1622 92.4887 16.9655 92.55 16.7836L94.1 12.0086L90.0417 9.06696C89.8759 8.95797 89.7504 8.79771 89.6843 8.61067C89.6182 8.42363 89.6151 8.22008 89.6756 8.03114C89.7361 7.84219 89.8567 7.67824 90.0191 7.56432C90.1816 7.45041 90.3768 7.39279 90.575 7.40029H95.575L97.1667 2.65862Z" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_35_8274">
                                                        <rect width="108" height="20" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[12px] md:text-[14] text-[#596780]">We are very happy with the service from the MORENT App. Morent has a low price and also a large variety of cars with good and comfortable facilities. In addition, the service provided by the officers is also very friendly and very polite.</p>
                            </div>
                            <div>
                                <div className="flex justify-between items-center py-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full">
                                            <Image src={p2} alt="user1" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="space-y-[1px]">
                                            <h2 className="text-[#1A202C] text-[16px] md: font-bold whitespace-nowrap">Skylar Dias</h2>
                                            <p className="text-[#90A3BF] text-[12px] md:text-[14px] font-medium whitespace-nowrap">CEO at Amazon</p>
                                        </div>
                                    </div>
                                    <div className="space-y-[1px] justify-end">
                                        <h2 className="text-[#90A3BF] text-[10px] md:text-[14px] font-medium ml-6 whitespace-nowrap">20 July 2022</h2>
                                        <div>
                                            <svg className="w-[70px] h-[17px] md:w-[108px] md:h-[20px] ml-4 md:ml-1" viewBox="0 0 108 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_35_8274)">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M9.1667 2.65862C9.22427 2.47609 9.33852 2.31666 9.49287 2.20349C9.64723 2.09031 9.83364 2.0293 10.025 2.0293C10.2164 2.0293 10.4028 2.09031 10.5572 2.20349C10.7116 2.31666 10.8258 2.47609 10.8834 2.65862L12.4334 7.42529H17.4334C17.6316 7.41779 17.8269 7.47541 17.9893 7.58932C18.1517 7.70324 18.2723 7.86719 18.3328 8.05614C18.3933 8.24508 18.3902 8.44862 18.3241 8.63567C18.258 8.82271 18.1325 8.98297 17.9667 9.09196L13.9084 12.0336L15.4584 16.8086C15.5197 16.9905 15.5212 17.1872 15.4628 17.3701C15.4043 17.5529 15.289 17.7122 15.1336 17.8249C14.9781 17.9375 14.7908 17.9975 14.5988 17.996C14.4069 17.9946 14.2204 17.9319 14.0667 17.817L10 14.842L5.9417 17.792C5.78796 17.9069 5.60151 17.9696 5.40957 17.971C5.21764 17.9725 5.03028 17.9125 4.87485 17.7999C4.71942 17.6872 4.60406 17.5279 4.54563 17.3451C4.48719 17.1622 4.48874 16.9655 4.55004 16.7836L6.10004 12.0086L2.0417 9.06696C1.87594 8.95797 1.75041 8.79771 1.6843 8.61067C1.61819 8.42362 1.61514 8.22008 1.6756 8.03114C1.73606 7.84219 1.85672 7.67824 2.01914 7.56432C2.18155 7.45041 2.3768 7.39279 2.57504 7.40029H7.57504L9.1667 2.65862Z" fill="#FBAD39" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M31.1667 2.65862C31.2243 2.47609 31.3385 2.31666 31.4929 2.20349C31.6472 2.09031 31.8336 2.0293 32.025 2.0293C32.2164 2.0293 32.4028 2.09031 32.5572 2.20349C32.7116 2.31666 32.8258 2.47609 32.8834 2.65862L34.4334 7.42529H39.4334C39.6316 7.41779 39.8269 7.47541 39.9893 7.58932C40.1517 7.70324 40.2723 7.86719 40.3328 8.05614C40.3933 8.24508 40.3902 8.44862 40.3241 8.63567C40.258 8.82271 40.1325 8.98297 39.9667 9.09196L35.9084 12.0336L37.4584 16.8086C37.5197 16.9905 37.5212 17.1872 37.4628 17.3701C37.4043 17.5529 37.289 17.7122 37.1336 17.8249C36.9781 17.9375 36.7908 17.9975 36.5988 17.996C36.4069 17.9946 36.2204 17.9319 36.0667 17.817L32 14.842L27.9417 17.792C27.788 17.9069 27.6015 17.9696 27.4096 17.971C27.2176 17.9725 27.0303 17.9125 26.8748 17.7999C26.7194 17.6872 26.6041 17.5279 26.5456 17.3451C26.4872 17.1622 26.4887 16.9655 26.55 16.7836L28.1 12.0086L24.0417 9.06696C23.8759 8.95797 23.7504 8.79771 23.6843 8.61067C23.6182 8.42362 23.6151 8.22008 23.6756 8.03114C23.7361 7.84219 23.8567 7.67824 24.0191 7.56432C24.1816 7.45041 24.3768 7.39279 24.575 7.40029H29.575L31.1667 2.65862Z" fill="#FBAD39" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M53.1667 2.65862C53.2243 2.47609 53.3385 2.31666 53.4929 2.20349C53.6472 2.09031 53.8336 2.0293 54.025 2.0293C54.2164 2.0293 54.4028 2.09031 54.5572 2.20349C54.7116 2.31666 54.8258 2.47609 54.8834 2.65862L56.4334 7.42529H61.4334C61.6316 7.41779 61.8269 7.47541 61.9893 7.58932C62.1517 7.70324 62.2723 7.86719 62.3328 8.05614C62.3933 8.24508 62.3902 8.44862 62.3241 8.63567C62.258 8.82271 62.1325 8.98297 61.9667 9.09196L57.9084 12.0336L59.4584 16.8086C59.5197 16.9905 59.5212 17.1872 59.4628 17.3701C59.4043 17.5529 59.289 17.7122 59.1336 17.8249C58.9781 17.9375 58.7908 17.9975 58.5988 17.996C58.4069 17.9946 58.2204 17.9319 58.0667 17.817L54 14.842L49.9417 17.792C49.788 17.9069 49.6015 17.9696 49.4096 17.971C49.2176 17.9725 49.0303 17.9125 48.8748 17.7999C48.7194 17.6872 48.6041 17.5279 48.5456 17.3451C48.4872 17.1622 48.4887 16.9655 48.55 16.7836L50.1 12.0086L46.0417 9.06696C45.8759 8.95797 45.7504 8.79771 45.6843 8.61067C45.6182 8.42363 45.6151 8.22008 45.6756 8.03114C45.7361 7.84219 45.8567 7.67824 46.0191 7.56432C46.1816 7.45041 46.3768 7.39279 46.575 7.40029H51.575L53.1667 2.65862Z" fill="#FBAD39" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M75.1667 2.65862C75.2243 2.47609 75.3385 2.31666 75.4929 2.20349C75.6472 2.09031 75.8336 2.0293 76.025 2.0293C76.2164 2.0293 76.4028 2.09031 76.5572 2.20349C76.7116 2.31666 76.8258 2.47609 76.8834 2.65862L78.4334 7.42529H83.4334C83.6316 7.41779 83.8269 7.47541 83.9893 7.58932C84.1517 7.70324 84.2723 7.86719 84.3328 8.05614C84.3933 8.24508 84.3902 8.44862 84.3241 8.63567C84.258 8.82271 84.1325 8.98297 83.9667 9.09196L79.9084 12.0336L81.4584 16.8086C81.5197 16.9905 81.5212 17.1872 81.4628 17.3701C81.4043 17.5529 81.289 17.7122 81.1336 17.8249C80.9781 17.9375 80.7908 17.9975 80.5988 17.996C80.4069 17.9946 80.2204 17.9319 80.0667 17.817L76 14.842L71.9417 17.792C71.788 17.9069 71.6015 17.9696 71.4096 17.971C71.2176 17.9725 71.0303 17.9125 70.8748 17.7999C70.7194 17.6872 70.6041 17.5279 70.5456 17.3451C70.4872 17.1622 70.4887 16.9655 70.55 16.7836L72.1 12.0086L68.0417 9.06696C67.8759 8.95797 67.7504 8.79771 67.6843 8.61067C67.6182 8.42362 67.6151 8.22008 67.6756 8.03114C67.7361 7.84219 67.8567 7.67824 68.0191 7.56432C68.1816 7.45041 68.3768 7.39279 68.575 7.40029H73.575L75.1667 2.65862Z" fill="#FBAD39" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M97.1667 2.65862C97.2243 2.47609 97.3385 2.31666 97.4929 2.20349C97.6472 2.09031 97.8336 2.0293 98.025 2.0293C98.2164 2.0293 98.4028 2.09031 98.5572 2.20349C98.7116 2.31666 98.8258 2.47609 98.8834 2.65862L100.433 7.42529H105.433C105.632 7.41779 105.827 7.47541 105.989 7.58932C106.152 7.70324 106.272 7.86719 106.333 8.05614C106.393 8.24508 106.39 8.44862 106.324 8.63567C106.258 8.82271 106.132 8.98297 105.967 9.09196L101.908 12.0336L103.458 16.8086C103.52 16.9905 103.521 17.1872 103.463 17.3701C103.404 17.5529 103.289 17.7122 103.134 17.8249C102.978 17.9375 102.791 17.9975 102.599 17.996C102.407 17.9946 102.22 17.9319 102.067 17.817L98 14.842L93.9417 17.792C93.788 17.9069 93.6015 17.9696 93.4096 17.971C93.2176 17.9725 93.0303 17.9125 92.8748 17.7999C92.7194 17.6872 92.6041 17.5279 92.5456 17.3451C92.4872 17.1622 92.4887 16.9655 92.55 16.7836L94.1 12.0086L90.0417 9.06696C89.8759 8.95797 89.7504 8.79771 89.6843 8.61067C89.6182 8.42363 89.6151 8.22008 89.6756 8.03114C89.7361 7.84219 89.8567 7.67824 90.0191 7.56432C90.1816 7.45041 90.3768 7.39279 90.575 7.40029H95.575L97.1667 2.65862Z" stroke="#90A3BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_35_8274">
                                                        <rect width="108" height="20" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[12px] md:text-[14] text-[#596780]">We are greatly helped by the services of the MORENT Application. Morent has low prices and also a wide variety of cars with good and comfortable facilities. In addition, the service provided by the officers is also very friendly and very polite.</p>
                            </div>
                            <div className="flex justify-center pt-10">
                                <button className="text-[#90A3BF] text-[12px] md:text-[16px] font-medium">Show All</button>
                            </div>
                        </div>



                        {/* Recent Cars  */}
                        <div className="flex justify-between px-4 py-7 lg:pt-10">
                            <h1 className="text-[16px] text-[#90A3BF] font-semibold ">Recent Cars</h1>
                            <button className="text-[#3563E9] text-[16px] font-semibold">View All</button>
                        </div>
                        <div className="place-items-center grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-10 lg:grid-cols-3 2xl:grid-cols-4 lg:gap-20">
                            {
                                Popular_list.map((car) => {
                                    const isLiked = likedItems[car.id];
                                    return (
                                        <div
                                            key={car.id}
                                            className="min-w-[310px] md:min-w-[250px] md:max-w-[400px] h-auto p-5 bg-white rounded-lg shadow-md space-y-6 md:space-y-28"
                                        >
        
                                            {/* Header Section */}
                                            <div className="flex justify-between items-center">
                                                <h1 className="text-[18px] font-bold text-[#1A202C]">
                                                    {car.name}
                                                    <br />
                                                    <span className="text-[14px] text-[#90A3BF]">{car.category}</span>
                                                </h1>
                                                <svg
                                                    onClick={() => toggleLike(car.id.toString())}
                                                    className="cursor-pointer"
                                                    id="heart-icon"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill={isLiked ? "red" : "none"}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M12.62 20.8096C12.28 20.9296 11.72 20.9296 11.38 20.8096C8.48 19.8196 2 15.6896 2 8.68961C2 5.59961 4.49 3.09961 7.56 3.09961C9.38 3.09961 10.99 3.97961 12 5.33961C13.01 3.97961 14.63 3.09961 16.44 3.09961C19.51 3.09961 22 5.59961 22 8.68961C22 15.6896 15.52 19.8196 12.62 20.8096Z"
                                                        stroke={isLiked ? "red" : "#90A3BF"}
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </div>
        
                                            {/* Image and Features Section */}
                                            <div className="flex flex-row md:flex-col items-center gap-5">
                                                <Image
                                                    className="md:w-[250px] w-[180px] h-auto object-cover rounded-md"
                                                    src={car.image}
                                                    alt={car.name}
                                                />
                                                <div className="flex flex-col md:hidden justify-between h-full items-start gap-12">
                                                    <div className="flex gap-1">
                                                        <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M21.34 7.33L19.34 6.33C18.97 6.15 18.51 6.29 18.33 6.66C18.14 7.04 18.29 7.49 18.66 7.67L20.25 8.46V13.25L16.5 13.26V3C16.5 1 15.16 0 13.5 0H5.5C3.84 0 2.5 1 2.5 3V19.25H1C0.59 19.25 0.25 19.59 0.25 20C0.25 20.41 0.59 20.75 1 20.75H18C18.41 20.75 18.75 20.41 18.75 20C18.75 19.59 18.41 19.25 18 19.25H16.5V14.76L21 14.75C21.42 14.75 21.75 14.41 21.75 14V8C21.75 7.72 21.59 7.46 21.34 7.33ZM5 4.89C5 3.5 5.85 3 6.89 3H12.12C13.15 3 14 3.5 14 4.89V6.12C14 7.5 13.15 8 12.11 8H6.89C5.85 8 5 7.5 5 6.11V4.89ZM5.5 10.25H8.5C8.91 10.25 9.25 10.59 9.25 11C9.25 11.41 8.91 11.75 8.5 11.75H5.5C5.09 11.75 4.75 11.41 4.75 11C4.75 10.59 5.09 10.25 5.5 10.25Z" fill="#90A3BF" />
                                                        </svg>
                                                        <p className="text-[16px] text-[#90A3BF] font-medium">{car.fuel}L</p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.53 2 12 2Z" fill="#90A3BF" />
                                                            <rect x="4" y="4" width="16" height="16" rx="8" fill="white" />
                                                            <path d="M12 6C8.688 6 6 8.688 6 12C6 15.312 8.688 18 12 18C15.312 18 18 15.312 18 12C18 8.688 15.318 6 12 6Z" fill="#90A3BF" />
                                                            <rect x="8" y="8" width="8" height="8" rx="4" fill="white" />
                                                            <rect x="11" y="17" width="2" height="4" fill="#90A3BF" />
                                                            <rect x="17" y="11" width="4" height="2" fill="#90A3BF" />
                                                            <rect x="3" y="11" width="4" height="2" fill="#90A3BF" />
                                                        </svg>
                                                        <p className="text-[16px] text-[#90A3BF] font-medium">{car.mode}</p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9 2C6.38 2 4.25 4.13 4.25 6.75C4.25 9.32 6.26 11.4 8.88 11.49C8.96 11.48 9.04 11.48 9.1 11.49C9.12 11.49 9.13 11.49 9.15 11.49C9.16 11.49 9.16 11.49 9.17 11.49C11.73 11.4 13.74 9.32 13.75 6.75C13.75 4.13 11.62 2 9 2Z" fill="#90A3BF" />
                                                            <path d="M14.08 14.1499C11.29 12.2899 6.73996 12.2899 3.92996 14.1499C2.65996 14.9999 1.95996 16.1499 1.95996 17.3799C1.95996 18.6099 2.65996 19.7499 3.91996 20.5899C5.31996 21.5299 7.15996 21.9999 8.99996 21.9999C10.84 21.9999 12.68 21.5299 14.08 20.5899C15.34 19.7399 16.04 18.5999 16.04 17.3599C16.03 16.1299 15.34 14.9899 14.08 14.1499Z" fill="#90A3BF" />
                                                            <path d="M19.9904 7.3401C20.1504 9.2801 18.7704 10.9801 16.8604 11.2101C16.8504 11.2101 16.8504 11.2101 16.8404 11.2101H16.8104C16.7504 11.2101 16.6904 11.2101 16.6404 11.2301C15.6704 11.2801 14.7804 10.9701 14.1104 10.4001C15.1404 9.4801 15.7304 8.1001 15.6104 6.6001C15.5404 5.7901 15.2604 5.0501 14.8404 4.4201C15.2204 4.2301 15.6604 4.1101 16.1104 4.0701C18.0704 3.9001 19.8204 5.3601 19.9904 7.3401Z" fill="#90A3BF" />
                                                            <path d="M21.9902 16.5904C21.9102 17.5604 21.2902 18.4004 20.2502 18.9704C19.2502 19.5204 17.9902 19.7804 16.7402 19.7504C17.4602 19.1004 17.8802 18.2904 17.9602 17.4304C18.0602 16.1904 17.4702 15.0004 16.2902 14.0504C15.6202 13.5204 14.8402 13.1004 13.9902 12.7904C16.2002 12.1504 18.9802 12.5804 20.6902 13.9604C21.6102 14.7004 22.0802 15.6304 21.9902 16.5904Z" fill="#90A3BF" />
                                                        </svg>
                                                        <p className="text-[16px] text-[#90A3BF] font-medium">{car.capacity}People</p>
                                                    </div>
                                                </div>
                                            </div>
                                             {/* Footer Section */}
                                             <div className="space-y-5">
                                            <div className="hidden md:flex justify-between">
                                                        <div className="flex gap-1 ">
                                                            <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M21.34 7.33L19.34 6.33C18.97 6.15 18.51 6.29 18.33 6.66C18.14 7.04 18.29 7.49 18.66 7.67L20.25 8.46V13.25L16.5 13.26V3C16.5 1 15.16 0 13.5 0H5.5C3.84 0 2.5 1 2.5 3V19.25H1C0.59 19.25 0.25 19.59 0.25 20C0.25 20.41 0.59 20.75 1 20.75H18C18.41 20.75 18.75 20.41 18.75 20C18.75 19.59 18.41 19.25 18 19.25H16.5V14.76L21 14.75C21.42 14.75 21.75 14.41 21.75 14V8C21.75 7.72 21.59 7.46 21.34 7.33ZM5 4.89C5 3.5 5.85 3 6.89 3H12.12C13.15 3 14 3.5 14 4.89V6.12C14 7.5 13.15 8 12.11 8H6.89C5.85 8 5 7.5 5 6.11V4.89ZM5.5 10.25H8.5C8.91 10.25 9.25 10.59 9.25 11C9.25 11.41 8.91 11.75 8.5 11.75H5.5C5.09 11.75 4.75 11.41 4.75 11C4.75 10.59 5.09 10.25 5.5 10.25Z" fill="#90A3BF" />
                                                            </svg>
                                                            <p className="text-[16px] text-[#90A3BF] font-medium">{car.fuel}L</p>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.53 2 12 2Z" fill="#90A3BF" />
                                                                <rect x="4" y="4" width="16" height="16" rx="8" fill="white" />
                                                                <path d="M12 6C8.688 6 6 8.688 6 12C6 15.312 8.688 18 12 18C15.312 18 18 15.312 18 12C18 8.688 15.318 6 12 6Z" fill="#90A3BF" />
                                                                <rect x="8" y="8" width="8" height="8" rx="4" fill="white" />
                                                                <rect x="11" y="17" width="2" height="4" fill="#90A3BF" />
                                                                <rect x="17" y="11" width="4" height="2" fill="#90A3BF" />
                                                                <rect x="3" y="11" width="4" height="2" fill="#90A3BF" />
                                                            </svg>
                                                            <p className="text-[16px] text-[#90A3BF] font-medium">{car.mode}</p>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M9 2C6.38 2 4.25 4.13 4.25 6.75C4.25 9.32 6.26 11.4 8.88 11.49C8.96 11.48 9.04 11.48 9.1 11.49C9.12 11.49 9.13 11.49 9.15 11.49C9.16 11.49 9.16 11.49 9.17 11.49C11.73 11.4 13.74 9.32 13.75 6.75C13.75 4.13 11.62 2 9 2Z" fill="#90A3BF" />
                                                                <path d="M14.08 14.1499C11.29 12.2899 6.73996 12.2899 3.92996 14.1499C2.65996 14.9999 1.95996 16.1499 1.95996 17.3799C1.95996 18.6099 2.65996 19.7499 3.91996 20.5899C5.31996 21.5299 7.15996 21.9999 8.99996 21.9999C10.84 21.9999 12.68 21.5299 14.08 20.5899C15.34 19.7399 16.04 18.5999 16.04 17.3599C16.03 16.1299 15.34 14.9899 14.08 14.1499Z" fill="#90A3BF" />
                                                                <path d="M19.9904 7.3401C20.1504 9.2801 18.7704 10.9801 16.8604 11.2101C16.8504 11.2101 16.8504 11.2101 16.8404 11.2101H16.8104C16.7504 11.2101 16.6904 11.2101 16.6404 11.2301C15.6704 11.2801 14.7804 10.9701 14.1104 10.4001C15.1404 9.4801 15.7304 8.1001 15.6104 6.6001C15.5404 5.7901 15.2604 5.0501 14.8404 4.4201C15.2204 4.2301 15.6604 4.1101 16.1104 4.0701C18.0704 3.9001 19.8204 5.3601 19.9904 7.3401Z" fill="#90A3BF" />
                                                                <path d="M21.9902 16.5904C21.9102 17.5604 21.2902 18.4004 20.2502 18.9704C19.2502 19.5204 17.9902 19.7804 16.7402 19.7504C17.4602 19.1004 17.8802 18.2904 17.9602 17.4304C18.0602 16.1904 17.4702 15.0004 16.2902 14.0504C15.6202 13.5204 14.8402 13.1004 13.9902 12.7904C16.2002 12.1504 18.9802 12.5804 20.6902 13.9604C21.6102 14.7004 22.0802 15.6304 21.9902 16.5904Z" fill="#90A3BF" />
                                                            </svg>
                                                            <p className="text-[16px] text-[#90A3BF] font-medium">{car.capacity}People</p>
                                                        </div>
                                                        {/* </div> */}
                                                    </div>
                                            <div className="flex justify-between items-center">
                                                <h2 className="text-[20px] font-bold text-[#1A202C]">
                                                    ${car.price}.00/
                                                    <span className="text-[16px] text-[#90A3BF]">day</span>
                                                </h2>
                                                <Link href="../category">
                                                    <button className="px-4 py-2 bg-[#3563E9] text-white font-semibold rounded-lg">
                                                        Rent Now
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                        </div>
                                    );
                                })
                            }
                        </div>


                        {/* Recomended Cars  */}

                        <div className="flex justify-between px-4 py-7 lg:pt-10">
                            <h1 className="text-[16px] text-[#90A3BF] font-semibold">Recomended Cars</h1>
                            <Link href="../category/"><button className="text-[#3563E9] text-[16px] font-semibold">View All</button></Link>
                        </div>
                        <div className="place-items-center grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-10 lg:grid-cols-3 2xl:grid-cols-4 lg:gap-20">
                            {
                                Recomended_list.map((car) => {
                                    const isLiked = likedItems[car.id];
                                    return (
                                        <div
                                            key={car.id}
                                            className="min-w-[270px] md:min-w-[250px] md:max-w-[300px] h-auto p-5 bg-white rounded-lg shadow-md space-y-6 md:space-y-28"
                                        >
        
                                            {/* Header Section */}
                                            <div className="flex justify-between items-center">
                                                <h1 className="text-[18px] font-bold text-[#1A202C]">
                                                    {car.name}
                                                    <br />
                                                    <span className="text-[14px] text-[#90A3BF]">{car.category}</span>
                                                </h1>
                                                <svg
                                                    onClick={() => toggleLike(car.id.toString())}
                                                    className="cursor-pointer"
                                                    id="heart-icon"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill={isLiked ? "red" : "none"}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M12.62 20.8096C12.28 20.9296 11.72 20.9296 11.38 20.8096C8.48 19.8196 2 15.6896 2 8.68961C2 5.59961 4.49 3.09961 7.56 3.09961C9.38 3.09961 10.99 3.97961 12 5.33961C13.01 3.97961 14.63 3.09961 16.44 3.09961C19.51 3.09961 22 5.59961 22 8.68961C22 15.6896 15.52 19.8196 12.62 20.8096Z"
                                                        stroke={isLiked ? "red" : "#90A3BF"}
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </div>
        
                                            {/* Image and Features Section */}
                                            <div className="flex flex-row md:flex-col items-center gap-5">
                                                <Image
                                                    className="md:w-[400px] w-[150px] h-auto object-cover rounded-md"
                                                    src={car.image}
                                                    alt={car.name}
                                                />
                                                <div className="flex flex-col md:hidden justify-between h-full items-start gap-12">
                                                    <div className="flex gap-1">
                                                        <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M21.34 7.33L19.34 6.33C18.97 6.15 18.51 6.29 18.33 6.66C18.14 7.04 18.29 7.49 18.66 7.67L20.25 8.46V13.25L16.5 13.26V3C16.5 1 15.16 0 13.5 0H5.5C3.84 0 2.5 1 2.5 3V19.25H1C0.59 19.25 0.25 19.59 0.25 20C0.25 20.41 0.59 20.75 1 20.75H18C18.41 20.75 18.75 20.41 18.75 20C18.75 19.59 18.41 19.25 18 19.25H16.5V14.76L21 14.75C21.42 14.75 21.75 14.41 21.75 14V8C21.75 7.72 21.59 7.46 21.34 7.33ZM5 4.89C5 3.5 5.85 3 6.89 3H12.12C13.15 3 14 3.5 14 4.89V6.12C14 7.5 13.15 8 12.11 8H6.89C5.85 8 5 7.5 5 6.11V4.89ZM5.5 10.25H8.5C8.91 10.25 9.25 10.59 9.25 11C9.25 11.41 8.91 11.75 8.5 11.75H5.5C5.09 11.75 4.75 11.41 4.75 11C4.75 10.59 5.09 10.25 5.5 10.25Z" fill="#90A3BF" />
                                                        </svg>
                                                        <p className="text-[16px] text-[#90A3BF] font-medium">{car.fuel}L</p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.53 2 12 2Z" fill="#90A3BF" />
                                                            <rect x="4" y="4" width="16" height="16" rx="8" fill="white" />
                                                            <path d="M12 6C8.688 6 6 8.688 6 12C6 15.312 8.688 18 12 18C15.312 18 18 15.312 18 12C18 8.688 15.318 6 12 6Z" fill="#90A3BF" />
                                                            <rect x="8" y="8" width="8" height="8" rx="4" fill="white" />
                                                            <rect x="11" y="17" width="2" height="4" fill="#90A3BF" />
                                                            <rect x="17" y="11" width="4" height="2" fill="#90A3BF" />
                                                            <rect x="3" y="11" width="4" height="2" fill="#90A3BF" />
                                                        </svg>
                                                        <p className="text-[16px] text-[#90A3BF] font-medium">{car.mode}</p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9 2C6.38 2 4.25 4.13 4.25 6.75C4.25 9.32 6.26 11.4 8.88 11.49C8.96 11.48 9.04 11.48 9.1 11.49C9.12 11.49 9.13 11.49 9.15 11.49C9.16 11.49 9.16 11.49 9.17 11.49C11.73 11.4 13.74 9.32 13.75 6.75C13.75 4.13 11.62 2 9 2Z" fill="#90A3BF" />
                                                            <path d="M14.08 14.1499C11.29 12.2899 6.73996 12.2899 3.92996 14.1499C2.65996 14.9999 1.95996 16.1499 1.95996 17.3799C1.95996 18.6099 2.65996 19.7499 3.91996 20.5899C5.31996 21.5299 7.15996 21.9999 8.99996 21.9999C10.84 21.9999 12.68 21.5299 14.08 20.5899C15.34 19.7399 16.04 18.5999 16.04 17.3599C16.03 16.1299 15.34 14.9899 14.08 14.1499Z" fill="#90A3BF" />
                                                            <path d="M19.9904 7.3401C20.1504 9.2801 18.7704 10.9801 16.8604 11.2101C16.8504 11.2101 16.8504 11.2101 16.8404 11.2101H16.8104C16.7504 11.2101 16.6904 11.2101 16.6404 11.2301C15.6704 11.2801 14.7804 10.9701 14.1104 10.4001C15.1404 9.4801 15.7304 8.1001 15.6104 6.6001C15.5404 5.7901 15.2604 5.0501 14.8404 4.4201C15.2204 4.2301 15.6604 4.1101 16.1104 4.0701C18.0704 3.9001 19.8204 5.3601 19.9904 7.3401Z" fill="#90A3BF" />
                                                            <path d="M21.9902 16.5904C21.9102 17.5604 21.2902 18.4004 20.2502 18.9704C19.2502 19.5204 17.9902 19.7804 16.7402 19.7504C17.4602 19.1004 17.8802 18.2904 17.9602 17.4304C18.0602 16.1904 17.4702 15.0004 16.2902 14.0504C15.6202 13.5204 14.8402 13.1004 13.9902 12.7904C16.2002 12.1504 18.9802 12.5804 20.6902 13.9604C21.6102 14.7004 22.0802 15.6304 21.9902 16.5904Z" fill="#90A3BF" />
                                                        </svg>
                                                        <p className="text-[16px] text-[#90A3BF] font-medium">{car.capacity}People</p>
                                                    </div>
                                                </div>
                                            </div>
                                             {/* Footer Section */}
                                             <div className="space-y-5">
                                            <div className="hidden md:flex justify-between">
                                                        <div className="flex gap-1 ">
                                                            <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M21.34 7.33L19.34 6.33C18.97 6.15 18.51 6.29 18.33 6.66C18.14 7.04 18.29 7.49 18.66 7.67L20.25 8.46V13.25L16.5 13.26V3C16.5 1 15.16 0 13.5 0H5.5C3.84 0 2.5 1 2.5 3V19.25H1C0.59 19.25 0.25 19.59 0.25 20C0.25 20.41 0.59 20.75 1 20.75H18C18.41 20.75 18.75 20.41 18.75 20C18.75 19.59 18.41 19.25 18 19.25H16.5V14.76L21 14.75C21.42 14.75 21.75 14.41 21.75 14V8C21.75 7.72 21.59 7.46 21.34 7.33ZM5 4.89C5 3.5 5.85 3 6.89 3H12.12C13.15 3 14 3.5 14 4.89V6.12C14 7.5 13.15 8 12.11 8H6.89C5.85 8 5 7.5 5 6.11V4.89ZM5.5 10.25H8.5C8.91 10.25 9.25 10.59 9.25 11C9.25 11.41 8.91 11.75 8.5 11.75H5.5C5.09 11.75 4.75 11.41 4.75 11C4.75 10.59 5.09 10.25 5.5 10.25Z" fill="#90A3BF" />
                                                            </svg>
                                                            <p className="text-[16px] text-[#90A3BF] font-medium">{car.fuel}L</p>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.53 2 12 2Z" fill="#90A3BF" />
                                                                <rect x="4" y="4" width="16" height="16" rx="8" fill="white" />
                                                                <path d="M12 6C8.688 6 6 8.688 6 12C6 15.312 8.688 18 12 18C15.312 18 18 15.312 18 12C18 8.688 15.318 6 12 6Z" fill="#90A3BF" />
                                                                <rect x="8" y="8" width="8" height="8" rx="4" fill="white" />
                                                                <rect x="11" y="17" width="2" height="4" fill="#90A3BF" />
                                                                <rect x="17" y="11" width="4" height="2" fill="#90A3BF" />
                                                                <rect x="3" y="11" width="4" height="2" fill="#90A3BF" />
                                                            </svg>
                                                            <p className="text-[16px] text-[#90A3BF] font-medium">{car.mode}</p>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M9 2C6.38 2 4.25 4.13 4.25 6.75C4.25 9.32 6.26 11.4 8.88 11.49C8.96 11.48 9.04 11.48 9.1 11.49C9.12 11.49 9.13 11.49 9.15 11.49C9.16 11.49 9.16 11.49 9.17 11.49C11.73 11.4 13.74 9.32 13.75 6.75C13.75 4.13 11.62 2 9 2Z" fill="#90A3BF" />
                                                                <path d="M14.08 14.1499C11.29 12.2899 6.73996 12.2899 3.92996 14.1499C2.65996 14.9999 1.95996 16.1499 1.95996 17.3799C1.95996 18.6099 2.65996 19.7499 3.91996 20.5899C5.31996 21.5299 7.15996 21.9999 8.99996 21.9999C10.84 21.9999 12.68 21.5299 14.08 20.5899C15.34 19.7399 16.04 18.5999 16.04 17.3599C16.03 16.1299 15.34 14.9899 14.08 14.1499Z" fill="#90A3BF" />
                                                                <path d="M19.9904 7.3401C20.1504 9.2801 18.7704 10.9801 16.8604 11.2101C16.8504 11.2101 16.8504 11.2101 16.8404 11.2101H16.8104C16.7504 11.2101 16.6904 11.2101 16.6404 11.2301C15.6704 11.2801 14.7804 10.9701 14.1104 10.4001C15.1404 9.4801 15.7304 8.1001 15.6104 6.6001C15.5404 5.7901 15.2604 5.0501 14.8404 4.4201C15.2204 4.2301 15.6604 4.1101 16.1104 4.0701C18.0704 3.9001 19.8204 5.3601 19.9904 7.3401Z" fill="#90A3BF" />
                                                                <path d="M21.9902 16.5904C21.9102 17.5604 21.2902 18.4004 20.2502 18.9704C19.2502 19.5204 17.9902 19.7804 16.7402 19.7504C17.4602 19.1004 17.8802 18.2904 17.9602 17.4304C18.0602 16.1904 17.4702 15.0004 16.2902 14.0504C15.6202 13.5204 14.8402 13.1004 13.9902 12.7904C16.2002 12.1504 18.9802 12.5804 20.6902 13.9604C21.6102 14.7004 22.0802 15.6304 21.9902 16.5904Z" fill="#90A3BF" />
                                                            </svg>
                                                            <p className="text-[16px] text-[#90A3BF] font-medium">{car.capacity}People</p>
                                                        </div>
                                                        {/* </div> */}
                                                    </div>
                                            <div className="flex justify-between items-center">
                                                <h2 className="text-[20px] font-bold text-[#1A202C]">
                                                    ${car.price}.00/
                                                    <span className="text-[16px] text-[#90A3BF]">day</span>
                                                </h2>
                                                <Link href="../billing/">
                                                    <button className="px-4 py-2 bg-[#3563E9] text-white font-semibold rounded-lg">
                                                        Rent Now
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}