import Image from "next/image";

import Ad1 from "@/Public/Ads1.png"
import Ad2 from "@/Public/Ads2.png"


export default function Home() {
    return (
        <>
            <main className="w-full bg-[#F6F7F9]">
                <div className="mx-4 md:mx-8 lg:mx-20">
                    {/* Ad Section */}
                    <div className="py-12 grid grid-cols-1 md:grid-cols-2 md:gap-10">
                        <div className="relative w-full h-[250px] sm:h-[300px] lg:h-[350px] rounded-lg">
                            <Image className="w-full h-full rounded-lg" src={Ad1} alt="Ad-1" />
                            <div className="w-[300px] absolute top-5 left-7 space-y-3 sm:space-y-5 text-white">
                                <h1 className="text-[20px] sm:text-[24px] lg:text-[32px] font-semibold leading-relaxed">
                                    The Best Platform For Car Rental
                                </h1>
                                <p className="font-medium text-[12px] sm:text-[14px] lg:text-[16px]">
                                    Ease of doing a car rental safely and reliably. Of course, at a low price.
                                </p>
                                <button className="bg-[#3563E9] text-[12px] sm:text-[14px] lg:text-[16px] font-semibold w-[100px] sm:w-[120px] h-[36px] sm:h-[44px] rounded-lg">
                                    Rental Car
                                </button>
                            </div>
                        </div>
                        <div className="hidden sm:hidden md:block md:relative md:w-full h-[250px] sm:h-[300px] lg:h-[350px] rounded-lg">
                            <Image className="w-full h-full rounded-lg" src={Ad2} alt="Ad-2" />
                            <div className="w-[300px] absolute top-5 left-7 space-y-3 sm:space-y-5 text-white">
                                <h1 className="text-[20px] sm:text-[24px] lg:text-[32px] font-semibold leading-relaxed">
                                    Easy way to rent a car at a low price
                                </h1>
                                <p className="font-medium text-[12px] sm:text-[14px] lg:text-[16px]">
                                    Providing cheap car rental services and safe and comfortable facilities.
                                </p>
                                <button className="bg-[#54A6FF] text-[12px] sm:text-[14px] lg:text-[16px] font-semibold w-[100px] sm:w-[120px] h-[36px] sm:h-[44px] rounded-lg">
                                    Rental Car
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}