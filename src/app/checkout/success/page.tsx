"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CheckoutSuccess() {
  const [rentalData, setRentalData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("checkoutRental");
    if (stored) {
      setRentalData(JSON.parse(stored));
      localStorage.removeItem("checkoutRental");
    }
  }, []);

  if (!rentalData) {
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
          <p className="text-[#90A3BF] text-[16px] mb-8">
            Thank you <strong>{rentalData.customerName}</strong>! Your rental has been booked successfully.
          </p>

          <div className="bg-[#F6F7F9] rounded-lg p-6 text-left space-y-4">
            <h2 className="text-[#1A202C] text-[18px] font-bold">Booking Details</h2>

            <div className="space-y-2">
              <h3 className="text-[#90A3BF] text-[14px] font-medium">Cars Booked:</h3>
              {rentalData.cars.map((car: any, i: number) => (
                <div key={i} className="flex justify-between">
                  <span className="text-[#1A202C] text-[14px]">{car.title}</span>
                  <span className="text-[#1A202C] text-[14px] font-semibold">${car.price}/day</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#90A3BF] text-[14px]">Pickup</span>
                <span className="text-[#1A202C] text-[14px]">{rentalData.pickupLocation} - {rentalData.pickupDate} at {rentalData.pickupTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#90A3BF] text-[14px]">Dropoff</span>
                <span className="text-[#1A202C] text-[14px]">{rentalData.dropoffLocation} - {rentalData.dropoffDate} at {rentalData.dropoffTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#90A3BF] text-[14px]">Duration</span>
                <span className="text-[#1A202C] text-[14px]">{rentalData.days} day(s)</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span className="text-[#1A202C] text-[18px] font-bold">Total Paid</span>
                <span className="text-[#3563E9] text-[18px] font-bold">${rentalData.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-[#3563E9] text-white text-[16px] font-bold rounded-lg hover:bg-[#2A4EB8] transition"
            >
              Browse More Cars
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
