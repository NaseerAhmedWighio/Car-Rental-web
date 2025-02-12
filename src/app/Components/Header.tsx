"use client";
import { useEffect, useState } from 'react';
import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTitle,
} from "@/components/ui/sheet";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { useCart } from './cartContext';

import Link from "next/link"
import filter from "../../../public/filter.svg"
import search from "../../../public/search.svg"
// import notification from "../../../public/notification.svg"
import car from "../../../public/car.png"
import setting from "../../../public/setting.svg"
import heart from "../../../public/heart.svg"
import { motion } from "framer-motion"; // Import Framer Motion

import Image from "next/image"
import CategoryTag from "./CategoryTag"
import { client } from '@/sanity/lib/client';

export default function Header() {
    const { cartSlugs } = useCart();

    // const [cars, setCars] = useState<Car[]>([]);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    // const [filteredCars, setFilteredCars] = useState<Car[]>([]);
    // const [activeCategories, setActiveCategories] = useState<string[]>([]);
    // const [activeCapacities, setActiveCapacities] = useState<string[]>([]);
    // const [price, setPrice] = useState<string>("99");
    // const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
    // const [isCapacityOpen, setIsCapacityOpen] = useState<boolean>(false);

    // const toggleCategory = (category: string) => {
    //     setActiveCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
    //     setIsCategoryOpen(!isCategoryOpen);
    // };

    // const toggleCapacity = (capacity: string) => {
    //     setActiveCapacities(prev => prev.includes(capacity) ? prev.filter(c => c !== capacity) : [...prev, capacity]);
    //     setIsCapacityOpen(!isCapacityOpen);
    // };

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
            setResults([]); // Clear results if query is empty
        }
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (results.length === 0) return;

        if (e.key === "ArrowDown") {
            setSelectedIndex((prev) => (prev + 1) % results.length); // Move to next result
        } else if (e.key === "ArrowUp") {
            setSelectedIndex((prev) => (prev - 1 + results.length) % results.length); // Move to previous result
        } else if (e.key === "Enter") {
            if (selectedIndex >= 0) {
                const selectedItem = results[selectedIndex] as { slug: string; title: string };
                window.location.href = `../details/${selectedItem.slug}`;
            }
        }
    };

    const handleResultClick = (slug: string) => {
        window.location.href = `../details/${slug}`;
    };

    const [menuOpen, setMenuOpen] = useState(false); // State to manage menu visibility

    const toggleMenu = () => {
        setMenuOpen(!menuOpen); // Toggle the menu
    }

    // useEffect(() => {
    //     let filtered = [...cars];
    
    //     if (activeCategories.length > 0) {
    //         filtered = filtered.filter((car) => activeCategories.includes(car.category));
    //     }
    
    //     if (activeCapacities.length > 0) {
    //         filtered = filtered.filter((car) => activeCapacities.includes(car.capacity.toString()));
    //     }
    
    //     filtered = filtered.filter((car) => car.price <= parseInt(price));
    
    //     if (JSON.stringify(filtered) !== JSON.stringify(filteredCars)) {
    //         setFilteredCars(filtered);
    //     }
    // }, [activeCategories, activeCapacities, price, cars, filteredCars]); 

    // const toggleCategory = (category: string) => {
    //     let newCategories = [category]; // ✅ Sirf ek category active rahegi
    //     setActiveCategories(newCategories);
    // };

    // const toggleCapacity = (capacity: string) => {
    //     let newCapacities = [capacity]; // ✅ Sirf ek capacity active rahegi
    //     setActiveCapacities(newCapacities);
    // };

    // const toggleCategory = (category: string) => {
    //     setActiveCategories([category]); // ✅ Directly setting activeCategories
    // };
    
    // const toggleCapacity = (capacity: string) => {
    //     setActiveCapacities([capacity]); // ✅ Directly setting activeCapacities
    // };
    

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
                                <SheetTitle>Menu</SheetTitle> {/* Add this line */}
                                <CategoryTag />
                            </SheetContent>
                        </Sheet>
                        <Link href='../'><h1 className="cursor-pointer hidden lg:block text-[#3563E9] font-bold text-[32px]">MORENT</h1></Link>

                        {/* Search Area  */}
                        <div className='hidden lg:flex flex-col items-center space-y-[35px] relative lg:w-[450px] xl:w-[600px]'>
                            <div className="lg:w-[450px] xl:w-[600px] lg:relative lg:flex lg:items-center">
                                <Image className="absolute lg:left-24 xl:left-44 cursor-pointer" src={search} alt="Search Icon" onClick={() => {
                                    if (selectedIndex >= 0) {
                                        const selectedItem = results[selectedIndex] as { slug: string; title: string };
                                        window.location.href = `../details/${selectedItem.slug}`;
                                    }
                                }} />

                                <input type="text" onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown} value={query} className="w-full lg:py-4 lg:px-14 lg:ml-20 xl:ml-40 px-10 rounded-full border border-[#C3D4E9] focus:border-[#C3D4E9] border-opacity-40 outline-none text-left text-gray-700" placeholder="Search Something here" />

                                <Image className="absolute right-4 cursor-pointer" src={filter} alt="Search Filter" />
                            </div>

                            <ul className={results.length == 0 ? "hidden" : 'lg:ml-20 lg:w-[87%] xl:w-[80%] h-auto my-2 xl:ml-40 absolute rounded-lg gap-y-3 bg-white z-50 border border-t-0 border-[#C3D4E9] focus:border-[#C3D4E9] border-opacity-40 outline-none text-left text-gray-700'}>
                                {results.map((item: {
                                    slug: string; title: string
                                }, index) => (
                                    <li onClick={() => handleResultClick(item.slug)} key={index} className={`px-12 py-2 w-full rounded-lg hover:bg-blue-100 text-left cursor-pointer ${selectedIndex === index ? "bg-blue-100" : ""
                                        }`}>
                                        {item.title}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Side area  */}
                        <aside className="flex lg:ml-auto text-[#C3D4E9] text-lg py-4 gap-5">
                            <Link href="../cart/">
                                <div className="hidden lg:flex lg:items-center lg:justify-center w-[44px] h-[44px] rounded-full border-[1px] border-[#C3D4E9] border-opacity-40">
                                    <div className='relative' >
                                        {cartSlugs.size > 0 && (
                                            <span className="absolute bottom-[85%] left-[100%] w-4 h-4 bg-[#FF4423] rounded-full"></span>
                                        )}
                                        <Image className='' src={heart} alt="Heart Icon" />
                                    </div>
                                </div>
                            </Link>

                            <Link href="../category">
                                <div className="hidden relative lg:flex lg:items-center lg:justify-center w-[44px] h-[44px] rounded-full border-[1px] border-[#C3D4E9] border-opacity-40 cursor-pointercursor-pointer">
                                    {/* <Image src={notification} alt="notification Icon" /> */}
                                    <Image src={car} alt="car Icon" className='scale-75' />
                                    {/* <div className='absolute -top-0 -right-[3px] w-4 h-4 rounded-full bg-[#FF4423]' /> */}
                                </div>
                            </Link>

                            <Link href="../admin">
                                <div className="hidden lg:flex lg:items-center lg:justify-center w-[44px] h-[44px] rounded-full border-[1px] border-[#C3D4E9] border-opacity-40 cursor-pointer">
                                    <Image src={setting} alt="Setting Icon" />
                                </div>
                            </Link>

                            <div className="flex items-center justify-center w-[44px] h-[44px] rounded-full">
                                <SignedOut>
                                    <SignInButton />
                                </SignedOut>
                                <SignedIn>
                                    <div className='flex justify-center items-center w-full h-full scale-125'>
                                        <div className='flex justify-center items-center scale-150'>
                                            <div className='flex justify-center items-center scale-105'>
                                                <UserButton />
                                            </div>
                                        </div>
                                    </div>
                                </SignedIn>
                            </div>
                        </aside>
                    </div>


                    {/* For small devices */}
                    
                    {showFilter && (
                        <motion.aside
                            initial={{ opacity: 0, y: -20 }} // Start hidden and above
                            animate={showFilter ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }} // Slide Down
                            transition={{ duration: 0.3, ease: "easeInOut" }} // Smooth effect
                            className="lg:hidden flex flex-col absolute right-[14px] md:right-[23px] top-[175px] md:top-[180px] bg-white w-auto z-50 p-[2px] md:p-[3px] border border-[#C3D4E9] border-opacity-40 rounded-lg shadow-lg items-end text-[#C3D4E9] text-lg py-4 gap-2 scale-90"
                        >
                            <Link href="../cart/">
                                <div className="flex items-center justify-center w-[44px] h-[44px] rounded-full ">
                                    <div className="relative">
                                        {cartSlugs.size > 0 && (
                                            <span className="absolute bottom-[85%] left-[100%] w-4 h-4 bg-[#FF4423] rounded-full"></span>
                                        )}
                                        <Image src={heart} alt="Heart Icon" className='scale-125' />
                                    </div>
                                </div>
                            </Link>

                            <Link href="../category/">
                                <div className="relative flex items-center justify-center w-[44px] h-[44px] rounded-full cursor-pointer">
                                    <Image src={car} alt="Car Icon" className="scale-75" />
                                </div>
                            </Link>

                            <Link href="../admin">
                                <div className="flex items-center justify-center w-[44px] h-[44px] rounded-full cursor-pointer">
                                    <Image src={setting} alt="Setting Icon" className='scale-125' />
                                </div>
                            </Link>
                        </motion.aside>
                    )}

                    <div>
                        <Link href="../"><h1 className="lg:hidden cursor-pointer font-bold text-[#3563E9] text-[32px]">MORENT</h1></Link>
                    </div>

                    <div className='lg:hidden flex flex-col items-start space-y-[55px] relative w-full'>
                        <div className='w-full flex justify-between items-center gap-5'>
                            <div className="lg:hidden relative flex items-center w-full mt-3">
                                <Image className='absolute left-2' src={search} alt="Search Icon" onClick={() => {
                                    if (selectedIndex >= 0) {
                                        const selectedItem = results[selectedIndex] as { slug: string; title: string };
                                        window.location.href = `../details/${selectedItem.slug}`;
                                    }
                                }} />

                                <input type="search" onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown} value={query} className="w-full py-4 pl-12 sm:px-14 rounded-lg border border-[#C3D4E9] focus:border-[#C3D4E9] border-opacity-40 outline-none text-left text-gray-700" placeholder="Search Something here" />
                            </div>
                            <button className='p-[13px] mt-3 bg-transparent rounded-lg border border-[#C3D4E9] focus:border-[#C3D4E9] border-opacity-40'>
                                <Image onClick={() => setShowFilter(!showFilter)} className='scale-105' src={filter} alt="Search Filter" />
                            </button>
                        </div>
                        <ul className={results.length == 0 ? "hidden" : ' w-full h-auto my-2 absolute rounded-lg gap-y-3 bg-white z-50 border border-[#C3D4E9] focus:border-[#C3D4E9] border-opacity-40 outline-none text-left text-gray-700'}>
                            {results.map((item: {
                                slug: string; title: string
                            }, index) => (
                                <li onClick={() => handleResultClick(item.slug)} key={index} className={`px-12 py-2 w-full rounded-lg hover:bg-blue-100 text-left cursor-pointer ${selectedIndex === index ? "bg-blue-100" : ""
                                    }`}>
                                    {item.title}
                                </li>
                            ))}
                        </ul>
                        {/* </div> */}
                    </div>
                </main>
            </div>
        </>
    )
}
