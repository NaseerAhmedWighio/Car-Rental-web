"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  
  const rentalId = searchParams.get("rentalId");
  const name = searchParams.get("name");
  const phone = searchParams.get("phone");
  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const pickupTime = searchParams.get("pickupTime");
  const dropoffLocation = searchParams.get("dropoffLocation");
  const dropoffDate = searchParams.get("dropoffDate");
  const dropoffTime = searchParams.get("dropoffTime");
  const totalPrice = searchParams.get("totalPrice");

  const cityNames: Record<string, string> = {
    khi: "Karachi",
    hyd: "Hyderabad", 
    lhr: "Lahore",
    qta: "Quetta",
    isb: "Islamabad",
    nbs: "Nawabshah",
    Karachi: "Karachi",
    Lahore: "Lahore",
    Islamabad: "Islamabad",
    Quetta: "Quetta",
    Hyderabad: "Hyderabad",
  };

  const formatCity = (city: string | null) => {
    if (!city) return "-";
    return cityNames[city] || city.toUpperCase();
  };

  if (!rentalId) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[40vh] md:min-h-[70vh] bg-[#F6F7F9]">
        <p className="text-xl font-semibold text-gray-400 mb-2">No booking found</p>
        <Link href="/" className="px-6 py-3 bg-[#3563E9] text-white rounded-lg font-semibold hover:bg-[#2A4EB8]">
          Browse Cars
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-[#F6F7F9] w-full min-h-[40vh] md:min-h-[70vh]">
      <div className="max-w-2xl mx-auto py-20 px-5">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-green-600">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="text-[#1A202C] text-[28px] font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-[#90A3BF] text-[16px] mb-2">
            Thank you <strong>{name}</strong>! Your rental has been booked successfully.
          </p>
          <p className="text-[#3563E9] text-[18px] font-semibold mb-8">
            Rental ID: {rentalId}
          </p>

          <div className="bg-[#F6F7F9] rounded-lg p-6 text-left space-y-4">
            <h2 className="text-[#1A202C] text-[18px] font-bold">Customer Details</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[#90A3BF] text-sm">Name</p>
                <p className="text-[#1A202C] font-semibold">{name}</p>
              </div>
              <div>
                <p className="text-[#90A3BF] text-sm">Phone</p>
                <p className="text-[#1A202C] font-semibold">{phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#F6F7F9] rounded-lg p-6 text-left space-y-4 mt-6">
            <h2 className="text-[#1A202C] text-[18px] font-bold">Rental Details</h2>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#90A3BF] text-[14px]">Pickup Location</span>
                <span className="text-[#1A202C] text-[14px] font-semibold">{formatCity(pickupLocation)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#90A3BF] text-[14px]">Pickup Date & Time</span>
                <span className="text-[#1A202C] text-[14px]">{pickupDate} at {pickupTime}</span>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#90A3BF] text-[14px]">Dropoff Location</span>
                <span className="text-[#1A202C] text-[14px] font-semibold">{formatCity(dropoffLocation)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#90A3BF] text-[14px]">Dropoff Date & Time</span>
                <span className="text-[#1A202C] text-[14px]">{dropoffDate} at {dropoffTime}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span className="text-[#1A202C] text-[18px] font-bold">Total Paid</span>
                <span className="text-[#3563E9] text-[18px] font-bold">${parseFloat(totalPrice || "0").toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-[#3563E9] text-white text-[16px] font-bold rounded-lg hover:bg-[#2A4EB8] transition"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={<div className="text-center text-2xl font-semibold min-h-[40vh] flex justify-center items-center">Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}