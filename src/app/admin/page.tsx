"use client"

import Image from "next/image"
import Dashboard from "../Components/Dashboard";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Rental {
  _id: string;
  carTitle: string;
  carSlug: string;
  customerName: string;
  customerPhone: string;
  totalPrice: number;
  status: string;
  rentalId: string;
  rentedAt: string;
}

interface Car {
  _id: string;
  slug: string;
  title: string;
  category: string;
  image: string;
  price: number;
}

export default function Admin() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [recentCars, setRecentCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRentals: 0,
    totalRevenue: 0,
    activeRentals: 0,
    completedRentals: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const rentalsQuery = `*[_type == "rental"] | order(rentedAt desc)[0...20] {
          _id,
          carTitle,
          carSlug,
          customerName,
          customerPhone,
          totalPrice,
          status,
          rentalId,
          rentedAt
        }`;

        const carsQuery = `*[_type in ["popular", "recommended"]] | order(_createdAt desc)[0...6] {
          _id,
          "slug": slug.current,
          title,
          category,
          image,
          price
        }`;

        const [rentalData, carsData] = await Promise.all([
          client.fetch(rentalsQuery),
          client.fetch(carsQuery)
        ]);

        setRentals(rentalData);
        setRecentCars(carsData);

        const total = rentalData.length;
        const revenue = rentalData.reduce((sum: number, r: Rental) => sum + (Number(r.totalPrice) || 0), 0);
        const active = rentalData.filter((r: Rental) => r.status === "active").length;
        const completed = rentalData.filter((r: Rental) => r.status === "completed").length;

        setStats({
          totalRentals: total,
          totalRevenue: revenue,
          activeRentals: active,
          completedRentals: completed,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryData = () => {
    const categoryCount: Record<string, { count: number; revenue: number }> = {};

    rentals.forEach((rental) => {
      const cat = rental.carTitle || "Unknown";
      if (!categoryCount[cat]) {
        categoryCount[cat] = { count: 0, revenue: 0 };
      }
      categoryCount[cat].count++;
      categoryCount[cat].revenue += Number(rental.totalPrice) || 0;
    });

    const sorted = Object.entries(categoryCount)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 6);

    return {
      labels: sorted.map(([cat]) => cat),
      datasets: [{
        label: "Revenue ($)",
        data: sorted.map(([, data]) => data.revenue),
        backgroundColor: ["#3563E9", "#22c55e", "#eab308", "#ef4444", "#8b5cf6", "#ec4899"],
      }],
    };
  };

  const getMonthlyRevenue = () => {
    const months: Record<string, number> = {};
    const last6Months = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const monthName = date.toLocaleString("default", { month: "short" });
      last6Months.push({ key: monthKey, name: monthName });
      months[monthKey] = 0;
    }

    rentals.forEach((rental) => {
      const date = new Date(rental.rentedAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (months[monthKey] !== undefined) {
        months[monthKey] += Number(rental.totalPrice) || 0;
      }
    });

    return {
      labels: last6Months.map((m) => m.name),
      datasets: [{
        label: "Revenue ($)",
        data: last6Months.map((m) => months[m.key]),
        borderColor: "#3563E9",
        backgroundColor: "rgba(53, 99, 233, 0.2)",
        tension: 0.4,
        fill: true,
      }],
    };
  };

  const getStatusData = () => ({
    labels: ["Active", "Completed", "Pending"],
    datasets: [{
      data: [stats.activeRentals, stats.completedRentals, stats.totalRentals - stats.activeRentals - stats.completedRentals],
      backgroundColor: ["#3563E9", "#22c55e", "#eab308"],
    }],
  });

  if (loading) {
    return (
      <main className="w-full h-auto bg-[#F6F7F9]">
        <div className="flex">
          <div className="hidden xl:block xl:w-1/4 xl:min-h-screen bg-white p-10">
            <Dashboard />
          </div>
          <div className="w-full flex items-center justify-center min-h-[50vh]">
            <p className="text-[#3563E9] text-xl font-semibold">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full h-auto bg-[#F6F7F9]">
      <div className="flex">
        <div className="hidden xl:block xl:w-1/4 xl:min-h-screen bg-white p-10">
          <Dashboard />
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8">
          <h1 className="text-[#1A202C] text-2xl sm:text-3xl font-bold mb-6">Admin Dashboard</h1>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <p className="text-[#90A3BF] text-sm">Total Rentals</p>
              <p className="text-[#1A202C] text-2xl sm:text-3xl font-bold">{stats.totalRentals}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <p className="text-[#90A3BF] text-sm">Revenue</p>
              <p className="text-[#1A202C] text-2xl sm:text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <p className="text-[#90A3BF] text-sm">Active</p>
              <p className="text-[#3563E9] text-2xl sm:text-3xl font-bold">{stats.activeRentals}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <p className="text-[#90A3BF] text-sm">Completed</p>
              <p className="text-[#22c55e] text-2xl sm:text-3xl font-bold">{stats.completedRentals}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-[#1A202C] text-lg font-bold mb-4">Revenue Trend</h2>
              <div className="h-[250px]">
                <Line data={getMonthlyRevenue()} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-[#1A202C] text-lg font-bold mb-4">Rental Status</h2>
              <div className="h-[250px] flex items-center justify-center">
                <Doughnut data={getStatusData()} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
            <h2 className="text-[#1A202C] text-lg font-bold mb-4">Category Revenue</h2>
            <div className="h-[300px]">
              <Bar data={getCategoryData()} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
            <h2 className="text-[#1A202C] text-lg font-bold mb-4">Recent Rentals</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 text-[#90A3BF]">Rental ID</th>
                    <th className="text-left py-2 px-2 text-[#90A3BF]">Customer</th>
                    <th className="text-left py-2 px-2 text-[#90A3BF]">Car</th>
                    <th className="text-left py-2 px-2 text-[#90A3BF]">Price</th>
                    <th className="text-left py-2 px-2 text-[#90A3BF]">Status</th>
                    <th className="text-left py-2 px-2 text-[#90A3BF]">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rentals.slice(0, 10).map((rental) => (
                    <tr key={rental._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-2 text-[#3563E9]">{rental.rentalId?.slice(0, 12)}</td>
                      <td className="py-2 px-2">{rental.customerName}</td>
                      <td className="py-2 px-2">{rental.carTitle}</td>
                      <td className="py-2 px-2 font-semibold">${rental.totalPrice}</td>
                      <td className="py-2 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          rental.status === "active" ? "bg-blue-100 text-blue-600" :
                          rental.status === "completed" ? "bg-green-100 text-green-600" :
                          "bg-yellow-100 text-yellow-600"
                        }`}>
                          {rental.status}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-[#90A3BF]">
                        {new Date(rental.rentedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-[#1A202C] text-lg font-bold mb-4">Recent Cars</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {recentCars.map((car) => (
                <div key={car._id} className="text-center">
                  <div className="w-full h-20 mb-2 flex items-center justify-center">
                    <Image
                      src={car.image ? urlFor(car.image).url() : "/fallback-image.jpg"}
                      alt={car.title}
                      width={80}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                  <p className="text-xs text-[#1A202C] font-medium truncate">{car.title}</p>
                  <p className="text-xs text-[#3563E9]">${car.price}/day</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}