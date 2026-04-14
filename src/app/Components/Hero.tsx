import Image from "next/image";
import Link from "next/link";

import Ad1 from "@/Public/Ads1.png"
import Ad2 from "@/Public/Ads2.png"


export default function Home() {
    return (
        <>
            <main className="w-full bg-[#F6F7F9]">
                <div className="mx-5 md:mx-8 lg:mx-20">
                    {/* Ad Section */}
                    <div className="py-8 md:py-10 lg:py-12 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-10">
                        <div className="relative w-full h-[200px] sm:h-[220px] md:h-[260px] lg:h-[320px] xl:h-[360px] rounded-lg shadow-md overflow-hidden">
                            <Image className="w-full h-full object-cover" src={Ad1} alt="Ad-1" priority />
                            <div className="absolute inset-0 top-4 md:top-5 px-4 md:p-4 lg:p-8 flex flex-col justify-start space-y-2 md:space-y-3 lg:space-y-6 text-white">
                                <h1 className="w-48 md:w-56 lg:w-[330px] text-[16px] sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[32px] font-semibold leading-tight">
                                    The Best Platform For Car Rental
                                </h1>
                                <p className="w-56 lg:w-72 font-medium text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] xl:text-[16px] max-w-[280px]">
                                    Ease of doing a car rental safely and reliably. Of course, at a low price.
                                </p>
                                <Link href="/details/koengseggs">
                                <button className="bg-[#3563E9] hover:bg-[#2851c7] transition-colors text-[12px] sm:text-[14px] lg:text-[16px] shadow-md font-semibold w-[100px] sm:w-[120px] h-[36px] sm:h-[40px] lg:h-[44px] rounded-lg">
                                    Rental Car
                                </button>
                                </Link>
                            </div>
                        </div>
                        <div className="hidden md:block md:relative md:w-full h-[200px] sm:h-[220px] md:h-[260px] lg:h-[320px] xl:h-[360px] rounded-lg shadow-md overflow-hidden">
                            <Image className="w-full h-full object-cover" src={Ad2} alt="Ad-2" />
                            <div className="absolute inset-0 top-4 md:top-5 p-2 md:p-4 lg:p-8 flex flex-col justify-start space-y-2 md:space-y-3 lg:space-y-6 text-white">
                                <h1 className="w-52 md:w-72 lg:w-96 text-[16px] sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[32px] font-semibold leading-tight">
                                    Easy way to rent a car at a low price
                                </h1>
                                <p className="w-56 lg:w-72 font-medium text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] xl:text-[16px] max-w-[280px]">
                                    Providing cheap car rental services and safe and comfortable facilities.
                                </p>
                                <Link href="/details/nissan_gt_r">
                                <button className="bg-[#54A6FF] hover:bg-[#3d8de8] transition-colors text-[12px] sm:text-[14px] lg:text-[16px] shadow-md font-semibold w-[100px] sm:w-[120px] h-[36px] sm:h-[40px] lg:h-[44px] rounded-lg">
                                    Rental Car
                                </button></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
