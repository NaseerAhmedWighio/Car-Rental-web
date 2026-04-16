"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import swap from "../../../public/swap.svg";

interface Car {
  _id: string;
  slug: string;
  title: string;
  category: string;
  image: any;
  fuel: string;
  type: string;
  capacity: string;
  price: number;
  discount?: number;
}

export default function CheckoutPage() {
  const [cartSlugs, setCartSlugs] = useState<string[]>([]);
  const [cartData, setCartData] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const today = new Date();
  const currentDate = today.toISOString().split("T")[0];
  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() + 1);
  const nextDate = nextDay.toISOString().split("T")[0];
  const currentHour = today.toTimeString().slice(0, 5);

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

  const [isChecked, setIsChecked] = useState(false);

  const handleSwap = () => {
    setPickup((prev) => ({
      location: dropoff.location,
      date: prev.date < dropoff.date ? prev.date : dropoff.date,
      time: dropoff.time,
    }));
    setDropoff((prev) => ({
      location: pickup.location,
      date: prev.date > pickup.date ? prev.date : nextDate,
      time: pickup.time,
    }));
  };

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cartSlugs");
    if (storedCart) {
      setCartSlugs(JSON.parse(storedCart));
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch cart data
  useEffect(() => {
    if (cartSlugs.length === 0) {
      setCartData([]);
      setLoading(false);
      return;
    }

    const fetchCartData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(
          `*[_type in ["popular","recommended"] && slug.current in $slugs]{
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
          }`,
          { slugs: cartSlugs }
        );
        setCartData(response);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [cartSlugs]);

  const handleRemoveFromCart = useCallback((slug: string) => {
    const updatedCartSlugs = cartSlugs.filter((itemSlug) => itemSlug !== slug);
    setCartSlugs(updatedCartSlugs);
    setCartData((prev) => prev.filter((car) => car.slug !== slug));
    localStorage.setItem("cartSlugs", JSON.stringify(updatedCartSlugs));
  }, [cartSlugs]);

  const calculateDays = () => {
    try {
      const p1 = new Date(pickup.date);
      const p2 = new Date(dropoff.date);
      const diff = Math.max(1, Math.ceil((p2.getTime() - p1.getTime()) / (1000 * 60 * 60 * 24)));
      return diff;
    } catch {
      return 1;
    }
  };

  const subtotal = cartData.reduce((sum, car) => {
    const price = car.discount && car.discount < car.price ? car.discount : car.price;
    return sum + (typeof price === "number" && !isNaN(price) ? price : 0);
  }, 0);

  const days = calculateDays();
  const total = subtotal * days;
  const tax = Math.round(total * 0.1 * 100) / 100;
  const grandTotal = total + tax;

  const handleBookNow = async () => {
    if (!customerName || !customerPhone || !pickup.location || !pickup.date || !dropoff.location || !dropoff.date) {
      alert("Please fill in all required fields");
      return;
    }

    if (!isChecked) {
      alert("Please agree to the terms and conditions");
      return;
    }

    try {
      const rentalData = {
        carSlugs: cartSlugs,
        customerName,
        customerPhone,
        customerEmail,
        pickupLocation: pickup.location,
        pickupDate: pickup.date,
        pickupTime: pickup.time,
        dropoffLocation: dropoff.location,
        dropoffDate: dropoff.date,
        dropoffTime: dropoff.time,
        totalPrice: grandTotal,
        days,
        cars: cartData.map((car) => ({
          slug: car.slug,
          title: car.title,
          price: car.discount && car.discount < car.price ? car.discount : car.price,
        })),
      };

      // Save to localStorage for confirmation page
      localStorage.setItem("checkoutRental", JSON.stringify(rentalData));

      // Clear cart
      localStorage.removeItem("cartSlugs");
      setCartSlugs([]);
      setCartData([]);

      // Redirect to confirmation
      window.location.href = "/checkout/success";
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to process booking. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center text-2xl font-semibold min-h-[40vh] md:min-h-[70vh] uppercase">
        Loading...
      </div>
    );
  }

  if (cartData.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[40vh] md:min-h-[70vh] bg-[#F6F7F9]">
        <p className="text-xl sm:text-2xl font-semibold text-gray-400 mb-2">
          Your cart is empty.
        </p>
        <p className="text-sm sm:text-base text-gray-500 mb-4">
          Browse our cars and add your favorites!
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-[#3563E9] text-white rounded-lg font-semibold hover:bg-[#2A4EB8] transition"
        >
          Browse Cars
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-[#F6F7F9] w-full min-h-[40vh] md:min-h-[70vh]">
      <div className="lg:mx-10 md:mx-8 mx-5 py-10">
        <div className="flex flex-col lg:flex-row items-start gap-10">
          {/* Left: Forms */}
          <div className="order-2 lg:order-1 w-full space-y-10">
            {/* Step 1 Customer Info */}
            <div className="w-full h-auto bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center">
                <h1 className="text-[#1A202C] lg:text-[20px] md:text-[18px] text-[16px] font-bold">Customer Info</h1>
                <p className="lg:hidden text-[#90A3BF] text-[12px] lg:text-[14px] font-medium">Step 1 of 3</p>
              </div>
              <div className="flex justify-between items-center text-[#90A3BF] text-[12px] lg:text-[14px] font-medium">
                <p>Please enter your contact information</p>
                <p className="hidden lg:block text-[#90A3BF] text-[12px] lg:text-[14px] font-medium">Step 1 of 3</p>
              </div>
              <div className="md:grid md:grid-cols-2 items-start space-y-6 md:space-y-0 gap-4 md:gap-y-10 py-5">
                <div className="list-inside md:space-y-4 space-y-2">
                  <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div className="list-inside md:space-y-4 space-y-2">
                  <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="tel">Phone number</label>
                  <input
                    type="tel"
                    id="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none"
                    placeholder="Your number"
                  />
                </div>
                <div className="list-inside md:space-y-4 space-y-2">
                  <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="email">Email (optional)</label>
                  <input
                    type="email"
                    id="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none"
                    placeholder="Your email"
                  />
                </div>
              </div>
            </div>

            {/* Step 2 Rental Info */}
            <div className="w-full h-auto bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center">
                <h1 className="text-[#1A202C] lg:text-[20px] md:text-[18px] text-[16px] font-bold">Rental Info</h1>
                <p className="lg:hidden text-[#90A3BF] text-[12px] lg:text-[14px] font-medium">Step 2 of 3</p>
              </div>
              <div className="flex justify-between items-center text-[#90A3BF] text-[12px] lg:text-[14px] font-medium">
                <p>Please select your rental dates</p>
                <p className="hidden lg:block text-[#90A3BF] text-[12px] lg:text-[14px] font-medium">Step 2 of 3</p>
              </div>

              {/* Pick-Up */}
              <div className="flex gap-5 py-6">
                <input type="radio" id="pick" defaultChecked />
                <label htmlFor="pick" className="md:text-[16px] text-[14px] text-[#1A202C] font-semibold">Pick-Up</label>
              </div>

              <div className="md:grid md:grid-cols-2 items-start space-y-6 md:space-y-0 gap-4 md:gap-y-10">
                <div className="list-inside md:space-y-4 space-y-2">
                  <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="pickup-location">Location</label>
                  <div className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none">
                    <select
                      value={pickup.location}
                      onChange={(e) => setPickup({ ...pickup, location: e.target.value })}
                      className="bg-transparent outline-none border-none w-full"
                    >
                      {[
                        { value: "khi", label: "Karachi" },
                        { value: "hyd", label: "Hyderabad" },
                        { value: "lhr", label: "Lahore" },
                        { value: "qta", label: "Quetta" },
                        { value: "isb", label: "Islamabad" },
                      ].map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="list-inside md:space-y-4 space-y-2">
                  <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="pickup-date">Date</label>
                  <input
                    type="date"
                    id="pickup-date"
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

                {/* Swap Button */}
                <div className="list-inside md:space-y-4 space-y-2 w-full">
                  <div className="h-8" />
                  <div
                    onClick={handleSwap}
                    className="flex justify-center items-center w-full bg-[#3967ee] hover:bg-blue-700 rounded-lg h-12 md:text-[16px] text-[14px] text-white font-semibold cursor-pointer"
                  >
                    <Image src={swap} alt="swap" width={25} height={10} />
                  </div>
                </div>
              </div>

              {/* Drop-Off */}
              <div className="flex gap-5 py-6">
                <input type="radio" id="drop" />
                <label htmlFor="drop" className="md:text-[16px] text-[14px] text-[#1A202C] font-semibold">Drop-Off</label>
              </div>

              <div className="md:grid md:grid-cols-2 items-start space-y-6 md:space-y-0 gap-4 md:gap-y-10">
                <div className="list-inside md:space-y-4 space-y-2">
                  <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="dropoff-location">Location</label>
                  <div className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none">
                    <select
                      value={dropoff.location}
                      onChange={(e) => setDropoff({ ...dropoff, location: e.target.value })}
                      className="bg-transparent outline-none border-none w-full"
                    >
                      {[
                        { value: "khi", label: "Karachi" },
                        { value: "hyd", label: "Hyderabad" },
                        { value: "lhr", label: "Lahore" },
                        { value: "qta", label: "Quetta" },
                        { value: "isb", label: "Islamabad" },
                      ].map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="list-inside md:space-y-4 space-y-2">
                  <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="dropoff-date">Date</label>
                  <input
                    type="date"
                    id="dropoff-date"
                    className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none"
                    value={dropoff.date}
                    min={pickup.date || currentDate}
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
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="w-5 h-5 accent-[#3563E9]"
              />
              <label htmlFor="terms" className="text-[#1A202C] text-[14px] font-medium">
                I agree to the <Link href="/terms" className="text-[#3563E9] underline">Terms and Conditions</Link>
              </label>
            </div>

            {/* Book Now Button */}
            <button
              onClick={handleBookNow}
              disabled={!isChecked}
              className="w-full py-4 bg-[#3563E9] text-white text-[16px] font-bold rounded-lg hover:bg-[#2A4EB8] disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              Book Now - ${grandTotal.toFixed(2)}
            </button>
          </div>

          {/* Right: Order Summary */}
          <div className="order-1 lg:order-2 w-full lg:w-[400px] flex-shrink-0">
            <div className="w-full bg-white rounded-lg shadow-md p-4 sticky top-10">
              <h1 className="text-[#1A202C] text-[18px] font-bold mb-4">Order Summary</h1>

              {/* Car List */}
              <div className="space-y-4 pb-4 border-b">
                {cartData.map((car) => {
                  const price = car.discount && car.discount < car.price ? car.discount : car.price;
                  return (
                    <div key={car._id} className="flex gap-3 items-center">
                      <div className="w-20 h-20 bg-[#F6F7F9] rounded-lg flex items-center justify-center flex-shrink-0 p-2">
                        {car.image && (
                          <Image
                            src={urlFor(car.image).url()}
                            alt={car.title}
                            width={60}
                            height={60}
                            className="object-contain"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[#1A202C] text-[14px] font-bold truncate">{car.title}</h3>
                        <p className="text-[#90A3BF] text-[12px] font-medium">{car.category}</p>
                        <p className="text-[#3563E9] text-[13px] font-bold">${price}/day</p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(car.slug)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 space-y-3">
                <div className="flex justify-between text-[14px]">
                  <span className="text-[#90A3BF]">Cars Total ({cartData.length} car{cartData.length > 1 ? "s" : ""} × {days} day{days > 1 ? "s" : ""})</span>
                  <span className="text-[#1A202C] font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-[#90A3BF]">Tax (10%)</span>
                  <span className="text-[#1A202C] font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[16px] border-t pt-3">
                  <span className="text-[#1A202C] font-bold">Grand Total</span>
                  <span className="text-[#3563E9] font-bold">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
