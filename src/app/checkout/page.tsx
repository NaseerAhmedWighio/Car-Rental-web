"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  const [isChecked, setIsChecked] = useState(false);

  // Date Setup
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

  // --- RE-CALCULATION LOGIC (Instant Updates) ---
  const totals = useMemo(() => {
    const p1 = new Date(pickup.date);
    const p2 = new Date(dropoff.date);
    const diffDays = Math.max(1, Math.ceil((p2.getTime() - p1.getTime()) / (1000 * 60 * 60 * 24)));

    const subtotal = cartData.reduce((sum, car) => {
      const price = Number(car.discount && car.discount < car.price ? car.discount : car.price) || 0;
      return sum + price;
    }, 0);

    const total = subtotal * diffDays;
    const tax = Math.round(total * 0.1 * 100) / 100;
    const grandTotal = total + tax;

    return { diffDays, total, tax, grandTotal };
  }, [pickup.date, dropoff.date, cartData]);

  // Load cart
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
            _id, "slug": slug.current, title, category, image, fuel, type, capacity, price, discount
          }`, { slugs: cartSlugs }
        );
        setCartData(response);
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

  const handleSwap = () => {
    setPickup((prev) => ({ ...prev, location: dropoff.location }));
    setDropoff((prev) => ({ ...prev, location: pickup.location }));
  };

  const handleBookNow = async () => {
    if (!customerName || !customerPhone || !pickup.location || !pickup.date) {
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
        totalPrice: totals.grandTotal,
        days: totals.diffDays,
        cars: cartData.map((car) => ({
          slug: car.slug,
          title: car.title,
          price: Number(car.discount || car.price),
        })),
      };

      localStorage.setItem("checkoutRental", JSON.stringify(rentalData));
      localStorage.removeItem("cartSlugs");
      window.location.href = "/checkout/success";
    } catch (error) {
      alert("Failed to process booking.");
    }
  };

  if (loading) return <div className="flex justify-center items-center text-2xl font-semibold min-h-[70vh] uppercase">Loading...</div>;

  if (cartData.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] bg-[#F6F7F9]">
        <p className="text-2xl font-semibold text-gray-400 mb-2">Your cart is empty.</p>
        <Link href="/" className="px-6 py-3 bg-[#3563E9] text-white rounded-lg font-semibold">Browse Cars</Link>
      </div>
    );
  }

  return (
    <main className="bg-[#F6F7F9] w-full min-h-[70vh]">
      <div className="lg:mx-10 md:mx-8 mx-5 py-10">
        <div className="flex flex-col lg:flex-row items-start gap-10">
          
          {/* Left: Forms */}
          <div className="order-2 lg:order-1 w-full space-y-10">
            
            {/* Step 1 Customer Info */}
            <div className="w-full bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center">
                <h1 className="text-[#1A202C] text-[18px] font-bold">Customer Info</h1>
                <p className="text-[#90A3BF] text-[14px] font-medium">Step 1 of 3</p>
              </div>
              <p className="text-[#90A3BF] text-[14px] mb-6">Please enter your contact information</p>
              <div className="md:grid md:grid-cols-2 gap-4 md:gap-y-10">
                <div className="space-y-2">
                  <label className="text-[#1A202C] font-semibold">Name</label>
                  <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <label className="text-[#1A202C] font-semibold">Phone number</label>
                  <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none" placeholder="Your number" />
                </div>
                <div className="space-y-2">
                  <label className="text-[#1A202C] font-semibold">Email (optional)</label>
                  <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none" placeholder="Your email" />
                </div>
              </div>
            </div>

            {/* Step 2 Rental Info */}
            <div className="w-full bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center">
                <h1 className="text-[#1A202C] text-[18px] font-bold">Rental Info</h1>
                <p className="text-[#90A3BF] text-[14px] font-medium">Step 2 of 3</p>
              </div>
              <p className="text-[#90A3BF] text-[14px] mb-4">Please select your rental dates</p>

              <div className="flex gap-2 items-center py-4">
                <div className="w-4 h-4 rounded-full border-4 border-[#3563E9] bg-white"></div>
                <label className="text-[#1A202C] font-semibold">Pick-Up</label>
              </div>

              <div className="md:grid md:grid-cols-2 gap-4 md:gap-y-6">
                <div className="space-y-2">
                  <label className="text-[#1A202C] font-semibold">Location</label>
                  <select value={pickup.location} onChange={(e) => setPickup({ ...pickup, location: e.target.value })} className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none">
                    <option value="khi">Karachi</option>
                    <option value="hyd">Hyderabad</option>
                    <option value="lhr">Lahore</option>
                    <option value="isb">Islamabad</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[#1A202C] font-semibold">Date</label>
                  <input type="date" value={pickup.date} min={currentDate} onChange={(e) => setPickup({ ...pickup, date: e.target.value })} className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[#1A202C] font-semibold">Time</label>
                  <input type="time" value={pickup.time} onChange={(e) => setPickup({ ...pickup, time: e.target.value })} className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none" />
                </div>
                
                <div className="flex items-end">
                   <button onClick={handleSwap} className="flex justify-center items-center w-full bg-[#3563E9] hover:bg-blue-700 rounded-lg h-12 text-white font-semibold transition">
                     <Image src={swap} alt="swap" width={25} height={10} />
                   </button>
                </div>
              </div>

              <div className="flex gap-2 items-center py-6">
                <div className="w-4 h-4 rounded-full border-4 border-[#5CAFF3] bg-white"></div>
                <label className="text-[#1A202C] font-semibold">Drop-Off</label>
              </div>

              <div className="md:grid md:grid-cols-2 gap-4 md:gap-y-6">
                <div className="space-y-2">
                  <label className="text-[#1A202C] font-semibold">Location</label>
                  <select value={dropoff.location} onChange={(e) => setDropoff({ ...dropoff, location: e.target.value })} className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none">
                    <option value="khi">Karachi</option>
                    <option value="hyd">Hyderabad</option>
                    <option value="lhr">Lahore</option>
                    <option value="isb">Islamabad</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[#1A202C] font-semibold">Date</label>
                  <input type="date" value={dropoff.date} min={pickup.date} onChange={(e) => setDropoff({ ...dropoff, date: e.target.value })} className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[#1A202C] font-semibold">Time</label>
                  <input type="time" value={dropoff.time} onChange={(e) => setDropoff({ ...dropoff, time: e.target.value })} className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none" />
                </div>
              </div>
            </div>

            {/* Step 3: Terms & Button */}
            <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-[#1A202C] text-[18px] font-bold">Confirmation</h1>
                <p className="text-[#90A3BF] text-[14px] font-medium">Step 3 of 3</p>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="terms" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} className="w-5 h-5 accent-[#3563E9]" />
                <label htmlFor="terms" className="text-[#1A202C] text-[14px] font-medium">I agree to the Terms and Conditions</label>
              </div>
              <button onClick={handleBookNow} disabled={!isChecked} className="w-full py-4 bg-[#3563E9] text-white text-[16px] font-bold rounded-lg hover:bg-[#2A4EB8] disabled:bg-gray-400 transition">
                Book Now - ${Number(totals.grandTotal).toFixed(2)}
              </button>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="order-1 lg:order-2 w-full lg:w-[400px] flex-shrink-0">
            <div className="w-full bg-white rounded-lg shadow-md p-4 sticky top-10">
              <h1 className="text-[#1A202C] text-[18px] font-bold mb-4">Order Summary</h1>
              <div className="space-y-4 pb-4 border-b">
                {cartData.map((car) => {
                  const carPrice = Number(car.discount && car.discount < car.price ? car.discount : car.price) || 0;
                  return (
                    <div key={car._id} className="flex gap-3 items-center">
                      <div className="w-20 h-16 bg-[#F6F7F9] rounded-lg flex items-center justify-center p-2">
                        {car.image && <Image src={urlFor(car.image).url()} alt={car.title} width={60} height={40} className="object-contain" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[#1A202C] text-[14px] font-bold truncate">{car.title}</h3>
                        <p className="text-[#90A3BF] text-[12px] font-medium">${carPrice.toFixed(2)} × {totals.diffDays} days</p>
                      </div>
                      <button onClick={() => handleRemoveFromCart(car.slug)} className="text-red-500 hover:text-red-700 p-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 space-y-3">
                <div className="flex justify-between text-[14px]">
                  <span className="text-[#90A3BF]">Subtotal</span>
                  <span className="text-[#1A202C] font-semibold">${totals.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-[#90A3BF]">Tax (10%)</span>
                  <span className="text-[#1A202C] font-semibold">${totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[16px] border-t pt-3">
                  <span className="text-[#1A202C] font-bold">Grand Total</span>
                  <span className="text-[#3563E9] font-bold">${totals.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}