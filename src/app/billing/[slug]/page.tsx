"use client"

import Image from "next/image"
import Header2 from "../../Components/Header2"
import Link from "next/link"
import axios from "axios";
import { Address, Rate, trackingObjType } from "../../../../type";
import { cartProductsWhichCanBeShipped } from "../../../../data";
import { client } from "@/sanity/lib/client";
import React, { useState, useEffect, use, useRef, useCallback } from "react";
import { urlFor } from "@/sanity/lib/image"
import Pattern from "@/Public/Pattern.png"
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createPaymentIntent } from "./action"; // Replace with your server-side action to create a PaymentIntent
import shield from "../../../../public/shield.svg"
// import Bitcoin from "../../../../public/Bitcoin.svg"
// import Paypal from "../../../../public/Paypal.svg"
import swap from "../../../../public/swap.svg"

// Initialize Stripe with the public key from environment variables
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);


interface Car {
    id: string;
    slug: { current: string };
    title: string;
    name: string;
    category: string;
    image: string;
    fuel: string;
    type: string;
    capacity: string;
    price: number;
    discount: number;
    rating?: number;
}

interface Review {
    rating: number
}

interface Data {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    state?: string;
    country?: string;
}

export default function BillingInfo({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);

    const [fetch, setFetch] = useState<Car | undefined>();

    const [rates, setRates] = useState<Rate[]>([]);
    const [rateId, setrateId] = useState<string | null>(null);
    const [labelPdf, setLabelPdf] = useState<string | null>(null);
    const [trackingObj, setTrackingObj] = useState<trackingObjType | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    // const [submittedData, setSubmittedData] = useState<Data>(undefined);
    const [selectedOption, setSelectedOption] = useState<string>("pick");
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null); // Error state
    const [reviews, setReviews] = useState<Review[]>([])
    console.log(error)
    const today = new Date();
    const currentDate = today.toISOString().split("T")[0]; // YYYY-MM-DD
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    const nextDate = nextDay.toISOString().split("T")[0]; // YYYY-MM-DD
    const currentHour = today.toTimeString().slice(0, 5); // HH:MM format

    const nameRef = useRef<HTMLInputElement | null>(null);
    const phoneRef = useRef<HTMLInputElement | null>(null);
    const addressRef = useRef<HTMLInputElement | null>(null);
    const cityRef = useRef<HTMLInputElement | null>(null);
    const postalCodeRef = useRef<HTMLInputElement | null>(null);
    const stateRef = useRef<HTMLInputElement | null>(null);
    const countryRef = useRef<HTMLInputElement | null>(null);

    const [submittedData, setSubmittedData] = useState<Data|null>(null);

    // State for pickup and drop-off details
    const [pickup, setPickup] = useState({
        location: "khi",
        date: currentDate,
        time: currentHour,
    });

    const [dropoff, setDropoff] = useState({
        location: "hyd",
        date: nextDate,
        time: currentHour,
    });

    // Swap Function
    const handleSwap = () => {
        setPickup((prev) => ({
            location: dropoff.location,
            date: prev.date < dropoff.date ? prev.date : dropoff.date, // Ensure pickup date is earlier
            time: dropoff.time,
        }));
        setDropoff((prev) => ({
            location: pickup.location,
            date: prev.date > pickup.date ? prev.date : nextDate, // Ensure drop-off is later
            time: pickup.time,
        }));
    };

    const [isChecked1, setIsChecked1] = useState(false);
    const [isChecked2, setIsChecked2] = useState(false);

    // Check if both checkboxes are selected
    const isButtonEnabled = isChecked1 && isChecked2;

    // Handle button click and submit payment form
    const handleRentNowClick = () => {
        const form = document.getElementById("payment-form") as HTMLFormElement;
        form?.requestSubmit();
    };

    // Handle input changes
    const handleOptionChange = (option: string) => {
        setSelectedOption(option);
    };

    const [shipeToAddress, setshipeToAddress] = useState<Address>({
        name: "John Doe",
        phone: "+1 555-678-1234",
        addressLine1: "1600 Pennsylvania Avenue NW",
        addressLine2: "", // Optional
        cityLocality: "Washington",
        stateProvince: "DC",
        postalCode: "20500",
        countryCode: "US",
        addressResidentialIndicator: "no", // 'no' means a commercial address
    });

    // Function to handle form submission of shipping rates
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors([]);
        setRates([]);

        setSubmittedData({
            name: nameRef.current?.value || "",
            phone: phoneRef.current?.value || "",
            address: addressRef.current?.value || "",
            city: cityRef.current?.value || "",
            postalCode: postalCodeRef.current?.value || "",
            state: stateRef.current?.value || "",
            country: countryRef.current?.value || "",
        });

        try {
            const response = await axios.post("/api/shipengine/get-rates", {
                shipeToAddress,
                // map the cart products which can be shipped and use only weight and dimensions
                packages: cartProductsWhichCanBeShipped.map((product) => ({
                    weight: product.weight,
                    dimensions: product.dimensions,
                })),
            });
            // see the response in browser
            console.log(response.data);
            // Update the state with the fetched rates
            setRates(response.data.shipmentDetails.rateResponse.rates);
        } catch (error) {
            console.log(error);
            setErrors(["An error occurred while fetching rates."]);
        } finally {
            setLoading(false);
        }
    };

    // Function to create label from selected rate
    const handleCreateLabel = async () => {
        if (!rateId) {
            alert("Please select a rate to create a label.");
        }

        setLoading(true);
        setErrors([]);

        try {
            // get rateId which user selected
            const response = await axios.post("/api/shipengine/label", {
                rateId: rateId,
            });
            const labelData = response.data;
            // see the response of label in browser
            console.log(labelData);
            // set pdf url
            setLabelPdf(labelData.labelDownload.href);
            // set tracking obj
            setTrackingObj({
                trackingNumber: labelData.trackingNumber,
                labelId: labelData.labelId,
                carrierCode: labelData.carrierCode,
            });
        } catch (error) {
            console.log(error);
            setErrors(["An error occurred while creating the label."]);
        } finally {
            setLoading(false);
        }
    };

    // const fetchReviews = async () => {
    //     try {
    //         const reviewQuery = `*[_type == "review" && productSlug == $slug]{
    //             rating,
    //         }`
    //         const Rating1 = await client.fetch(reviewQuery, { slug })
    //         setReviews(Rating1)
    //     } catch (error) {
    //         console.error("Error fetching reviews:", error)
    //     }
    // }

    const fetchReviews = useCallback(async () => {
        try {
            const reviewQuery = `*[_type == "review" && productSlug == $slug]{
                rating,
            }`;
            const Rating1 = await client.fetch(reviewQuery, { slug });
            setReviews(Rating1);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    }, [slug]); // Depend only on `slug`
    
    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const calculateAverageRating = (): string => {
        if (reviews.length === 0) return "0"; // Return "0" as a string

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (totalRating / reviews.length).toFixed(1); // Always return a string
    };

    const averageRating = parseFloat(calculateAverageRating());

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Query for specific item details
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
                     "review": coalesce(round(average(review[].rating)), 0),
                     review[] {
                       rating,
                     },
                }`;

                // Fetch data from Sanity
                const detailResponse = await client.fetch(detailQuery, { slug });

                // Set state
                setFetch(detailResponse?.length > 0 ? detailResponse[0] : undefined);
                await fetchReviews()
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, [slug]);

    useEffect(() => {
        if (!fetch) return;

        const fetchClientSecret = async () => {
            try {
                const price = fetch?.price || 1;
                const { clientSecret } = await createPaymentIntent(price);
                setClientSecret(clientSecret);
            } catch (err) {
                console.error("Error creating PaymentIntent:", err);
                setError("Failed to initialize payment. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchClientSecret();
    }, [fetch]);

    if (loading || !clientSecret) {
        return <div className="text-center text-2xl font-semibold py-44 uppercase">Loading...</div>;
    }

    if (!fetch) {
        return (
            <div>
                <Header2 />
                <div className="flex justify-center items-center text-xl font-semibold">
                    Connect your internet first
                </div>
            </div>
        );
    }

    return (
        <>
            <Header2 />
            <main className="bg-[#F6F7F9] w-full h-full">
                <div className="lg:mx-10 md:mx-8 mx-5 py-10">
                    <div className="flex flex-col lg:flex-row items-start gap-10">
                        <div className="order-2 lg:order-1 inline-block w-full space-y-10">
                            <form className="space-y-10" onSubmit={handleSubmit} >




                                {/* Step 1 Billing info */}

                                <div className="w-full h-auto bg-white rounded-lg shadow-md p-4">
                                    <div className="flex justify-between items-center">
                                        <h1 className="text-[#1A202C] lg:text-[20px] md:text-[18px] text-[16px] font-bold">Billing Info</h1>
                                        <p className="lg:hidden text-[#90A3BF] text-[12px] lg:text-[14px] font-medium">Step 1 of 4</p>
                                    </div>
                                    <div className="flex justify-between items-center text-[#90A3BF] text-[12px] lg:text-[14px] font-medium">
                                        <p>Please enter your billing info</p>
                                        <p className="hidden lg:block text-[#90A3BF] text-[12px] lg:text-[14px] font-medium ">Step 1 of 4</p>
                                    </div>
                                    <div className="md:grid md:grid-cols-2 items-start space-y-6 md:space-y-0 gap-4 md:gap-y-10 py-5">
                                        <div className="list-inside md:space-y-4 space-y-2">
                                            <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="name">Name</label>
                                            <input ref={nameRef} type="name" value={shipeToAddress.name}
                                                onChange={(e) =>
                                                    setshipeToAddress({ ...shipeToAddress, name: e.target.value })
                                                } className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none" placeholder="Your name" />
                                        </div>
                                        <div className="list-inside md:space-y-4 space-y-2">
                                            <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="tel">Phone number</label>
                                            <input ref={phoneRef} type="number" value={shipeToAddress.phone}
                                                onChange={(e) =>
                                                    setshipeToAddress({ ...shipeToAddress, phone: e.target.value })
                                                } className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none" placeholder="Your number" />
                                        </div>
                                        <div className="list-inside md:space-y-4 space-y-2">
                                            <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="text">Address</label>
                                            <input ref={addressRef} type="address" value={shipeToAddress.addressLine1}
                                                onChange={(e) =>
                                                    setshipeToAddress({ ...shipeToAddress, addressLine1: e.target.value })
                                                } className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none" placeholder="Address" />
                                        </div>
                                        <div className="list-inside md:space-y-4 space-y-2">
                                            <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="town/city">Town / City</label>
                                            <input ref={cityRef} type="text" value={shipeToAddress.cityLocality}
                                                onChange={(e) =>
                                                    setshipeToAddress({ ...shipeToAddress, cityLocality: e.target.value })
                                                } className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none" placeholder="Town or city" />
                                        </div>
                                        <div className="list-inside md:space-y-4 space-y-2">
                                            <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="town/city">Postal Code</label>
                                            <input ref={postalCodeRef} type="text" value={shipeToAddress.postalCode}
                                                onChange={(e) =>
                                                    setshipeToAddress({ ...shipeToAddress, postalCode: e.target.value })
                                                } className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none" placeholder="Postal Code" />
                                        </div>
                                        <div className="list-inside md:space-y-4 space-y-2">
                                            <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="town/city">State/Province</label>
                                            <input ref={stateRef} type="text" value={shipeToAddress.stateProvince}
                                                onChange={(e) =>
                                                    setshipeToAddress({ ...shipeToAddress, stateProvince: e.target.value })
                                                } className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none" placeholder="State/Province" />
                                        </div>
                                        <div className="list-inside md:space-y-4 space-y-2">
                                            <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="town/city">Country Code</label>
                                            <input ref={countryRef} type="text" value={shipeToAddress.countryCode}
                                                onChange={(e) =>
                                                    setshipeToAddress({ ...shipeToAddress, countryCode: e.target.value })
                                                } className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none" placeholder="Country Code" />
                                        </div>
                                    </div>

                                </div>



                                {/* Step 2 Rental Info */}

                                <div className="w-full h-auto bg-white rounded-lg shadow-md p-4">
                                    <div className="flex justify-between items-center">
                                        <h1 className="text-[#1A202C] lg:text-[20px] md:text-[18px] text-[16px] font-bold">Rental Info</h1>
                                        <p className="lg:hidden text-[#90A3BF] text-[12px] lg:text-[14px] font-medium">Step 2 of 4</p>
                                    </div>
                                    <div className="flex justify-between items-center text-[#90A3BF] text-[12px] lg:text-[14px] font-medium">
                                        <p>Please select your rental date</p>
                                        <p className="hidden lg:block text-[#90A3BF] text-[12px] lg:text-[14px] font-medium">Step 2 of 4</p>
                                    </div>
                                    <div className="flex gap-5 py-10">
                                        <input type="radio" id="pick" checked={selectedOption === "pick"} onChange={() => handleOptionChange("pick")} />
                                        <label htmlFor="pick" className="md:text-[16px] text-[14px] text-[#1A202C] font-semibold">Pick-Up</label>
                                    </div>

                                    <div className="md:grid md:grid-cols-2 items-start space-y-6 md:space-y-0 gap-4 md:gap-y-10">
                                        <div className="list-inside md:space-y-4 space-y-2">
                                            <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="location">Location</label>

                                            <div className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none items-center" >
                                                <select value={pickup.location} onChange={(e) => setPickup({ ...pickup, location: e.target.value })} className="bg-transparent outline-none border-none w-full mt-3" name="city" id="city">
                                                    {[
                                                        { value: "none", label: "Select your city" },
                                                        { value: "khi", label: "Karachi" },
                                                        { value: "hyd", label: "Hyderabad" },
                                                        { value: "lhr", label: "Lahore" },
                                                        { value: "qta", label: "Quetta" },
                                                        { value: "isb", label: "Islamabad" },
                                                        { value: "nbs", label: "Nawabshah" },
                                                    ].map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="list-inside md:space-y-4 space-y-2">
                                            <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="date">Date</label>
                                            <input
                                                type="date"
                                                id="pick-date"
                                                className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none"
                                                value={pickup.date}
                                                min={currentDate}
                                                onChange={(e) => setPickup({ ...pickup, date: e.target.value })}
                                            />
                                        </div>
                                        <div className="list-inside md:space-y-4 space-y-2">
                                            <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="pick-time">Time</label>
                                            <input
                                                type="time"
                                                id="pick-time"
                                                className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none"
                                                value={pickup.time}
                                                onChange={(e) => setPickup({ ...pickup, time: e.target.value })}
                                            />
                                        </div>

                                        <div className="list-inside md:space-y-4 space-y-2 w-full">
                                            <div className="h-8" />
                                            <div onClick={handleSwap} className="flex justify-center items-center w-full bg-[#3967ee] hover:bg-blue-700 rounded-lg h-12 md:text-[16px] text-[14px] text-white font-semibold">
                                                <Image className="font-black" src={swap} alt="swap" width={25} height={10} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-5 py-10">
                                        <input type="radio" id="drop" onChange={() => handleOptionChange("drop")} checked={selectedOption === "drop"} />
                                        <label htmlFor="drop" className="text-[16px] text-[#1A202C] font-semibold">Drop - Off</label>
                                    </div>
                                    <div className="md:grid md:grid-cols-2 items-start space-y-6 md:space-y-0 gap-4 md:gap-y-10">
                                        <div className="list-inside md:space-y-4 space-y-2">
                                            <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="location">Location</label>

                                            <div className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none items-center" >
                                                <select value={dropoff.location} onChange={(e) => setDropoff({ ...dropoff, location: e.target.value })} className="bg-transparent outline-none border-none w-full mt-3" name="city" id="city">
                                                    {[
                                                        { value: "none", label: "Select your city" },
                                                        { value: "khi", label: "Karachi" },
                                                        { value: "hyd", label: "Hyderabad" },
                                                        { value: "lhr", label: "Lahore" },
                                                        { value: "qta", label: "Quetta" },
                                                        { value: "isb", label: "Islamabad" },
                                                        { value: "nbs", label: "Nawabshah" },
                                                    ].map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                        </div>
                                        <div className="list-inside md:space-y-4 space-y-2">
                                            <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="date">Date</label>
                                            <input
                                                type="date"
                                                id="drop-date"
                                                className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none"
                                                value={dropoff.date}
                                                min={currentDate}
                                                onChange={(e) => setDropoff({ ...dropoff, date: e.target.value })}
                                            />
                                        </div>
                                        <div className="list-inside md:space-y-4 space-y-2">
                                            <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="drop-time">Time</label>
                                            <input
                                                type="time"
                                                id="drop-time"
                                                className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none"
                                                value={dropoff.time}
                                                onChange={(e) => setDropoff({ ...dropoff, time: e.target.value })}
                                            />
                                        </div>
                                        <div className="list-inside md:space-y-4 space-y-2 w-full">
                                            <div className="h-8" />
                                            <button className="w-full bg-[#3967ee] hover:bg-blue-700 rounded-lg h-12 md:text-[16px] text-[14px] text-white font-semibold" type="submit">Shipment</button>
                                        </div>
                                    </div>
                                </div>
                            </form>



                            {/* Step 3 Payment Method */}

                            <div className="w-full h-auto bg-white rounded-lg shadow-md pt-4 p-4">
                                <div className="flex justify-between items-center">
                                    <h1 className="text-[#1A202C] lg:text-[20px] md:text-[18px] text-[16px] font-bold">Payment Method</h1>
                                    <p className="lg:hidden text-[#90A3BF] text-[12px] lg:text-[14px] font-medium">Step 3 of 4</p>
                                </div>
                                <div className="flex justify-between items-center text-[#90A3BF] text-[12px] lg:text-[14px] font-medium">
                                    <p>Please enter your payment method</p>
                                    <p className="hidden lg:block text-[#90A3BF] text-[12px] lg:text-[14px] font-medium">Step 3 of 4</p>
                                </div>
                                <div className="gap-5 pt-10">
                                    <div className="w-full rounded-lg p-4 bg-[#F6F7F9]">
                                        <div className="flex justify-between py-5">
                                            <div className="flex gap-4">
                                                <input
                                                    type="radio"
                                                    id="credit-card"
                                                    checked={true} // Always selected since Stripe handles credit card payments
                                                    onChange={() => { }}
                                                />
                                                <label htmlFor="credit-card" className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold">
                                                    Credit Card
                                                </label>
                                            </div>
                                            <div className="flex gap-4">
                                                {/* Credit card icons */}
                                                <svg width="48" height="16" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    {/* SVG paths for credit card icons */}
                                                </svg>
                                                <svg className="pb-1" width="35" height="22" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    {/* SVG paths for credit card icons */}
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Stripe PaymentElement */}
                                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                                            <PaymentForm onPaymentSubmit={() => console.log("Payment Completed")} />
                                        </Elements>
                                    </div>


                                    {/* Other payment methods (PayPal, Bitcoin, etc.) */}
                                    {/* <div className="space-y-5 py-7">
                                        <div className="flex justify-between items-center rounded-lg w-full h-16 bg-[#F6F7F9] px-4">
                                            <div className="flex gap-4">
                                                <input type="radio" id="paypal" checked={false} onChange={() => { }} />
                                                <label htmlFor="paypal" className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold">
                                                    PayPal
                                                </label>
                                            </div>

                                            <Image src={Paypal} alt="Paypal-icon" width={100} height={24}/>

                                        </div>
                                        <div className="flex justify-between items-center rounded-lg w-full h-16 bg-[#F6F7F9] px-4">
                                            <div className="flex gap-4">
                                                <input type="radio" id="bitcoin" checked={false} onChange={() => { }} />
                                                <label htmlFor="bitcoin" className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold">
                                                    Bitcoin
                                                </label>
                                            </div>
                                            <Image src={Bitcoin} alt="shield-icon" width={94} height={20} />
                                        </div>
                                    </div> */}

                                </div>
                            </div>


                            {/* Step 4  */}
                            <div className="w-full h-auto bg-white rounded-lg shadow-md p-4">
                                <div className="flex justify-between items-center">
                                    <h1 className="text-[#1A202C] lg:text-[20px] md:text-[18px] text-[16px] font-bold">Confirmation</h1>
                                    <p className="lg:hidden text-[#90A3BF] text-[12px] lg:text-[14px] font-medium">Step 4 of 4</p>
                                </div>
                                <div className="flex justify-between items-center text-[#90A3BF] text-[12px] lg:text-[14px] font-medium">
                                    <p>We are getting to the end. Just few clicks<br className="lg:hidden" /> and your rental is ready!</p>
                                    <p className="hidden lg:block text-[#90A3BF] text-[14px] font-medium">Step 4 of 4</p>
                                </div>
                                <div className="space-y-5 pt-10">
                                    <div className="relative flex justify-start gap-4 items-center rounded-lg w-full h-[70px] sm:h-16 bg-[#F6F7F9] lg:px-4 p-5">
                                        <input type="checkbox" id="agree-1" onChange={() => setIsChecked1(!isChecked1)} />
                                        <label htmlFor="agree-1" className="text-[#1F2544] text-[12px] lg:text-[16px] font-medium">I agree with sending an Marketing and newsletter emails. No spam, promissed!</label>
                                    </div>
                                    <div className="flex justify-start gap-4 items-center rounded-lg w-full h-[70px] sm:h-16 bg-[#F6F7F9] lg:px-4 p-5">
                                        <input type="checkbox" id="agree-2" onChange={() => setIsChecked2(!isChecked2)} />
                                        <label htmlFor="agree-2" className="text-[#1F2544] text-[12px] lg:text-[16px] font-medium">I agree with our <span className="underline">terms and conditions</span> and  <span className="underline">privacy policy!</span></label>
                                    </div>
                                </div>
                                <div className="py-5">
                                    <Link href={`/admin/${fetch?.slug}`}>

                                        <button
                                            onClick={handleRentNowClick}
                                            disabled={!isButtonEnabled}
                                            className={`px-6 py-4 font-semibold text-[16px] rounded-lg ${isButtonEnabled ? "bg-[#3563E9] text-white" : "bg-slate-300 text-red-400 cursor-not-allowed"
                                                }`}
                                        >
                                            Rent Now
                                        </button>
                                    </Link>
                                </div>
                                <Image src={shield.src} alt="shield-icon" width={30} height={32} />

                                <div className="py-6 space-y-2">
                                    <h2 className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold">All your data are safe</h2>
                                    <p className="text-[#90A3BF] md:text-[14px] text-[12px] font-medium">We are using the most advanced security to provide you the best experience ever.</p>
                                </div>
                            </div>
                        </div>


                        {/* Rental Summary  */}
                        <div className="w-full h-auto sticky lg:top-32 order-1 lg:order-2 space-y-10">
                            <div className="bg-[white] rounded-lg shadow-md p-4">
                                <h1 className="text-[#1A202C] lg:text-[20px] md:text-[18px] text-[16px] font-bold">Rental Summary</h1>
                                <p className="text-[#90A3BF] lg:text-[14px] text-[12px] font-medium">Prices may change depending on the length of the rental and the price of your rental car.</p>
                                <div className="flex justify-start items-center gap-2 lg:gap-5 py-5">

                                    <div className="w-28 lg:w-48 h-24 lg:h-44 p-2 shadow-md flex justify-center items-center rounded-lg" style={{ backgroundImage: `url(${Pattern.src})`, backgroundSize: "cover" }} >
                                        <Image src={fetch?.image ? urlFor(fetch?.image).url() : "/default-image.jpg"}
                                            alt={fetch?.title || "Product Image"} className="" width={200} height={20} />
                                    </div>
                                    <div>
                                        <h1 className="lg:text-[28px] md:text-[22px] text-[16px] font-bold">{fetch?.title}</h1>
                                        <div className="flex items-center">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span
                                                    key={star}
                                                    className={`text-lg lg:text-xl ${averageRating >= star
                                                        ? "text-yellow-500"
                                                        : averageRating >= star - 0.5
                                                            ? "text-yellow-300"
                                                            : "text-gray-300"
                                                        }`}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                            {averageRating > 0 && (
                                                <span className="mt-1 text-[10px] whitespace-nowrap md:text-[14px] font-medium text-[#596780]">
                                                    {averageRating.toFixed(1)} Rating
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="py-5 space-y-5">
                                    <div className="flex justify-between text-[14px] md:text-[16px]">
                                        <p className="text-[#90A3BF] font-medium">Subtotal</p>
                                        <p className="text-[#1A202C] font-semibold">${fetch?.price}.00</p>
                                    </div>
                                    <div className="flex justify-between text-[14px] md:text-[16px]">
                                        <p className="text-[#90A3BF] font-medium">Tax</p>
                                        <p className="text-[#1A202C] font-semibold">$0</p>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center mt-4">
                                    <input className="w-full h-16 px-10 outline-none rounded-l-lg bg-[#F6F7F9] text-[12px] md:text-[16px]" placeholder="Apply promo code"></input>
                                    <div className="relative w-60 h-16  bg-[#F6F7F9] rounded-r-lg items-center text-center font-semibold md:text-[16px] text-[12px] text-[#1A202C] py-5 pr-4"><h2>Apply now</h2></div>
                                </div>
                                <div className="flex justify-between items-center py-8 ">
                                    <div className="gap-3">
                                        <h2 className="lg:text-[20px] text-base text-[#1A202C] font-bold" >Total Rental Price</h2>
                                        <p className="text-[#90A3BF] md:text-[14px] text-[12px] font-medium">Overall price and includes rental discount</p>
                                    </div>
                                    <h1 className="lg:text-[28px] md:text-[24px] text-[16px] font-semibold text-[#1A202C]">${fetch?.price}.00</h1>
                                </div>

                            </div>

                            {submittedData && (
                                <div className="flex flex-col w-full h-auto p-4 bg-[white] rounded-lg shadow-md">

                                    <h6 className="text-xl font-bold">Ship To Address</h6>
                                    <div className="w-full mt-6 p-4 bg-gray-100 rounded">
                                        <p><strong>Name:</strong> {submittedData.name}</p>
                                        <p><strong>Phone:</strong> {submittedData.phone}</p>
                                        <p><strong>Address:</strong> {submittedData.address}</p>
                                        <p><strong>City:</strong> {submittedData.city}</p>
                                        <p><strong>Postal Code:</strong> {submittedData.postalCode}</p>
                                        <p><strong>State:</strong> {submittedData.state}</p>
                                        <p><strong>Country Code:</strong> {submittedData.country}</p>
                                    </div>
                                </div>)}
                            <div>
                                {rates.length > 0 && (
                                    <div className="mt-8">
                                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                            Available Shipping Rates
                                        </h2>
                                        <div className="gap-2 grid grid-cols-2 md:grid-cols-3 items-start md:items-center">
                                            {rates.map((rate) => (
                                                <div
                                                    key={rate.rateId}
                                                    className={`h-full w-full items-center flex flex-col justify-center p-4 border rounded-lg shadow-md transition-transform transform scale-75 md:scale-90 lg:scale-100 hover:scale-90 md:hover:scale-100 lg:hover:scale-105 cursor-pointer ${rateId === rate.rateId
                                                        ? "border-blue-500 bg-blue-100"
                                                        : "border-gray-200 bg-gray-50"
                                                        }`}
                                                    onClick={() => setrateId(rate.rateId)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name="shippingRate"
                                                            checked={rateId === rate.rateId}
                                                            onChange={() => setrateId(rate.rateId)}
                                                            className="form-radio h-4 w-4 text-blue-500"
                                                        />
                                                        <div>
                                                            <p className="text-base md:text-lg font-medium text-gray-700">
                                                                <strong>Carrier:</strong> {rate.carrierFriendlyName}
                                                            </p>
                                                            <p className="text-[10px] md:text-base text-gray-600">
                                                                <strong>Service:</strong> {rate.serviceType}
                                                            </p>
                                                            <p className="text-[10px] md:text-base text-gray-800 font-semibold">
                                                                <strong>Cost:</strong> {rate.shippingAmount.amount}{" "}
                                                                {rate.shippingAmount.currency}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Create Label Button */}
                                {rateId && (
                                    <div className="mt-8">
                                        <button
                                            onClick={handleCreateLabel}
                                            disabled={loading}
                                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                                        >
                                            {loading ? "Creating Label..." : "Create Label"}
                                        </button>
                                    </div>
                                )}
                                {labelPdf && (
                                    <Link target="_blank" href={labelPdf}> <button className="px-4 py-2 mt-5 bg-green-500 text-white rounded-md hover:bg-green-600">Download Label</button></Link>
                                )}
                                {trackingObj && (
                                    <div className="mt-8">
                                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                            Tracking thinks (We are using ShipEngine test api key so order will not trace)
                                        </h2>
                                        <p>tracking number: {trackingObj.trackingNumber}</p>
                                        <p> labelId: {trackingObj.labelId}</p>
                                        <p> carrierCode: {trackingObj.carrierCode}</p>
                                        <Link href={`/tracking/?labelId=${trackingObj.labelId}`}>
                                            <button className="px-4 py-2 mt-5 bg-blue-500 text-white rounded-md hover:bg-blue-600">Track Order</button>
                                        </Link>
                                    </div>
                                )}
                                {errors.length > 0 && (
                                    <div className="mt-8">
                                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Errors</h2>
                                        <div className="space-y-2">
                                            {errors.map((error, index) => (
                                                <p key={index} className="text-red-500">
                                                    {error}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}



// Define the props type
interface PaymentFormProps {
    onPaymentSubmit: () => void;
}

function PaymentForm({ onPaymentSubmit }: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    // }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        const { error } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });

        if (error) {
            setErrorMessage(error.message || "An unknown error occurred");
        } else {
            alert("Payment successful!");
            onPaymentSubmit(); // Call the function passed from the parent
        }
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement />
            {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
        </form>
    );
}