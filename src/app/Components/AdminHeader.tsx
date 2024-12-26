"use client";
import { useState } from 'react';
import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";
import Link from "next/link"

import Image from "next/image"
import p1 from "../../Public/p1.png"
import Dashboard from './Dashboard';
export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false); // State to manage menu visibility

    const toggleMenu = () => {
        setMenuOpen(!menuOpen); // Toggle the menu
    }

    return (
        <>
            <div className="h-60 lg:h-[70px] w-full border-b-[1px] border-black border-opacity-20 bg-white">
                <main className="mx-5 md:mx-8 lg:mx-20">
                    <div className='flex justify-between items-center'>
                        <div className="lg:hidden ">
                            <button onClick={toggleMenu} className="text-3xl mr-3 md:mr-0 text-black">
                                <Menu />
                            </button>
                        </div>
                        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                            <SheetContent side="left" className="bg-white">
                                <Dashboard />
                            </SheetContent>
                        </Sheet>


                        <Link href='../'><h1 className="cursor-pointer font-bold hidden lg:block text-[#3563E9] text-[32px]">MORENT</h1></Link>


                        {/* Search Area  */}
                        <div className="hidden lg:w-[450px] xl:w-[600px] lg:relative lg:flex lg:items-center gap-5">
                            <svg className="absolute lg:left-24 xl:left-44" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" stroke="#596780" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M22 22L20 20" stroke="#596780" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                            <input type="search" className="w-full py-4 lg:px-14 lg:ml-20 xl:ml-40 px-12 rounded-full border border-[#C3D4E9] focus:border-[#C3D4E9] border-opacity-40 outline-none text-left text-gray-700" placeholder="Search Something here" />

                            <svg className="absolute right-3" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 6.5H16" stroke="#596780" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6 6.5H2" stroke="#596780" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10 10C11.933 10 13.5 8.433 13.5 6.5C13.5 4.567 11.933 3 10 3C8.067 3 6.5 4.567 6.5 6.5C6.5 8.433 8.067 10 10 10Z" stroke="#596780" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M22 17.5H18" stroke="#596780" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 17.5H2" stroke="#596780" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 21C15.933 21 17.5 19.433 17.5 17.5C17.5 15.567 15.933 14 14 14C12.067 14 10.5 15.567 10.5 17.5C10.5 19.433 12.067 21 14 21Z" stroke="#596780" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                        </div>


                        {/* Side area  */}
                        <aside className="flex lg:ml-auto text-[#C3D4E9] text-lg py-4 gap-5">
                            <div className="hidden lg:flex lg:items-center lg:justify-center w-[44px] h-[44px] rounded-full border-[1px] border-[#C3D4E9] border-opacity-40">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.44 3.09961C14.63 3.09961 13.01 3.97961 12 5.32961C10.99 3.97961 9.37 3.09961 7.56 3.09961C4.49 3.09961 2 5.59961 2 8.68961C2 9.87961 2.19 10.9796 2.52 11.9996C4.1 16.9996 8.97 19.9896 11.38 20.8096C11.72 20.9296 12.28 20.9296 12.62 20.8096C15.03 19.9896 19.9 16.9996 21.48 11.9996C21.81 10.9796 22 9.87961 22 8.68961C22 5.59961 19.51 3.09961 16.44 3.09961Z" fill="#596780" />
                                </svg>
                            </div>
                            <div className="hidden relative lg:flex lg:items-center lg:justify-center w-[44px] h-[44px] rounded-full border-[1px] border-[#C3D4E9] border-opacity-40">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19.3399 14.49L18.3399 12.83C18.1299 12.46 17.9399 11.76 17.9399 11.35V8.82C17.9399 6.47 16.5599 4.44 14.5699 3.49C14.0499 2.57 13.0899 2 11.9899 2C10.8999 2 9.91994 2.59 9.39994 3.52C7.44994 4.49 6.09994 6.5 6.09994 8.82V11.35C6.09994 11.76 5.90994 12.46 5.69994 12.82L4.68994 14.49C4.28994 15.16 4.19994 15.9 4.44994 16.58C4.68994 17.25 5.25994 17.77 5.99994 18.02C7.93994 18.68 9.97994 19 12.0199 19C14.0599 19 16.0999 18.68 18.0399 18.03C18.7399 17.8 19.2799 17.27 19.5399 16.58C19.7999 15.89 19.7299 15.13 19.3399 14.49Z" fill="#596780" />
                                    <path d="M14.8297 20.01C14.4097 21.17 13.2997 22 11.9997 22C11.2097 22 10.4297 21.68 9.87969 21.11C9.55969 20.81 9.31969 20.41 9.17969 20C9.30969 20.02 9.43969 20.03 9.57969 20.05C9.80969 20.08 10.0497 20.11 10.2897 20.13C10.8597 20.18 11.4397 20.21 12.0197 20.21C12.5897 20.21 13.1597 20.18 13.7197 20.13C13.9297 20.11 14.1397 20.1 14.3397 20.07C14.4997 20.05 14.6597 20.03 14.8297 20.01Z" fill="#596780" />
                                </svg>
                                <div className='absolute top-0 right-0 w-4 h-4 rounded-full bg-[#FF4423]' />
                            </div>
                            <div className="hidden lg:flex lg:items-center lg:justify-center w-[44px] h-[44px] rounded-full border-[1px] border-[#C3D4E9] border-opacity-40">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.1 9.22043C18.29 9.22043 17.55 7.94042 18.45 6.37042C18.97 5.46042 18.66 4.30042 17.75 3.78042L16.02 2.79042C15.23 2.32042 14.21 2.60042 13.74 3.39042L13.63 3.58042C12.73 5.15042 11.25 5.15042 10.34 3.58042L10.23 3.39042C9.78 2.60042 8.76 2.32042 7.97 2.79042L6.24 3.78042C5.33 4.30042 5.02 5.47042 5.54 6.38042C6.45 7.94042 5.71 9.22043 3.9 9.22043C2.86 9.22043 2 10.0704 2 11.1204V12.8804C2 13.9204 2.85 14.7804 3.9 14.7804C5.71 14.7804 6.45 16.0604 5.54 17.6304C5.02 18.5404 5.33 19.7004 6.24 20.2204L7.97 21.2104C8.76 21.6804 9.78 21.4004 10.25 20.6104L10.36 20.4204C11.26 18.8504 12.74 18.8504 13.65 20.4204L13.76 20.6104C14.23 21.4004 15.25 21.6804 16.04 21.2104L17.77 20.2204C18.68 19.7004 18.99 18.5304 18.47 17.6304C17.56 16.0604 18.3 14.7804 20.11 14.7804C21.15 14.7804 22.01 13.9304 22.01 12.8804V11.1204C22 10.0804 21.15 9.22043 20.1 9.22043ZM12 15.2504C10.21 15.2504 8.75 13.7904 8.75 12.0004C8.75 10.2104 10.21 8.75042 12 8.75042C13.79 8.75042 15.25 10.2104 15.25 12.0004C15.25 13.7904 13.79 15.2504 12 15.2504Z" fill="#596780" />
                                </svg>

                            </div>
                            <div className="flex items-center justify-center w-[44px] h-[44px] rounded-full border-[1px] border-[#C3D4E9] border-opacity-40">
                                <Image className="w-[44px] h-[44]" src={p1} alt="Profile-pic" />
                            </div>

                        </aside>
                    </div>



                    {/* For small devices */}
                    <div>
                        <Link href="../"><h1 className="cursor-pointer lg:hidden text-[#3563E9] text-[32px]">MORENT</h1></Link>
                    </div>
                    <div className='lg:hidden flex justify-between items-center gap-5'>
                        <div className="lg:hidden relative flex items-center w-full mt-3 gap-5">
                            <svg className="absolute left-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" stroke="#596780" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M22 22L20 20" stroke="#596780" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                            <input type="search" className="w-full py-4 pl-10 sm:px-16 md:px-24 rounded-lg border border-[#C3D4E9] focus:border-[#C3D4E9] border-opacity-40 outline-none text-left text-gray-700" placeholder="Search Something here" />
                        </div>
                        <button className='p-3 mt-3 bg-transparent rounded-lg border border-[#C3D4E9] focus:border-[#C3D4E9] border-opacity-40'>
                            <svg className="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 6.5H16" stroke="#596780" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6 6.5H2" stroke="#596780" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10 10C11.933 10 13.5 8.433 13.5 6.5C13.5 4.567 11.933 3 10 3C8.067 3 6.5 4.567 6.5 6.5C6.5 8.433 8.067 10 10 10Z" stroke="#596780" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M22 17.5H18" stroke="#596780" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 17.5H2" stroke="#596780" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 21C15.933 21 17.5 19.433 17.5 17.5C17.5 15.567 15.933 14 14 14C12.067 14 10.5 15.567 10.5 17.5C10.5 19.433 12.067 21 14 21Z" stroke="#596780" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </main>
            </div>
        </>
    )
}
