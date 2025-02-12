// // src/CommentForm.tsx
// "use client"
// import React, { useState } from 'react';

// const CommentForm: React.FC = () => {
//   const [name, setName] = useState<string>('');
//   const [email, setEmail] = useState<string>('');
//   const [comment, setComment] = useState<string>('');
//   const [rating, setRating] = useState<number>(1);

//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     if (comment.trim()) {
//       console.log('Comment submitted:', { name, email, comment, rating });
//       setName('');
//       setEmail('');
//       setComment('');
//       setRating(1);
//     } else {
//       alert('Please enter a comment.');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 border rounded-lg shadow-md bg-white">
//       <h2 className="text-xl font-semibold mb-4">Submit a Comment</h2>
//       <div className="mb-4">
//         <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
//         <input
//           type="text"
//           id="name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
//           required
//         />
//       </div>
//       <div className="mb-4">
//         <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
//         <input
//           type="email"
//           id="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
//           required
//         />
//       </div>
//       <div className="mb-4">
//         <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating:</label>
//         <select
//           id="rating"
//           value={rating}
//           onChange={(e) => setRating(Number(e.target.value))}
//           className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
//         >
//           <option value={1}>1 Star</option>
//           <option value={2}>2 Stars</option>
//           <option value={3}>3 Stars</option>
//           <option value={4}>4 Stars</option>
//           <option value={5}>5 Stars</option>
//         </select>
//       </div>
//       <div className="mb-4">
//         <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment:</label>
//         <textarea
//           id="comment"
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           rows={4}
//           className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
//           required
//         />
//       </div>
//       <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Submit</button>
//     </form>
//   );
// };

// export default CommentForm;






















// "use client"
// import { use, useEffect, useState } from "react"
// import Link from "next/link"
// import { client } from "@/sanity/lib/client";
// import { urlFor } from "@/sanity/lib/image";
// import Image from "next/image"

// import CategoryTag from "../Components/CategoryTag"
// import Header from "../Components/Header"

// import Pattern from "@/Public/Pattern.png"
// import v2 from "@/Public/v2.png"
// import v3 from "@/Public/v3.png"
// import ProductCard from "@/app/Components/ProductCard";
// import { useCart } from "@/app/Components/cartContext";
// import { useUser } from "@clerk/nextjs";
// import ProductDetails from "@/app/Components/ProductDetails";

// interface Car {
//     id: string;
//     slug: string;
//     title: string;
//     name: string;
//     category: string;
//     image: string;
//     fuel: string;
//     type: string;
//     capacity: string;
//     price: number;
//     discount: number;
//     rating?: number;
// }

// interface Review {
//     username: string;
//     subname: string;
//     comment: string;
//     rating: number;
//     date: string;
//     imageUrl: string; // Updated property name
// }


// export default function DetailsPage({ params }: { params: Promise<{ slug: string }> }) {
//     const { slug } = use(params);

//     const [data, setData] = useState<Car[] | undefined>([]);
//     const [data1, setData1] = useState<Car[] | undefined>([]);
//     const [loading, setLoading] = useState(true);
//     const [fetch, setFetch] = useState<Car | undefined>();
//     const { cartSlugs, addToCart, removeFromCart } = useCart(); // Use context
//     const { user, isSignedIn } = useUser(); // Clerk user object
//     const [comment, setComment] = useState("");
//     const [rating, setRating] = useState(0);
//     const [hoverRating, setHoverRating] = useState(0);
//     const [reviews, setReviews] = useState<Review[]>([]);
//     const [showAllReviews, setShowAllReviews] = useState(false);

//     useEffect(() => {
//         const fetchData = async () => {
//           try {
//             setLoading(true);
    
//             // Fetch product details
//             const productQuery = `*[_type in ["popular", "recommended"] && slug.current == $slug][0]{
//               _id,
//               title,
//               slug,
//               rating,
//             }`;
//             const productResponse = await client.fetch(productQuery, { slug });
//             setFetch(productResponse);
    
//             // Fetch reviews for the product
//             const reviewsQuery = `*[_type == "review" && productSlug == $slug]{
//               username,
//               subname,
//               comment,
//               rating,
//               date,
//               imageUrl,
//             }`;
//             const reviewsResponse = await client.fetch(reviewsQuery, { slug });
//             setReviews(reviewsResponse);
//           } catch (error) {
//             console.error("Error fetching data:", error);
//           } finally {
//             setLoading(false);
//           }
//         };
    
//         fetchData();
//       }, [slug]);
    
//       // Handle review submission
//       const handleSubmit = async () => {
//         if (!isSignedIn) {
//           alert("You must be logged in to leave a review.");
//           return;
//         }
    
//         if (!comment || rating === 0) {
//           alert("Please provide a comment and a rating.");
//           return;
//         }
    
//         const newReview = {
//           _type: "review",
//           productSlug: slug,
//           username: user?.fullName || "Anonymous",
//           subname: user?.primaryEmailAddress?.emailAddress || "User",
//           comment,
//           rating,
//           date: new Date().toISOString(),
//           imageUrl: user?.imageUrl || "",
//         };
    
//         try {
//           // Save the review to Sanity
//           await client.create(newReview);
    
//           // Update local state with the new review
//           setReviews((prevReviews) => [...prevReviews, newReview]);
//           setComment("");
//           setRating(0);
//         } catch (error) {
//           console.error("Error submitting review:", error);
//         }
//       };
    
//       // Calculate average rating
//       const calculateAverageRating = (): string => {
//         if (reviews.length === 0) return "0"; // Return "0" as a string
    
//         const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
//         return (totalRating / reviews.length).toFixed(1); // Always return a string
//       };
    
//       const averageRating = parseFloat(calculateAverageRating());
    
//       // Toggle show all reviews
//       const toggleShowAllReviews = () => {
//         setShowAllReviews((prevState) => !prevState);
//       };

    
//     // setRating(rating)

//     const handleAddToCart = (slug: string): void => {
//         if (cartSlugs.has(slug)) {
//             removeFromCart(slug); // Remove if already in the cart
//         } else {
//             addToCart(slug); // Add to the cart
//         }
//     };

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);

//                 // Query for specific item details
//             const detailQuery = `*[_type in ["popular", "recommended"] && slug.current == $slug]{
//           _id,
//           title,
//           price,
//           type,
//           image,
//           category,
//           fuel,
//           capacity,
//           "slug": slug.current,
//           discount,
//           rating,
//         }`;

//                 // Query for popular items
//             const popularQuery = `*[_type == "popular"]{
//           _id,
//           "slug": slug.current,
//           title,
//           category,
//           image,
//           fuel,
//           type,
//           capacity,
//           price,
//           discount,
//         }`;

//                 // Query for recommended items
//                 const recommendedQuery = `*[_type == "recommended"]{
//           _id,
//           "slug": slug.current,
//           title,
//           category,
//           image,
//           fuel,
//           type,
//           capacity,
//           price,
//           discount
//         }`;

//                 // Fetch data from Sanity
//                 const [popularResponse, recommendedResponse, detailResponse] = await Promise.all([
//                     client.fetch(popularQuery),
//                     client.fetch(recommendedQuery),
//                     client.fetch(detailQuery, { slug }),
//                 ]);

//                 // Set state
//                 setData(popularResponse);
//                 setData1(recommendedResponse);
//                 setFetch(detailResponse?.length > 0 ? detailResponse[0] : undefined);
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [slug]);

//     if (loading) {
//         return <div>Loading...</div>; // Add a loading spinner or message here
//     }

//     if (!fetch) {
//         return <div className="flex justify-center items-center text-xl font-semibold">Connect your internet first</div>;
//     }
//     return (
//       <>
//        <ProductDetails id={fetch.id} slug={fetch.slug} title={fetch.title} type={fetch.type} category={fetch.category} capacity={fetch.capacity} price={fetch.price} discount={fetch.discount} onAddToCart={() => handleAddToCart(fetch.slug)} isInCart={cartSlugs.has(fetch.slug)} fuel={fetch.fuel} link={fetch.slug} />
//        <div className="w-full h-auto rounded-lg shadow-md bg-white p-4 md:p-7 lg:p-10">

// {isSignedIn ? (
//     <>
//         {/* Comment */}
//         <textarea
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             placeholder="Write your comment here..."
//             className="w-full border border-gray-300 outline-none rounded-lg p-2 mb-4"
//         />

//         {/* Rating */}
//         <div className="flex justify-center items-center mb-4 text-xl font-medium text-gray-400">
//             <label className="mr-4">Rating:</label>
//             {[1, 2, 3, 4, 5].map((star) => (
//                 <span
//                     key={star}
//                     onMouseEnter={() => setHoverRating(star)}
//                     onMouseLeave={() => setHoverRating(0)}
//                     onClick={() => setRating(star)}
//                     className={`cursor-pointer text-2xl ${hoverRating >= star || rating >= star
//                         ? "text-3xl text-yellow-500"
//                         : "text-gray-400"
//                         }`}
//                 >
//                     ★
//                 </span>
//             ))}
//         </div>

//         {/* Submit Button */}
//         <div className="flex justify-end">
//             <button
//                 onClick={handleSubmit}
//                 className="px-4 py-2 bg-[#3563E9] text-white font-semibold text-[12px] md:text-[16px] rounded-lg"
//             >
//                 Submit Review
//             </button>
//         </div>
//     </>
// ) : (
//     <p className="text-red-500">Please log in to leave a review.</p>
// )}

// <div className={reviews.length == 0 ? `hidden` : `flex items-center gap-3 pt-5`}>
//     <h1 className="font-semibold text-[#1A202C] text-[14px] md:text-[20px]">Reviews</h1>
//     <h2 className="py-1 px-2  md:px-4 bg-[#3563E9] text-[10px] md:text-[14px] font-bold rounded-md text-white">{reviews.length}</h2>
// </div>
// {/* Display Reviews */}
// <div className="mt-2">
//     {reviews.length > 0 ? (
//         (showAllReviews ? reviews : reviews.slice(0, 2)).map((review, index) => (
//             <div key={index} className="border-b border-gray-300 pb-2 mb-2">
//                 <div className="flex justify-between items-center py-4">
//                     <div className="flex items-center gap-2 md:gap-5 ">
//                         {/* Profile Image */}
//                         <Image
//                             src={review.imageUrl || "/placeholder-avatar.png"}
//                             alt={`${review.username}'s profile`}
//                             className="w-12 h-12 md:w-14 md:h-14 rounded-full"
//                             width={100}
//                             height={100}
//                         />
//                         <div className="space-y-[1px]">
//                             <h2 className="text-[#1A202C] text-[14px] md:text-[20px] font-bold whitespace-nowrap">
//                                 {review.username}
//                             </h2>
//                             <p className="text-[#90A3BF] text-[10px] md:text-[14px] font-medium whitespace-nowrap">
//                                 {review.subname}
//                             </p>
//                         </div>
//                     </div>
//                     <div className="text-right mt-2 md:mt-0 md:space-y-[1px]">
//                         <h2 className="text-[#90A3BF] text-[10px] md:text-[14px] font-medium ml-6 whitespace-nowrap">
//                             {review.date}
//                         </h2>
//                         <div>
//                             <p className="text-yellow-500 text-lg md:text-3xl">
//                                 {"★".repeat(review.rating)}{" "}
//                                 {"☆".repeat(5 - review.rating)}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//                 <p className="text-[12px] md:text-[14] text-[#596780]">
//                     {review.comment}
//                 </p>
//             </div>
//         ))
//     ) : (
//         <p className="text-center text-gray-400 text-xl">No reviews yet. Be the first to review!</p>
//     )}
// </div>

// {reviews.length > 2 && (
//     <div className="flex justify-center pt-10">
//         <button
//             onClick={toggleShowAllReviews}
//             className="text-[#90A3BF] text-[12px] md:text-[16px] font-medium"
//         >
//             {showAllReviews ? "Show Less" : "Show All"}
//         </button>
//     </div>
// )}
// </div>    
//       </>
//     )
//   }









// "use client"
// import { useState, useEffect, use } from 'react';
// import { useUser } from '@clerk/nextjs';
// import Image from 'next/image';
// import { client } from '../../../sanity/lib/client'; // Adjust the import based on your setup
// import { useCart } from '../../Components/cartContext'; // Adjust the import based on your setup
// import ProductDetails from '../../Components/ProductDetails'; // Adjust the import based on your setup

// interface Review {
//   username: string;
//   subname: string;
//   comment: string;
//   rating: number;
//   date: string;
//   imageUrl: string;
// }

// interface Car {
//   _id: string;
//   slug: string;
//   title: string;
//   type: string;
//   category: string;
//   capacity: string;
//   price?: string;
//   discount?: string;
//   fuel: string;
//   image: string;
//   review: Review[] | number;
// }

// export default function DetailsPage({ params }: { params: Promise<{ slug: string }> }) {
//   const { slug } =use(params);
//   console.log("Slug:", slug);


//   const [data, setData] = useState<Car[]>([]);
//   const [data1, setData1] = useState<Car[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [fetch, setFetch] = useState<Car | undefined>();
//   const { cartSlugs, addToCart, removeFromCart } = useCart();
//   const { user, isSignedIn } = useUser();
//   const [comment, setComment] = useState("");
//   const [rating, setRating] = useState(0);
//   const [hoverRating, setHoverRating] = useState(0);
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [showAllReviews, setShowAllReviews] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // Fetch product details
//         const productQuery = `*[_type in ["popular", "recommended"] && slug.current == $slug][0]{
//             _id,
//           title,
//           price,
//           type,
//           image,
//           category,
//           fuel,
//           capacity,
//           "slug": slug.current,
//           discount,
//           "review": coalesce(round(average(review[].rating)), 0),
//           review[] {
//             username,
//             subname,
//             comment,
//             rating,
//             date,
//             imageUrl
//           },
//         }`;
//         const productResponse = await client.fetch(productQuery, { slug: String(slug) });
//         console.log("Product Response:", productResponse);
//         setFetch(productResponse);
//         setReviews(productResponse.review || []);
//         const averageRating = productResponse?.averageRating || 0;
//         console.log("Average Rating:", averageRating);

        

//         // Fetch reviews for the product
//         const reviewsQuery = `*[_type == "popular" && slug.current == $slug]{
//           review[]->{
//             username,
//             subname,
//             comment,
//             rating,
//             date,
//             imageUrl,
//           }
//         }`;
//         const reviewsResponse = await client.fetch(reviewsQuery, { slug: String(slug) });
//         console.log("Reviws Response:", reviewsResponse);
//         setReviews(reviewsResponse[0]?.review || []);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [slug]);


//   const handleSubmit = async () => {
//     if (!isSignedIn) {
//       alert("You must be logged in to leave a review.");
//       return;
//     }
  
//     if (!comment || rating === 0) {
//       alert("Please provide a comment and a rating.");
//       return;
//     }
  
//     if (!fetch || !fetch._id) {
//       console.error("Product data or ID is not available.");
//       return;
//     }
  
//     const newReview = {
//       username: user?.fullName || "Anonymous",
//       subname: user?.primaryEmailAddress?.emailAddress || "User",
//       comment,
//       rating,
//       date: new Date().toISOString(),
//       imageUrl: user?.imageUrl || "",
//     };
  
//     try {
//       await client.patch(fetch._id) // Change fetch.id to fetch._id
//         .setIfMissing({ review: [] })
//         .insert("after", "review[-1]", [newReview])
//         .commit();
  
//       setReviews((prevReviews) => [...prevReviews, newReview]);
//       setComment("");
//       setRating(0);
//     } catch (error) {
//       console.error("Error submitting review:", error);
//     }
//   };

//   const calculateAverageRating = (): number => {
//     if (!fetch?.review) return 0;
  
//     if (typeof fetch.review === "number") {
//       return fetch.review; // Agar already number hai, to waise ka waise return karo
//     }
  
//     if (Array.isArray(fetch.review) && fetch.review.length > 0) {
//       const totalRating = fetch.review.reduce((sum, r) => sum + (r.rating || 0), 0);
//       return totalRating / fetch.review.length;
//     }
  
//     return 0; // Default case
//   };



//   // const calculateAverageRating = (): number => {
//   //   if (!fetch?.review || fetch.review.length === 0) return 0;
//   //   const totalRating = fetch.review.reduce((sum: number, r: Review) => sum + r.rating, 0);
//   //   return totalRating / fetch.review.length;
//   // };



//   // const calculateAverageRating = (): string => {
//   //   if (reviews.length === 0) return "0";

//   //   const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
//   //   return (totalRating / reviews.length).toFixed(1);
//   // };

//   // const averageRating = parseFloat(calculateAverageRating());
  

//   const toggleShowAllReviews = () => {
//     setShowAllReviews((prevState) => !prevState);
//   };

//   const handleAddToCart = (slug: string): void => {
//     if (cartSlugs.has(slug)) {
//       removeFromCart(slug);
//     } else {
//       addToCart(slug);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!fetch) {
//     return <div className="flex justify-center items-center text-xl font-semibold">Connect your internet first</div>;
//   }

//   return (
//     <>
//       <ProductDetails
//         id={fetch._id}
//         slug={fetch.slug}
//         title={fetch.title}
//         type={fetch.type}
//         category={fetch.category}
//         capacity={fetch.capacity}
//         price={Number(fetch.price)}
//         discount={Number(fetch.discount)}
//         onAddToCart={() => handleAddToCart(fetch.slug)}
//         isInCart={cartSlugs.has(fetch.slug)}
//         fuel={fetch.fuel}
//         link={fetch.slug}
//         rating={calculateAverageRating()}
//       />
//       <div className="w-full h-auto rounded-lg shadow-md bg-white p-4 md:p-7 lg:p-10">
//         {isSignedIn ? (
//           <>
//             <textarea
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               placeholder="Write your comment here..."
//               className="w-full border border-gray-300 outline-none rounded-lg p-2 mb-4"
//             />
//             <div className="flex justify-center items-center mb-4 text-xl font-medium text-gray-400">
//               <label className="mr-4">Rating:</label>
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <span
//                   key={star}
//                   onMouseEnter={() => setHoverRating(star)}
//                   onMouseLeave={() => setHoverRating(0)}
//                   onClick={() => setRating(star)}
//                   className={`cursor-pointer text-2xl ${hoverRating >= star || rating >= star
//                     ? "text-3xl text-yellow-500"
//                     : "text-gray-400"
//                     }`}
//                 >
//                   ★
//                 </span>
//               ))}
//             </div>
//             <div className="flex justify-end">
//               <button
//                 onClick={handleSubmit}
//                 className="px-4 py-2 bg-[#3563E9] text-white font-semibold text-[12px] md:text-[16px] rounded-lg"
//               >
//                 Submit Review
//               </button>
//             </div>
//           </>
//         ) : (
//           <p className="text-red-500">Please log in to leave a review.</p>
//         )}

//         <div className={reviews.length === 0 ? `hidden` : `flex items-center gap-3 pt-5`}>
//           <h1 className="font-semibold text-[#1A202C] text-[14px] md:text-[20px]">Reviews</h1>
//           <h2 className="py-1 px-2  md:px-4 bg-[#3563E9] text-[10px] md:text-[14px] font-bold rounded-md text-white">{reviews.length}</h2>
//         </div>
//         <div className="mt-2">
//           {reviews.length > 0 ? (
//             (showAllReviews ? reviews : reviews.slice(0, 2)).map((review, index) => (
//               <div key={index} className="border-b border-gray-300 pb-2 mb-2">
//                 <div className="flex justify-between items-center py-4">
//                   <div className="flex items-center gap-2 md:gap-5 ">
//                     <Image
//                       src={review?.imageUrl ? review.imageUrl : "/placeholder-avatar.png"}
//                       alt={`${review?.username || "User"}'s profile`}
//                       className="w-12 h-12 md:w-14 md:h-14 rounded-full"
//                       width={100}
//                       height={100}
//                     />
//                     <div className="space-y-[1px]">
//                       <h2 className="text-[#1A202C] text-[14px] md:text-[20px] font-bold whitespace-nowrap">
//                         {review?.username}
//                       </h2>
//                       <p className="text-[#90A3BF] text-[10px] md:text-[14px] font-medium whitespace-nowrap">
//                         {review?.subname}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="text-right mt-2 md:mt-0 md:space-y-[1px]">
//                     <h2 className="text-[#90A3BF] text-[10px] md:text-[14px] font-medium ml-6 whitespace-nowrap">
//                       {review?.date}
//                     </h2>
//                     <div>
//                       <p className="text-yellow-500 text-lg md:text-3xl">
//                         {"★".repeat(review?.rating)}{" "}
//                         {"☆".repeat(5 - review?.rating)}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <p className="text-[12px] md:text-[14] text-[#596780]">
//                   {review?.comment}
//                 </p>
//               </div>
//             ))
//           ) : (
//             <p className="text-center text-gray-400 text-xl">No reviews yet. Be the first to review!</p>
//           )}
//         </div>

//         {reviews.length > 2 && (
//           <div className="flex justify-center pt-10">
//             <button
//               onClick={toggleShowAllReviews}
//               className="text-[#90A3BF] text-[12px] md:text-[16px] font-medium"
//             >
//               {showAllReviews ? "Show Less" : "Show All"}
//             </button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
