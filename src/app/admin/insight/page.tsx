"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import Dashboard from "../../Components/Dashboard";
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
  rentedAt: string;
}

export default function InsightPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRentals: 0,
    totalRevenue: 0,
    activeRentals: 0,
    completedRentals: 0,
  });

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const query = `*[_type == "rental"] | order(rentedAt desc)[0...50] {
          _id,
          carTitle,
          carSlug,
          customerName,
          customerPhone,
          totalPrice,
          status,
          rentedAt
        }`;
        const data = await client.fetch(query);
        setRentals(data);

        const total = data.length;
        const revenue = data.reduce((sum: number, r: Rental) => sum + (r.totalPrice || 0), 0);
        const active = data.filter((r: Rental) => r.status === "active").length;
        const completed = data.filter((r: Rental) => r.status === "completed").length;

        setStats({
          totalRentals: total,
          totalRevenue: revenue,
          activeRentals: active,
          completedRentals: completed,
        });
      } catch (error) {
        console.error("Error fetching rentals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

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
        months[monthKey] += rental.totalPrice || 0;
      }
    });

    return {
      labels: last6Months.map((m) => m.name),
      datasets: [
        {
          label: "Revenue ($)",
          data: last6Months.map((m) => months[m.key]),
          borderColor: "#3563E9",
          backgroundColor: "rgba(53, 99, 233, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  const getStatusData = () => {
    const statusCount: Record<string, number> = {
      active: 0,
      completed: 0,
      pending: 0,
      cancelled: 0,
    };

    rentals.forEach((rental) => {
      const status = rental.status || "pending";
      if (statusCount[status] !== undefined) {
        statusCount[status]++;
      }
    });

    return {
      labels: ["Active", "Completed", "Pending", "Cancelled"],
      datasets: [
        {
          data: [statusCount.active, statusCount.completed, statusCount.pending, statusCount.cancelled],
          backgroundColor: ["#3563E9", "#22c55e", "#eab308", "#ef4444"],
        },
      ],
    };
  };

  const getTopCarsData = () => {
    const carCount: Record<string, number> = {};

    rentals.forEach((rental) => {
      const car = rental.carTitle || "Unknown";
      carCount[car] = (carCount[car] || 0) + 1;
    });

    const sorted = Object.entries(carCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      labels: sorted.map(([car]) => car),
      datasets: [
        {
          label: "Rentals",
          data: sorted.map(([, count]) => count),
          backgroundColor: "#3563E9",
        },
      ],
    };
  };

  if (loading) {
    return (
      <main className="w-full h-auto bg-[#F6F7F9]">
        <div className="flex">
          <div className="hidden xl:block xl:w-1/4 xl:min-h-screen bg-white p-6 lg:p-8 xl:p-10">
            <Dashboard />
          </div>
          <div className="w-full px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8 flex items-center justify-center min-h-[50vh]">
            <p className="text-[#3563E9] text-xl font-semibold">Loading analytics...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full h-auto bg-[#F6F7F9]">
      <div className="flex">
        <div className="hidden xl:block xl:w-1/4 xl:min-h-screen bg-white p-6 lg:p-8 xl:p-10">
          <Dashboard />
        </div>
        <div className="w-full px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-[#1A202C] text-[20px] sm:text-[24px] font-bold mb-2">Insights</h1>
            <p className="text-[#90A3BF] text-[14px] sm:text-[16px]">Analytics and performance overview</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <p className="text-[#90A3BF] text-[12px] sm:text-[14px]">Total Rentals</p>
              <p className="text-[#1A202C] text-[24px] sm:text-[28px] font-bold">{stats.totalRentals}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <p className="text-[#90A3BF] text-[12px] sm:text-[14px]">Revenue</p>
              <p className="text-[#1A202C] text-[24px] sm:text-[28px] font-bold">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <p className="text-[#90A3BF] text-[12px] sm:text-[14px]">Active</p>
              <p className="text-[#3563E9] text-[24px] sm:text-[28px] font-bold">{stats.activeRentals}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <p className="text-[#90A3BF] text-[12px] sm:text-[14px]">Completed</p>
              <p className="text-[#22c55e] text-[24px] sm:text-[28px] font-bold">{stats.completedRentals}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-[#1A202C] text-[16px] sm:text-[18px] font-bold mb-4">Revenue Trend</h2>
              <div className="h-[250px]">
                <Line data={getMonthlyRevenue()} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-[#1A202C] text-[16px] sm:text-[18px] font-bold mb-4">Rental Status</h2>
              <div className="h-[250px] flex items-center justify-center">
                <Doughnut data={getStatusData()} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-[#1A202C] text-[16px] sm:text-[18px] font-bold mb-4">Top Rented Cars</h2>
            <div className="h-[300px]">
              <Bar data={getTopCarsData()} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}