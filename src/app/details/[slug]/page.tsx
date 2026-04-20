"use client"
import { use, useEffect, useState } from "react"
import Link from "next/link"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import Image from "next/image"
import CategoryTag from "../../Components/CategoryTag"
import Pattern from "@/Public/Pattern.png"
import v2 from "@/Public/v2.png"
import v3 from "@/Public/v3.png"
import ProductCard from "@/app/Components/ProductCard"
import { useCart } from "@/app/Components/cartContext"
import { useUser } from "@clerk/nextjs"
import ProductDetails from "@/app/Components/ProductDetails"

  return {
    title: `${carData.title} | Rent Now - Morent`,
    description: `Rent ${carData.title} (${carData.category}) at $${carData.price}/day. Book now for the best car rental experience in Pakistan with Morent.`,
    keywords: [`rent ${carData.title}`, `${carData.category} rental`, "car rental Pakistan", "rent car online"],
    openGraph: {
      title: `${carData.title} | Rent Now - Morent`,
      description: `Rent ${carData.title} at $${carData.price}/day. Premium car rental in Pakistan.`,
      url: `https://morents.vercel.app/details/${slug}`,
    },
  };
}

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
    const [carData, setCarData] = useState<Car | undefined>()
    const { addToRent, removeFromRent, isInRent } = useCart()
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

                const detailQuery = `*[_type in ["popular", "recommended"] && slug.current == $slug][0]{
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
                }`

                const popularQuery = `*[_type == "popular"][0...4]{
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

                const recommendedQuery = `*[_type == "recommended"][0...4]{
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

                console.log('Detail slug:', slug)
                console.log('Detail response:', detailResponse)

                // If no detail found, log all available slugs for debugging
                if (!detailResponse) {
                    const allSlugs = await client.fetch(`*[_type in ["popular", "recommended"]].slug.current`)
                    console.log('All available slugs:', allSlugs)
                }

                setData(popularResponse)
                setData1(recommendedResponse)
                setCarData(detailResponse || undefined)

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

    const handleSubmit = async () => {
        if (!isSignedIn) {
            alert("You must be logged in to leave a review.");
            return;
        }

        if (!comment || rating === 0) {
            alert("Please provide a comment and a rating.");
            return;
        }

        const newReview: Review = {
            username: user?.fullName || "Anonymous",
            subname: user?.primaryEmailAddress?.emailAddress || "User",
            comment,
            rating,
            date: new Date().toISOString().split("T")[0], // Extracts YYYY-MM-DD only
            imageUrl: user?.imageUrl || "",
        };

        try {
            // Send new review to Sanity via API route
            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productSlug: slug,
                    ...newReview,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit review");
            }

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
        if (isInRent(slug)) {
            removeFromRent(slug)
        } else {
            addToRent(slug)
        }
    }

    if (loading) {
        return <div className="text-center text-2xl font-semibold min-h-[40vh] md:min-h-[70vh] flex items-center justify-center uppercase">Loading...</div>
    }

    if (!carData) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[40vh] md:min-h-[70vh] px-4">
                <p className="text-xl font-semibold text-gray-500 mb-2">Car not found</p>
                <p className="text-sm text-gray-400 mb-4">The car with slug &quot;{slug}&quot; doesn&apos;t exist</p>
                <Link href="/" className="px-6 py-3 bg-[#3563E9] text-white rounded-lg hover:bg-[#2851c7] transition-colors">
                    Go back to Home
                </Link>
            </div>
        )
    }

    return (
        <div className="w-full">
            <main className="w-full bg-[#F6F7F9]">
                <div className="flex flex-col xl:flex-row">
                    <div className="hidden xl:block xl:w-80 2xl:w-96 min-h-screen bg-white p-6 lg:p-8 xl:p-10 overflow-y-auto">
                        <CategoryTag />
                    </div>

                    <div className="w-full px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8">
                        {/* Product Details */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-7">
                            <div className="grid grid-cols-3 grid-rows-3 gap-3 sm:gap-4 lg:gap-5 w-full bg-white rounded-lg shadow-md pb-0 p-3 sm:p-4 md:p-5 lg:p-6">
                                <div className="col-span-3 row-span-2 rounded-lg text-black h-auto w-full">
                                    <div className="w-full h-full flex flex-col justify-between rounded-lg p-3 sm:p-4 md:p-5" style={{ backgroundImage: `url(${Pattern.src})`, backgroundSize: "cover" }} >

                                        <div className="w-full md:w-[70%] lg:w-[60%] space-y-1 sm:space-y-2 text-white">
                                            <h1 className="text-[14px] sm:text-[18px] md:text-[22px] lg:text-[26px] font-semibold leading-snug md:leading-relaxed">
                                                Sports car with the best design and acceleration
                                            </h1>
                                            <p className="font-medium text-[10px] sm:text-[11px] md:text-[12px] lg:text-[14px]">
                                                Safety and comfort while driving a futuristic and elegant sports car
                                            </p>
                                        </div>
                                        <Image
                                            className="flex justify-center items-center w-full p-3 sm:p-4 md:p-5 pb-0"
                                            src={carData?.image ? urlFor(carData?.image).url() : "/default-image.jpg"}
                                            alt={carData?.title || "Product Image"}
                                            width={400}
                                            height={200}
                                            priority
                                        />
                                    </div>
                                </div>
                                <div className="col-span-3 row-span-1 flex justify-between gap-2 sm:gap-3 lg:gap-4 py-2 sm:py-3">
                                    <div className="w-1/3 rounded-lg shadow-md p-1 border-2 border-[#3563E9]">
                                        <div className="w-full h-full flex justify-center items-center rounded-md p-1 sm:p-2" style={{ backgroundImage: `url(${Pattern.src})`, backgroundSize: "cover" }} >
                                            <Image src={carData?.image ? urlFor(carData?.image).url() : "/default-image.jpg"}
                                                alt={carData?.title || "Product Image"} className="w-full h-10 sm:h-12 md:h-14 lg:h-16 object-contain" width={200} height={100} />
                                        </div>
                                    </div>
                                    <div className="w-1/3 shadow-md rounded-lg overflow-hidden">
                                        <Image src={v2} className="w-full h-full object-cover" alt="View2" width={150} height={100} />
                                    </div>
                                    <div className="w-1/3 shadow-md rounded-lg overflow-hidden">
                                        <Image src={v3} className="w-full h-full object-cover" alt="View3" width={150} height={100} />
                                    </div>
                                </div>
                            </div>
                            <ProductDetails id={carData.id} slug={carData.slug} title={carData.title} type={carData.type} category={carData.category} capacity={carData.capacity} price={carData.price} discount={carData.discount} onAddToCart={() => handleAddToCart(carData.slug)} isInCart={isInRent(carData.slug)} fuel={carData.fuel} link={carData.slug} rating={averageRating} />
                        </div>


                        {/* Reviews Area  */}
                        <div className="w-full h-auto rounded-lg shadow-md bg-white p-4 sm:p-6 md:p-7 lg:p-8 mt-5 sm:mt-6 lg:mt-7">

                            {isSignedIn ? (
                                <>
                                    {/* Comment */}
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Write your comment here..."
                                        className="w-full border border-gray-300 outline-none rounded-lg p-3 mb-4 text-sm sm:text-base resize-none"
                                        rows={4}
                                    />

                                    {/* Rating */}
                                    <div className="flex justify-center items-center mb-4 text-sm sm:text-base md:text-lg font-medium text-gray-400">
                                        <label className="mr-2 sm:mr-4">Rating:</label>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => setRating(star)}
                                                className={`cursor-pointer transition-transform ${hoverRating >= star || rating >= star
                                                    ? "text-xl sm:text-2xl md:text-3xl text-yellow-500"
                                                    : "text-xl sm:text-2xl md:text-3xl text-gray-400"
                                                    }`}
                                                aria-label={`Rate ${star} stars`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-center md:justify-end">
                                        <button
                                            onClick={handleSubmit}
                                            className="px-4 py-2 sm:px-6 sm:py-3 bg-[#3563E9] hover:bg-[#2851c7] text-white font-semibold text-sm sm:text-base md:text-lg rounded-lg transition-colors"
                                        >
                                            Submit Review
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <a href={`/signIn?redirect_url=${encodeURIComponent(window.location.href)}`} className="flex justify-center text-red-500 text-base sm:text-lg md:text-xl font-semibold cursor-pointer hover:text-red-600 transition-colors">Please log in to leave a review.</a>
                            )}

                            <div className={reviews.length == 0 ? `hidden` : `flex items-center gap-2 sm:gap-3 pt-5`}>
                                <h1 className="font-semibold text-[#1A202C] text-[16px] sm:text-[18px] md:text-[20px]">Reviews</h1>
                                <h2 className="py-1 px-2 sm:px-3 md:px-4 bg-[#3563E9] text-[10px] sm:text-[12px] md:text-[14px] font-bold rounded-md text-white">{reviews.length}</h2>
                            </div>
                            {/* Display Reviews */}
                            <div className="mt-4 space-y-4">
                                {reviews.length > 0 ? (
                                    (showAllReviews ? reviews : reviews.slice(0, 2)).map((review, index) => (
                                        <div key={review._id || index} className="border-b border-gray-200 pb-4">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 py-3">
                                                <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
                                                    <Image
                                                        src={review.imageUrl || "/placeholder-avatar.png"}
                                                        alt={`${review.username}'s profile`}
                                                        className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover flex-shrink-0"
                                                        width={56}
                                                        height={56}
                                                    />
                                                    <div className="space-y-1">
                                                        <h2 className="text-[#1A202C] text-[14px] sm:text-[16px] md:text-[18px] font-bold">
                                                            {review.username}
                                                        </h2>
                                                        <p className="text-[#90A3BF] text-[10px] sm:text-[12px] md:text-[14px] font-medium">
                                                            {review.subname}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-left sm:text-right mt-2 sm:mt-0 space-y-1">
                                                    <h2 className="text-[#90A3BF] text-[10px] sm:text-[12px] md:text-[14px] font-medium">
                                                        {review.date}
                                                    </h2>
                                                    <div>
                                                        <p className="text-yellow-500 text-lg sm:text-xl md:text-2xl">
                                                            {"★".repeat(review.rating)}{" "}
                                                            {"☆".repeat(5 - review.rating)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-[13px] sm:text-[14px] text-[#596780] leading-relaxed">
                                                {review.comment}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-400 text-base sm:text-lg py-10">No reviews yet. Be the first to review!</p>
                                )}
                            </div>

                            {reviews.length > 2 && (
                                <div className="flex justify-center pt-6 sm:pt-8 lg:pt-10">
                                    <button
                                        onClick={toggleShowAllReviews}
                                        className="text-[#90A3BF] text-sm sm:text-base md:text-lg font-medium hover:text-[#3563E9] transition-colors"
                                    >
                                        {showAllReviews ? "Show Less" : "Show All"}
                                    </button>
                                </div>
                            )}
                        </div>


                        {/* Recent Cars  */}
                        <div className="flex justify-between px-2 sm:px-4 py-5 sm:py-6 lg:pt-8">
                            <h1 className="text-[14px] sm:text-[16px] text-[#90A3BF] font-semibold">Recent Cars</h1>
                            <button className="text-[#3563E9] text-[14px] sm:text-[16px] font-semibold hover:text-[#2851c7] transition-colors">View All</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 justify-items-center px-2 sm:px-4">
                            {data?.length ? (
                                data?.map((car: Car) => {
                                    return (
                                        <ProductCard
                                            key={car.slug}
                                            id={car.id}
                                            slug={car.slug}
                                            title={car.title}
                                            category={car.category}
                                            capacity={car.capacity}
                                            image={car.image}
                                            fuel={car.fuel}
                                            type={car.type}
                                            price={car.price}
                                            discount={car.discount}
                                            link={`/details/${car.slug}`}
                                            onAddToCart={() => handleAddToCart(car.slug)}
                                            isInCart={isInRent(car.slug)}
                                        />
                                    );
                                })) : (<p className="col-span-full text-center text-gray-400 text-lg py-10">No Cars Available</p>)}
                        </div>


                        {/* Recommended Cars  */}

                        <div className="flex justify-between px-2 sm:px-4 py-5 sm:py-6 lg:pt-8">
                            <h1 className="text-[14px] sm:text-[16px] text-[#90A3BF] font-semibold">Recommended Cars</h1>
                            <Link href="/category/"><button className="text-[#3563E9] text-[14px] sm:text-[16px] font-semibold hover:text-[#2851c7] transition-colors">View All</button></Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 justify-items-center px-2 sm:px-4 pb-8">
                            {data1?.length ? (
                                data1?.map((car: Car) => {
                                    return (
                                        <ProductCard
                                            key={car.slug}
                                            id={car.id}
                                            slug={car.slug}
                                            title={car.title}
                                            category={car.category}
                                            capacity={car.capacity}
                                            image={car.image}
                                            fuel={car.fuel}
                                            type={car.type}
                                            price={car.price}
                                            discount={car.discount}
                                            link={`/details/${car.slug}`}
                                            onAddToCart={() => handleAddToCart(car.slug)}
                                            isInCart={isInRent(car.slug)}
                                        />
                                    );
                                })) : (<p className="col-span-full text-center text-gray-400 text-lg py-10">No Cars Available</p>)}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
