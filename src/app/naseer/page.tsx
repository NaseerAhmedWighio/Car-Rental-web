// "use client";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { client } from "@/sanity/lib/client";
// import ProductCard2 from "../Components/productCard2";
// import { useCart } from "../Components/cartContext"; // Import the context

// interface Car {
//     _id: string;
//     name: string;
//     type: string;
//     image: string;
//     fuelCapacity: string;
//     seatingCapacity: string;
//     pricePerDay: number;
//     transmission: string;
// }

// export default function Popular() {
//     const [data, setData] = useState<Car[]>([]);
//     const [loading, setLoading] = useState(true);
//     const { cartSlugs, addToCart, removeFromCart } = useCart(); // Use context

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await client.fetch(
//                     `*[_type =="car"][0...16]
//                         {
//                           name,
//                             type,
//                             pricePerDay,
//                             seatingCapacity,
//                             fuelCapacity,
//                             transmission,
//                             image,
//                             _type,
//                             _id
//                         } `
//                 );
//                 setData(response);
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     const handleAddToCart = (slug: string): void => {
//         if (cartSlugs.has(slug)) {
//             removeFromCart(slug); // Remove if already in the cart
//         } else {
//             addToCart(slug); // Add to the cart
//         }
//     };

//     return (
//         <main className="w-full h-auto bg-[#F6F7F9] pt-16">
//             <div className="mx-5 md:mx-8 lg:mx-20">
//                 <div className="flex justify-between items-center px-4">
//                     <h1 className="text-[16px] text-[#90A3BF] font-semibold">Popular Car</h1>
//                     <Link href="../category/">
//                         <button className="text-[#3563E9] text-[16px] font-semibold">View All</button>
//                     </Link>
//                 </div>
//                 <div className="grid grid-cols-6 gap-[65px] py-8 scrollbar-hidden">
//                     {loading ? (
//                         <p className="text-center font-semibold text-xl">Loading...</p>
//                     ) : data?.length > 0 ? (
//                         data.map((car) => (
//                             <ProductCard2
//                                 _id={car._id}
//                                 name={car.name}
//                                 type={car.type}
//                                 pricePerDay={car.pricePerDay}
//                                 seatingCapacity={car.seatingCapacity}
//                                 image={car.image}
//                                 fuelCapacity={car.fuelCapacity}
//                                 _type={car.type}
//                                 transmission={car.transmission}
//                             />
//                         ))
//                     ) : (
//                         <p className="text-center font-semibold text-xl">No cars available</p>
//                     )}
//                 </div>
//             </div>
//         </main>
//     );
// }
