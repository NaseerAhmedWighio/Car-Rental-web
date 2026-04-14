"use client";

import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { TrackingData } from "../../../type";

function TrackShipment() {
  const [labelId, setLabelId] = useState("");
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const queryLabelId = searchParams?.get("labelId") || "";

  useEffect(() => {
    if (queryLabelId) {
      setLabelId(queryLabelId);
      handleSubmit(queryLabelId);
    }
  }, [queryLabelId]);

const handleSubmit = async (labelId: string) => {
  if (!labelId) {
    setError("Label ID is required.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const response = await axios.get(`/api/shipengine/tracking/${labelId}`);
    setTrackingData(response.data);
    router.replace(`/tracking?labelId=${labelId}`);
  } catch (err) {
    console.error("Error tracking shipment:", err);
    setError("Failed to track shipment. Please check the label ID and try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-[40vh] md:min-h-[70vh] bg-gray-100 py-6 sm:py-8 lg:py-12 text-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Track Your Shipment</h1>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(labelId);
            }}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-md"
          >
            <div className="flex flex-col space-y-4">
              <label htmlFor="labelId" className="text-base sm:text-lg font-medium">
                Enter Label ID or Tracking Number:
              </label>
              <input
                type="text"
                id="labelId"
                value={labelId}
                onChange={(e) => setLabelId(e.target.value)}
                className="p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Enter label ID"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300 text-sm sm:text-base font-medium"
              >
                {loading ? "Tracking..." : "Track Shipment"}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm sm:text-base">
              {error}
            </div>
          )}

          {/* Tracking Details */}
          {trackingData && (
            <div className="mt-6 sm:mt-8 bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Tracking Details</h2>
              <div className="space-y-3 sm:space-y-4">
                <p className="text-sm sm:text-base">
                  <span className="font-semibold">Tracking Number:</span>{" "}
                  {trackingData.trackingNumber}
                </p>
                <p className="text-sm sm:text-base">
                  <span className="font-semibold">Status:</span>{" "}
                  {trackingData.statusDescription}
                </p>
                <p className="text-sm sm:text-base">
                  <span className="font-semibold">Carrier Status:</span>{" "}
                  {trackingData.carrierStatusDescription || "N/A"}
                </p>
                <p className="text-sm sm:text-base">
                  <span className="font-semibold">Estimated Delivery:</span>{" "}
                  {trackingData.estimatedDeliveryDate || "N/A"}
                </p>
                <p className="text-sm sm:text-base">
                  <span className="font-semibold">Actual Delivery:</span>{" "}
                  {trackingData.actualDeliveryDate || "N/A"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}

export default function TrackingPage (){
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[40vh] md:min-h-[70vh] text-xl">Loading...</div>}>
      <TrackShipment />
    </Suspense>
  );
}
