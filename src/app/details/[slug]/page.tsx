"use client"
import { use, useEffect, useState } from "react"
import Link from "next/link"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import Image from "next/image"
import CategoryTag from "../../Components/CategoryTag"
import Header from "../../Components/Header"
import Pattern from "@/Public/Pattern.png"
import v2 from "@/Public/v2.png"
import v3 from "@/Public/v3.png"
import ProductCard from "@/app/Components/ProductCard"
import { useCart } from "@/app/Components/cartContext"
import { useUser } from "@clerk/nextjs"
import ProductDetails from "@/app/Components/ProductDetails"

interface Car {
    id: string
    slug: string
    title: string
    name?: string
    category: string
    image: string
    fuel: string
    type: string
    capacity: string
    price: number
    discount: number
    rating?: number | string
    reviews?: Review[]
}

interface Review {
    _id?: string // Add _id for Sanity reviews
    username: string
    subname: string
    comment: string
    rating: number
    date: string
    imageUrl: string
}

export default function DetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)

    const [data, setData] = useState<Car[] | undefined>([])
    const [data1, setData1] = useState<Car[] | undefined>([])
    const [loading, setLoading] = useState(true)
    const [fetch, setFetch] = useState<Car | undefined>()
    const { cartSlugs, addToCart, removeFromCart } = useCart()
    const { user, isSignedIn } = useUser()
    const [comment, setComment] = useState("")
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [reviews, setReviews] = useState<Review[]>([])
    const [showAllReviews, setShowAllReviews] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
    
                const detailQuery = `*[_type in ["popular", "recommended"] && slug.current == $slug]{
                    _id,
                    title,
                    price,
                    type,
                    image,
                    category,
                    fuel,
                    capacity,
                    "slug": slug.current,
                    discount,
                    rating,
                }`
    
                const popularQuery = `*[_type == "popular"]{
                    _id,
                    "slug": slug.current,
                    title,
                    category,
                    image,
                    fuel,
                    type,
                    capacity,
                    price,
                    discount,
                }`
    
                const recommendedQuery = `*[_type == "recommended"]{
                    _id,
                    "slug": slug.current,
                    title,
                    category,
                    image,
                    fuel,
                    type,
                    capacity,
                    price,
                    discount
                }`
    
                // Fetch data
                const [popularResponse, recommendedResponse, detailResponse] = await Promise.all([
                    client.fetch(popularQuery),
                    client.fetch(recommendedQuery),
                    client.fetch(detailQuery, { slug }),
                ])
    
                setData(popularResponse)
                setData1(recommendedResponse)
                setFetch(detailResponse?.length > 0 ? detailResponse[0] : undefined)
    
                // Fetch reviews separately
                const reviewQuery = `*[_type == "review" && productSlug == $slug]{
                    _id,
                    username,
                    subname,
                    comment,
                    rating,
                    date,
                    imageUrl
                }`
                const sanityReviews = await client.fetch(reviewQuery, { slug })
                setReviews(sanityReviews)
    
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false)
            }
        }
    
        fetchData()
    }, [slug]) // Remove fetchReviews from dependency array
    

    // const handleSubmit = () => {
    //     if (!isSignedIn) {
    //         alert("You must be logged in to leave a review.");
    //         return;
    //     }

    //     if (!comment || rating === 0) {
    //         alert("Please provide a comment and a rating.");
    //         return;
    //     }

    //     const newReview: Review = {
    //         username: user?.fullName || "Anonymous",
    //         subname: user?.primaryEmailAddress?.emailAddress || "User",
    //         comment,
    //         rating,
    //         date: new Date().toLocaleDateString(), // Format date as "MM/DD/YYYY"
    //         imageUrl: user?.imageUrl || "", // Updated to use 'imageUrl'
    //     };

    //     setReviews((prevReviews) => [...prevReviews, newReview]);
    //     setComment("");
    //     setRating(0);
    // };


    const handleSubmit = async () => {
        if (!isSignedIn) {
            alert("You must be logged in to leave a review.");
            return;
        }
    
        if (!comment || rating === 0) {
            alert("Please provide a comment and a rating.");
            return;
        }
    
        // const newReview: Review = {
        //     username: user?.fullName || "Anonymous",
        //     subname: user?.primaryEmailAddress?.emailAddress || "User",
        //     comment,
        //     rating,
        //     date: new Date().toISOString(), // Use ISO format for consistency
        //     imageUrl: user?.imageUrl || "",
        // };
    

        const newReview: Review = {
            username: user?.fullName || "Anonymous",
            subname: user?.primaryEmailAddress?.emailAddress || "User",
            comment,
            rating,
            date: new Date().toISOString().split("T")[0], // Extracts YYYY-MM-DD only
            imageUrl: user?.imageUrl || "",
        };

        try {
            // Send new review to Sanity
            await client.create({
                _type: "review",
                productSlug: slug, // Store product slug to associate review
                ...newReview, // Spread review data
            });
    
            // Update UI immediately after submission
            setReviews((prevReviews) => [...prevReviews, newReview]);
            setComment("");
            setRating(0);
    
            alert("Review submitted successfully!");
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Failed to submit review. Please try again.");
        }
    };

    const calculateAverageRating = (): string => {
        if (reviews.length === 0) return "0"; // Return "0" as a string

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (totalRating / reviews.length).toFixed(1); // Always return a string
    };

    const averageRating = parseFloat(calculateAverageRating());


    const toggleShowAllReviews = () => {
        setShowAllReviews((prevState) => !prevState)
    }

    const handleAddToCart = (slug: string): void => {
        if (cartSlugs.has(slug)) {
            removeFromCart(slug)
        } else {
            addToCart(slug)
        }
    }

    if (loading) {
        return <div className="text-center text-2xl font-semibold py-44 uppercase">Loading...</div>
        // return <Spinner size="lg" />
    }

    if (!fetch) {
        return <div className="flex justify-center items-center text-xl font-semibold">Connect your internet first</div>
    }

    return (
        <div>
            <Header />
            <main className="w-screen h-auto bg-[#F6F7F9]">
                <div className="xl:flex">
                    <div className="hidden xl:block xl:w-1/4 xl:h-auto bg-white p-10">
                        <CategoryTag />
                    </div>

                    <div className="mx-5 md:mx-8 lg:mx-10  md:py-5">
                        {/* Product Details */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 py-5  gap-7">
                            <div className="grid grid-cols-3 grid-rows-3 gap-5 w-auto h-auto bg-white rounded-lg shadow-md pb-0 p-3 md:p-5 lg:p-7">
                                <div className="col-span-3 row-span-2  rounded-lg text-black h-auto w-full">
                                    <div className="w-full h-full flex flex-col justify-between rounded-lg p-5" style={{ backgroundImage: `url(${Pattern.src})`, backgroundSize: "cover" }} >

                                        <div className="w-full lg:w-[60%] space-y-1 md:space-y-2 text-white">
                                            <h1 className="text-[16px] md:text-[22px] lg:[28px] font-semibold md:leading-relaxed leading-snug">
                                                Sports car with the best design<br className="lg:hidden" />and acceleration
                                            </h1>
                                            <p className="font-medium text-[10px] md:text-[12px] lg:text-[14px]">
                                                Safety and comfort while driving a<br />
                                                futuristic and elegant sports car
                                            </p>
                                        </div>
                                        <Image
                                            className="flex justify-center items-center w-auto p-5 pb-0"
                                            src={fetch?.image ? urlFor(fetch?.image).url() : "/default-image.jpg"}
                                            alt={fetch?.title || "Product Image"}
                                            width={300}
                                            height={100}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-3 row-span-1 flex justify-between gap-4 py-3">
                                    <div className="w-1/3 lg:w-[160px]  rounded-lg shadow-md p-1 border-2 border-[#3563E9]">
                                        <div className="w-full h-full flex justify-center items-center rounded-md p-1 md:p-2" style={{ backgroundImage: `url(${Pattern.src})`, backgroundSize: "cover" }} >
                                            <Image src={fetch?.image ? urlFor(fetch?.image).url() : "/default-image.jpg"}
                                                alt={fetch?.title || "Product Image"} className="w-full h-8 md:h-14 lg:h-16" width={300} height={50} />
                                        </div>
                                    </div>
                                    <div className="w-1/3 lg:w-[160px]  shadow-md rounded-lg">
                                        <Image src={v2} className="w-full h-full" alt="View2" />
                                    </div>
                                    <div className="w-1/3 lg:w-[160px]  shadow-md rounded-lg">
                                        <Image src={v3} className="w-full h-full" alt="View3" />
                                    </div>
                                </div>
                            </div>
                            <ProductDetails id={fetch.id} slug={fetch.slug} title={fetch.title} type={fetch.type} category={fetch.category} capacity={fetch.capacity} price={fetch.price} discount={fetch.discount} onAddToCart={() => handleAddToCart(fetch.slug)} isInCart={cartSlugs.has(fetch.slug)} fuel={fetch.fuel} link={fetch.slug} rating={averageRating} />
                        </div>


                        {/* Reviews Area  */}
                        <div className="w-full h-auto rounded-lg shadow-md bg-white p-4 md:p-7 lg:p-10">

                            {isSignedIn ? (
                                <>
                                    {/* Comment */}
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Write your comment here..."
                                        className="w-full border border-gray-300 outline-none rounded-lg p-2 mb-4"
                                    />

                                    {/* Rating */}
                                    <div className="flex justify-center items-center mb-4 text-xl font-medium text-gray-400">
                                        <label className="mr-4">Rating:</label>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => setRating(star)}
                                                className={`cursor-pointer text-2xl ${hoverRating >= star || rating >= star
                                                    ? "text-3xl text-yellow-500"
                                                    : "text-gray-400"
                                                    }`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-center md:justify-end">
                                        <button
                                            onClick={handleSubmit}
                                            className="px-4 py-2 bg-[#3563E9] text-white font-semibold text-[12px] md:text-[16px] rounded-lg"
                                        >
                                            Submit Review
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <a href={`https://leading-imp-41.accounts.dev/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000`} className="flex justify-center text-red-500 text-2xl cursor-pointer">Please log in to leave a review.</a>
                            )}

                            <div className={reviews.length == 0 ? `hidden` : `flex items-center gap-3 pt-5`}>
                                <h1 className="font-semibold text-[#1A202C] text-[14px] md:text-[20px]">Reviews</h1>
                                <h2 className="py-1 px-2  md:px-4 bg-[#3563E9] text-[10px] md:text-[14px] font-bold rounded-md text-white">{reviews.length}</h2>
                            </div>
                            {/* Display Reviews */}
                            <div className="mt-2">
                                {reviews.length > 0 ? (
                                    (showAllReviews ? reviews : reviews.slice(0, 2)).map((review, index) => (
                                        <div key={index} className="border-b border-gray-300 pb-2 mb-2">
                                            <div className="flex justify-between items-center py-4">
                                                <div className="flex items-center gap-2 md:gap-5 ">
                                                    {/* Profile Image */}
                                                    <Image
                                                        src={review.imageUrl || "/placeholder-avatar.png"}
                                                        alt={`${review.username}'s profile`}
                                                        className="w-12 h-12 md:w-14 md:h-14 rounded-full"
                                                        width={100}
                                                        height={100}
                                                    />
                                                    <div className="space-y-[1px]">
                                                        <h2 className="text-[#1A202C] text-[14px] md:text-[20px] font-bold">
                                                            {review.username}
                                                        </h2>
                                                        <p className="text-[#90A3BF] text-[10px] md:text-[14px] font-medium ">
                                                            {review.subname}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right mt-2 md:mt-0 md:space-y-[1px]">
                                                    <h2 className="text-[#90A3BF] text-[10px] md:text-[14px] font-medium ml-6">
                                                        {review.date}
                                                    </h2>
                                                    <div>
                                                        <p className="text-yellow-500 text-lg md:text-3xl">
                                                            {"★".repeat(review.rating)}{" "}
                                                            {"☆".repeat(5 - review.rating)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-[12px] md:text-[14] text-[#596780]">
                                                {review.comment}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-400 text-xl">No reviews yet. Be the first to review!</p>
                                )}
                            </div>

                            {reviews.length > 2 && (
                                <div className="flex justify-center pt-10">
                                    <button
                                        onClick={toggleShowAllReviews}
                                        className="text-[#90A3BF] text-[12px] md:text-[16px] font-medium"
                                    >
                                        {showAllReviews ? "Show Less" : "Show All"}
                                    </button>
                                </div>
                            )}
                        </div>


                        {/* Recent Cars  */}
                        <div className="flex justify-between px-4 py-7 lg:pt-10">
                            <h1 className="text-[16px] text-[#90A3BF] font-semibold ">Recent Cars</h1>
                            <button className="text-[#3563E9] text-[16px] font-semibold">View All</button>
                        </div>
                        <div className="place-items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-10 lg:gap-20">
                            {data?.length ? (
                                data?.map((car: Car) => {
                                    return (
                                        <ProductCard
                                            key={car?.slug}
                                            id={car.id}
                                            slug={car?.slug}
                                            title={car.title}
                                            category={car.category}
                                            capacity={car.capacity}
                                            image={car.image}
                                            fuel={car.fuel}
                                            type={car.type}
                                            price={car.price}
                                            discount={car.discount}
                                            link={`../details/${car?.slug}`}
                                            onAddToCart={() => handleAddToCart(car.slug)}
                                            isInCart={cartSlugs.has(car.slug)} // Check if in cart
                                        />
                                    );
                                })) : (<p>No Cars Available</p>)}
                        </div>


                        {/* Recomended Cars  */}

                        <div className="flex justify-between px-4 py-7 lg:pt-10">
                            <h1 className="text-[16px] text-[#90A3BF] font-semibold">Recomended Cars</h1>
                            <Link href="../category/"><button className="text-[#3563E9] text-[16px] font-semibold">View All</button></Link>
                        </div>
                        <div className="place-items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-10 lg:gap-20">
                            {data1?.length ? (
                                data1?.map((car: Car) => {
                                    return (
                                        <ProductCard
                                            key={car?.slug}
                                            id={car.id}
                                            slug={car?.slug}
                                            title={car.title}
                                            category={car.category}
                                            capacity={car.capacity}
                                            image={car.image}
                                            fuel={car.fuel}
                                            type={car.type}
                                            price={car.price}
                                            discount={car.discount}
                                            link={`../details/${car?.slug}`}
                                            onAddToCart={() => handleAddToCart(car?.slug)}
                                            isInCart={cartSlugs.has(car?.slug)} // Check if in cart
                                        />
                                    );
                                })) : (<p>No Cars Available</p>)}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
