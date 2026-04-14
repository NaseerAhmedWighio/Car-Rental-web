"use client"

import Dashboard from "../../Components/Dashboard";

export default function CarRentPage() {
    return (
        <main className="w-full h-auto bg-[#F6F7F9]">
            <div className="flex">
                <div className="hidden xl:block xl:w-1/4 xl:min-h-screen bg-white p-6 lg:p-8 xl:p-10">
                    <Dashboard />
                </div>
                <div className="w-full px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h1 className="text-[#1A202C] text-[20px] sm:text-[24px] font-bold mb-4">Car Rent</h1>
                        <p className="text-[#90A3BF] text-[14px] sm:text-[16px]">Manage car rentals and view all active bookings.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
