"use client";
import { useEffect, useState, useRef } from 'react';
import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { useCart } from './cartContext';

import Link from "next/link"
import filter from "../../../public/filter.svg"
import search from "../../../public/search.svg"
import car from "../../../public/car.png"
import setting from "../../../public/setting.svg"
import heart from "../../../public/heart.svg"
import { motion, AnimatePresence } from "framer-motion";

import Image from "next/image"
import CategoryTag from "./CategoryTag"
import Dashboard from "./Dashboard"
import { client } from '@/sanity/lib/client';

interface HeaderProps {
    variant?: 'default' | 'with-filter';
    isAdmin?: boolean;
}

export default function Header({ variant = 'default', isAdmin = false }: HeaderProps) {
    const { rentItems, isInRent } = useCart();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{ slug: string; title: string }[]>([]);
    const [showFilter, setShowFilter] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [menuOpen, setMenuOpen] = useState(false);
    const filterBtnEl = useRef<HTMLButtonElement>(null);
    const [filterDropdownTop, setFilterDropdownTop] = useState(52);

    useEffect(() => {
        const fetchResults = async () => {
            const searchQuery = `*[_type in ["popular", "recommended"] && title match "${query}*"] {
                                    title,
                                    "slug": slug.current,
                                  }`;

            try {
                const data = await client.fetch(searchQuery);
                setResults(data);
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        };

        if (query) {
            fetchResults();
        } else {
            setResults([]);
        }
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (results.length === 0) return;

        if (e.key === "ArrowDown") {
            setSelectedIndex((prev) => (prev + 1) % results.length);
        } else if (e.key === "ArrowUp") {
            setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
        } else if (e.key === "Enter") {
            if (selectedIndex >= 0) {
                const selectedItem = results[selectedIndex];
                window.location.href = `/details/${selectedItem.slug}`;
            }
        }
    };

    const handleResultClick = (slug: string) => {
        window.location.href = `/details/${slug}`;
    };

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const showFilterMenu = variant === 'with-filter';
    const showHamburger = isAdmin || showFilterMenu;

    // Desktop side icons
    const DesktopIcons = () => (
        <aside className="flex lg:ml-auto text-[#C3D4E9] text-lg py-2 lg:py-4 gap-3 lg:gap-5">
            <Link href="/rent/" aria-label="View rentals">
                <div className="flex lg:items-center lg:justify-center w-[40px] h-[40px] xl:w-[44px] xl:h-[44px] rounded-full border-[1px] border-[#C3D4E9] border-opacity-40">
                    <div className='relative'>
                        {rentItems.length > 0 && (
                            <span className="absolute -top-3 -right-3 w-3 h-3 md:w-4 md:h-4 bg-[#FF4423] rounded-full"></span>
                        )}
                        <Image className='w-5 h-5 md:w-6 md:h-6' src={heart} alt="Heart Icon" />
                    </div>
                </div>
            </Link>

            <Link href="/category" aria-label="Browse categories">
                <div className="relative flex lg:items-center lg:justify-center w-[40px] h-[40px] xl:w-[44px] xl:h-[44px] rounded-full border-[1px] border-[#C3D4E9] border-opacity-40 cursor-pointer">
                    <Image src={car} alt="car Icon" className='w-5 h-5 md:w-6 md:h-6' />
                </div>
            </Link>

            <Link href="/admin" aria-label="Admin dashboard">
                <div className="flex lg:items-center lg:justify-center w-[40px] h-[40px] xl:w-[44px] xl:h-[44px] rounded-full border-[1px] border-[#C3D4E9] border-opacity-40 cursor-pointer">
                    <Image src={setting} alt="Setting Icon" className='w-5 h-5 md:w-6 md:h-6' />
                </div>
            </Link>

            <div className="flex items-center justify-center w-[40px] h-[40px] lg:w-[44px] lg:h-[44px] rounded-full">
                <SignedOut>
                    <Link href="/signIn/">
                        <h1 className="whitespace-nowrap text-sm sm:text-base">Sign In</h1>
                    </Link>
                </SignedOut>
                <SignedIn>
                    <div className='flex justify-center items-center w-full h-full scale-110 lg:scale-150'>
                        <UserButton />
                    </div>
                </SignedIn>
            </div>
        </aside>
    );

    return (
        <>
            <div className="min-h-[80px] lg:min-h-[90px] w-full sticky top-0 z-50 border-b-[1px] border-black border-opacity-20 bg-white py-3 lg:py-0">
                <main className="mx-5 md:mx-8 lg:mx-20 py-2 lg:py-0">
                    {/* Desktop Layout */}
                    <div className="hidden lg:flex justify-between items-center h-[86px]">
                        <Link href='/'><h1 className="cursor-pointer text-[#3563E9] font-bold text-[28px] xl:text-[32px]">MORENT</h1></Link>

                        {/* Search Area */}
                        <div className='relative flex-shrink-0 w-[200px] lg:w-[280px] xl:w-[350px] lg:ml-12'>
                            <div className="relative flex items-center">
                                <Image className="absolute left-3 xl:left-5 cursor-pointer w-5 h-5" src={search} alt="Search Icon" onClick={() => {
                                    if (selectedIndex >= 0) {
                                        const selectedItem = results[selectedIndex];
                                        window.location.href = `/details/${selectedItem.slug}`;
                                    }
                                }} />
                                <input type="text" onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown} value={query} className="w-full py-2.5 pl-4 xl:pl-14 pr-10 rounded-full border border-[#C3D4E9] focus:border-[#C3D4E9] border-opacity-40 outline-none text-left text-gray-700" placeholder="Search Something here" />
                                <Image className="absolute right-4 cursor-pointer w-5 h-5" src={filter} alt="Search Filter" />
                            </div>
                            <ul className={results.length == 0 ? "hidden" : 'absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-lg bg-white z-50 border border-[#C3D4E9] border-opacity-40 outline-none text-left text-gray-700 shadow-lg'}>
                                {results.map((item, index) => (
                                    <li onClick={() => handleResultClick(item.slug)} key={index} className={`px-4 py-2.5 hover:bg-blue-100 text-left cursor-pointer text-sm ${selectedIndex === index ? "bg-blue-100" : ""}`}>
                                        {item.title}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <DesktopIcons />
                    </div>

                    {/* Mobile/Tablet Layout */}
                    <div className='lg:hidden flex flex-col items-start space-y-3 relative w-full pb-3'>
                        {/* Top Row: Hamburger + Logo + Profile/Sign-in */}
                        <div className='w-full flex items-center gap-3'>
                            {/* Hamburger - Left side */}
                            {showHamburger && (
                                <div>
                                    <button onClick={toggleMenu} className="text-2xl text-black mt-1.5" aria-label="Open menu">
                                        <Menu />
                                    </button>
                                    <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                                        <SheetContent side="left" className={`bg-white w-[280px] p-0 overflow-y-auto ${isAdmin ? 'max-h-screen' : ''}`}>
                                            <span id="sheet-title" className="sr-only">{isAdmin ? 'Admin Menu' : 'Category Menu'}</span>
                                            <div aria-labelledby="sheet-title">
                                                {isAdmin ? <Dashboard /> : <CategoryTag />}
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                </div>
                            )}

                            {/* Logo */}
                            <Link href="/"><h1 className="cursor-pointer font-bold text-[#3563E9] text-[22px]">MORENT</h1></Link>

                            {/* Right side: Profile/Sign-in */}
                            <div className="ml-auto flex-shrink-0">
                                <SignedOut>
                                    <Link href="/signIn/" className="text-[#1A202C] text-xs font-semibold whitespace-nowrap">Sign In</Link>
                                </SignedOut>
                                <SignedIn>
                                    <div className='flex justify-center items-center w-full h-full'>
                                        <UserButton />
                                    </div>
                                </SignedIn>
                            </div>
                        </div>

                        {/* Search & Filter Row */}
                        <div className="relative flex items-center w-full gap-3">
                            <div className="relative flex items-center flex-1">
                                <Image className='absolute left-3 w-5 h-5' src={search} alt="Search Icon" onClick={() => {
                                    if (selectedIndex >= 0) {
                                        const selectedItem = results[selectedIndex];
                                        window.location.href = `/details/${selectedItem.slug}`;
                                    }
                                }} />
                                <input type="search" onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown} value={query} className="w-full py-2 lg:py-3 pl-10 pr-4 rounded-lg border border-[#C3D4E9] focus:border-[#C3D4E9] border-opacity-40 outline-none text-left text-gray-700 text-sm sm:text-base" placeholder="Search something here" />
                            </div>

                            {/* Filter Button */}
                            <button
                                ref={filterBtnEl}
                                className='p-2 bg-transparent rounded-lg border border-[#C3D4E9] border-opacity-40 flex-shrink-0'
                                aria-label="Toggle filter menu"
                                onClick={() => {
                                    if (!showFilter && filterBtnEl.current) {
                                        setFilterDropdownTop(filterBtnEl.current.getBoundingClientRect().bottom + 8);
                                    }
                                    setShowFilter(!showFilter);
                                }}
                            >
                                <Image className='w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7' src={filter} alt="Search Filter" />
                            </button>
                        </div>

                        {/* Search Results - Mobile */}
                        <ul className={results.length == 0 ? "hidden" : 'w-full max-h-60 overflow-y-auto rounded-lg gap-y-2 bg-white z-50 border border-[#C3D4E9] focus:border-[#C3D4E9] border-opacity-40 outline-none text-left text-gray-700'}>
                            {results.map((item, index) => (
                                <li onClick={() => handleResultClick(item.slug)} key={index} className={`px-4 py-2 w-full rounded-lg hover:bg-blue-100 text-left cursor-pointer text-sm sm:text-base ${selectedIndex === index ? "bg-blue-100" : ""}`}>
                                    {item.title}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Filter Dropdown - Mobile/Tablet (Horizontal dropdown under filter button) */}
                    <AnimatePresence>
                        {showFilter && (
                            <>
                                {/* Backdrop */}
                                <div
                                    className="fixed inset-0 bg-black bg-opacity-20 z-40 lg:hidden"
                                    onClick={() => setShowFilter(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2 }}
                                    className="lg:hidden fixed z-50"
                                    style={{ top: `${filterDropdownTop}px`, right: '20px' }}
                                >
                                    <div className="flex items-center gap-3 px-4 py-3 bg-white shadow-xl border border-[#C3D4E9] border-opacity-40 rounded-xl">
                                        <Link href="/rent/" className="flex flex-col items-center gap-1 w-12" onClick={() => setShowFilter(false)}>
                                            <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#F6F7F9] hover:bg-gray-100 transition-colors">
                                                <div className="relative">
{rentItems.length > 0 && (
                                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF4423] rounded-full"></span>
                                                    )}
                                                    <Image src={heart} alt="Heart" className='w-5 h-5' />
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-[#90A3BF] font-medium">Cart</span>
                                        </Link>
                                        <Link href="/category/" className="flex flex-col items-center gap-1 w-12" onClick={() => setShowFilter(false)}>
                                            <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#F6F7F9] hover:bg-gray-100 transition-colors">
                                                <Image src={car} alt="Car" className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] text-[#90A3BF] font-medium">Category</span>
                                        </Link>
                                        <Link href="/admin" className="flex flex-col items-center gap-1 w-12" onClick={() => setShowFilter(false)}>
                                            <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#F6F7F9] hover:bg-gray-100 transition-colors">
                                                <Image src={setting} alt="Setting" className='w-5 h-5' />
                                            </div>
                                            <span className="text-[10px] text-[#90A3BF] font-medium">Admin</span>
                                        </Link>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </>
    )
}
