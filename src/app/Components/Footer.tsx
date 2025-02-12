import Link from "next/link"

export default function Footer() {
    return (
        <>
            <main className="bg-white w-full drop-shadow-lg">
                <div className="mx-5 lg:mx-20 py-5 md:py-10 lg:py-14">
                    <div className="lg:flex lg:justify-between gap-10 space-y-8 lg:space-y-0">
                        <div className="w-auto space-y-1 md:space-y-3 place-items-center lg:place-items-start">
                        <Link href='../'><h1 className="cursor-pointer font-bold text-[#3563E9] text-[32px]">MORENT</h1></Link>
                            <p className="md:text-[16px] text-[14px] opacity-40 text-[#131313] font-medium text-center lg:text-left">Our vision is to provide convenience and help increase your sales business.</p>
                        </div>
                        <div className="lg:flex lg:gap-52 mr-0 xl:mr-24 grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-0">
                            <div className="md:space-y-4 space-y-2">
                                <h2 className="text-[#1A202C] md:text-[20px] text-[16px] font-medium mb-2 md:mb-8">About</h2>
                                <p className="text-[#131313] opacity-60 text-[12px] md:text-[14px] whitespace-nowrap">How it works</p>
                                <p className="text-[#131313] opacity-60 text-[12px] md:text-[14px]">Featured</p>
                                <p className="text-[#131313] opacity-60 text-[12px] md:text-[14px]">Partnership</p>
                                <p className="text-[#131313] opacity-60 text-[12px] md:text-[14px]">Bussiness Relation</p>
                            </div>
                            <div className="md:space-y-4 space-y-2 text-right md:text-center lg:text-left">
                            <h2 className="text-[#1A202C] md:text-[20px] text-[16px] font-medium mb-2 md:mb-8">Community</h2>
                                <p className="text-[#131313] opacity-60 text-[12px] md:text-[14px]">Events</p>
                                <p className="text-[#131313] opacity-60 text-[12px] md:text-[14px]">Blog</p>
                                <p className="text-[#131313] opacity-60 text-[12px] md:text-[14px]">Podcast</p>
                                <p className="text-[#131313] opacity-60 text-[12px] md:text-[14px]">Invite a friend</p>
                            </div>
                            <div className="md:space-y-4 space-y-2 text-left md:text-right lg:text-left">
                                <h2 className="text-[#1A202C] md:text-[20px] text-[16px] font-medium mb-2 md:mb-8">Socials</h2>
                                <p className="text-[#131313] opacity-60 text-[12px] md:text-[14px]">Discord</p>
                                <p className="text-[#131313] opacity-60 text-[12px] md:text-[14px]">Instagram</p>    
                                <p className="text-[#131313] opacity-60 text-[12px] md:text-[14px]">Twitter</p>
                                <p className="text-[#131313] opacity-60 text-[12px] md:text-[14px]">Facebook</p>
                                </div>
                        </div>
                    </div>
                    <hr className="mt-10"/>
                    <div className="flex flex-col md:flex-row md:justify-between mt-8 text-[#1A202C] text-[12px] md:text-[16px] gap-3 font-semibold">
                        <h6 className="order-2 md:order-1">©2022 MORENT. All rights reserved</h6>  
                        <div className="flex justify-between order-1 md:order-2 gap-16">
                            <h6>Privacy & Policy</h6>
                            <h6>Terms & Conditions</h6>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}