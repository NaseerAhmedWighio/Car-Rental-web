"use client";

import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { motion } from "framer-motion";

interface Car {
  _id: string;
  title: string;
  slug: string;
  category: string;
  image: string;
  price: number;
  discount?: number;
  fuel: string;
  type: string;
  capacity: string;
}

interface RentalFormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffLocation: string;
  dropoffDate: string;
  dropoffTime: string;
  selectedCarId: string;
}

export default function RentalForm() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(1);

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [formData, setFormData] = useState<RentalFormData>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    pickupLocation: "khi",
    pickupDate: today,
    pickupTime: "10:00",
    dropoffLocation: "hyd",
    dropoffDate: tomorrow,
    dropoffTime: "10:00",
    selectedCarId: "",
  });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const query = `*[_type in ["popular", "recommended"]] {
          _id,
          title,
          "slug": slug.current,
          category,
          image,
          price,
          discount,
          fuel,
          type,
          capacity
        }`;
        const data = await client.fetch(query);
        setCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };
    fetchCars();
  }, []);

  const selectedCar = cars.find(c => c._id === formData.selectedCarId);

  const calculateDays = () => {
    const start = new Date(formData.pickupDate);
    const end = new Date(formData.dropoffDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const calculateTotal = () => {
    if (!selectedCar) return 0;
    const days = calculateDays();
    const basePrice = parseInt(String(selectedCar.price)) * days;
    const discount = parseInt(String(selectedCar.discount)) || 0;
    return basePrice - discount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const rentalId = `RNT-${Date.now().toString(36).toUpperCase()}`;

      await client.create({
        _type: "rental",
        carTitle: selectedCar?.title,
        carSlug: selectedCar?.slug,
        category: selectedCar?.category,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        pickupLocation: formData.pickupLocation,
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        dropoffLocation: formData.dropoffLocation,
        dropoffDate: formData.dropoffDate,
        dropoffTime: formData.dropoffTime,
        totalPrice: calculateTotal(),
        status: "pending",
        rentalId,
        carImage: selectedCar?.image,
        rentedAt: new Date().toISOString(),
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setStep(1);
        setShowForm(false);
        setFormData({
          customerName: "",
          customerPhone: "",
          customerEmail: "",
          pickupLocation: "khi",
          pickupDate: today,
          pickupTime: "10:00",
          dropoffLocation: "hyd",
          dropoffDate: tomorrow,
          dropoffTime: "10:00",
          selectedCarId: "",
        });
      }, 3000);
    } catch (error) {
      console.error("Error creating rental:", error);
      alert("Failed to create rental. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cities = [
    { value: "khi", label: "Karachi" },
    { value: "hyd", label: "Hyderabad" },
    { value: "lhr", label: "Lahore" },
    { value: "qta", label: "Quetta" },
    { value: "isb", label: "Islamabad" },
    { value: "nbs", label: "Nawabshah" },
  ];

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full h-auto bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#1A202C]">Rental Created Successfully!</h2>
        <p className="text-[#90A3BF] text-sm mt-2">The rental has been added to your dashboard.</p>
      </motion.div>
    );
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full h-auto bg-gradient-to-r from-[#3563E9] to-[#2851c7] rounded-lg shadow-md p-6 text-white hover:shadow-lg transition-all group"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">New Car Rental</h2>
            <p className="text-sm text-blue-200 mt-1">Create a new rental booking</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="w-full h-auto bg-white rounded-lg shadow-md p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[#1A202C] text-[18px] sm:text-[20px] font-bold">New Car Rental</h1>
          <p className="text-[#90A3BF] text-sm mt-1">Step {step} of 3</p>
        </div>
        <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map(s => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-[#3563E9]" : "bg-gray-200"}`}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Select Car */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-[16px] font-semibold text-[#1A202C]">Select a Car</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
              {cars.map(car => (
                <div
                  key={car._id}
                  onClick={() => {
                    setFormData({ ...formData, selectedCarId: car._id });
                    setStep(2);
                  }}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                    formData.selectedCarId === car._id
                      ? "border-[#3563E9] bg-blue-50"
                      : "border-gray-100 bg-gray-50"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="w-20 h-14 bg-[#F6F7F9] rounded-md flex items-center justify-center flex-shrink-0">
                      {car.image && (
                        <Image
                          src={urlFor(car.image).url()}
                          alt={car.title}
                          width={80}
                          height={56}
                          className="object-contain"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[14px] text-[#1A202C]">{car.title}</h3>
                      <p className="text-xs text-[#90A3BF]">{car.category}</p>
                      <p className="text-[14px] font-bold text-[#3563E9] mt-1">${car.price}/day</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Customer Info & Location */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-[16px] font-semibold text-[#1A202C]">Customer Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[14px] font-semibold text-[#1A202C] block mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                  className="bg-[#F6F7F9] px-4 w-full h-11 rounded-lg outline-none text-sm"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="text-[14px] font-semibold text-[#1A202C] block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="bg-[#F6F7F9] px-4 w-full h-11 rounded-lg outline-none text-sm"
                  placeholder="+92 300 1234567"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[14px] font-semibold text-[#1A202C] block mb-1">Email</label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="bg-[#F6F7F9] px-4 w-full h-11 rounded-lg outline-none text-sm"
                  placeholder="customer@email.com"
                  required
                />
              </div>
            </div>

            <h2 className="text-[16px] font-semibold text-[#1A202C] pt-2">Rental Locations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[14px] font-semibold text-[#1A202C] block mb-1">Pickup Location</label>
                <select
                  value={formData.pickupLocation}
                  onChange={e => setFormData({ ...formData, pickupLocation: e.target.value })}
                  className="bg-[#F6F7F9] px-4 w-full h-11 rounded-lg outline-none text-sm"
                  required
                >
                  {cities.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[14px] font-semibold text-[#1A202C] block mb-1">Drop-off Location</label>
                <select
                  value={formData.dropoffLocation}
                  onChange={e => setFormData({ ...formData, dropoffLocation: e.target.value })}
                  className="bg-[#F6F7F9] px-4 w-full h-11 rounded-lg outline-none text-sm"
                  required
                >
                  {cities.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[14px] font-semibold text-[#1A202C] block mb-1">Pickup Date</label>
                <input
                  type="date"
                  value={formData.pickupDate}
                  min={today}
                  onChange={e => setFormData({ ...formData, pickupDate: e.target.value })}
                  className="bg-[#F6F7F9] px-4 w-full h-11 rounded-lg outline-none text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-[14px] font-semibold text-[#1A202C] block mb-1">Pickup Time</label>
                <input
                  type="time"
                  value={formData.pickupTime}
                  onChange={e => setFormData({ ...formData, pickupTime: e.target.value })}
                  className="bg-[#F6F7F9] px-4 w-full h-11 rounded-lg outline-none text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-[14px] font-semibold text-[#1A202C] block mb-1">Drop-off Date</label>
                <input
                  type="date"
                  value={formData.dropoffDate}
                  min={formData.pickupDate || today}
                  onChange={e => setFormData({ ...formData, dropoffDate: e.target.value })}
                  className="bg-[#F6F7F9] px-4 w-full h-11 rounded-lg outline-none text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-[14px] font-semibold text-[#1A202C] block mb-1">Drop-off Time</label>
                <input
                  type="time"
                  value={formData.dropoffTime}
                  onChange={e => setFormData({ ...formData, dropoffTime: e.target.value })}
                  className="bg-[#F6F7F9] px-4 w-full h-11 rounded-lg outline-none text-sm"
                  required
                />
              </div>
            </div>

            {/* Price Summary */}
            {selectedCar && (
              <div className="bg-[#F6F7F9] rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#90A3BF]">{selectedCar.title} x {calculateDays()} day(s)</span>
                  <span className="font-semibold text-[#1A202C]">${parseInt(String(selectedCar.price)) * calculateDays()}</span>
                </div>
                {parseInt(String(selectedCar.discount)) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#90A3BF]">Discount</span>
                    <span className="font-semibold text-green-500">-${selectedCar.discount}</span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between">
                  <span className="font-bold text-[#1A202C]">Total</span>
                  <span className="font-bold text-[#3563E9] text-lg">${calculateTotal()}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Review & Confirm */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-[16px] font-semibold text-[#1A202C]">Review & Confirm</h2>

            {selectedCar && (
              <div className="bg-[#F6F7F9] rounded-lg p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-16 bg-white rounded-md flex items-center justify-center flex-shrink-0">
                    {selectedCar.image && (
                      <Image
                        src={urlFor(selectedCar.image).url()}
                        alt={selectedCar.title}
                        width={96}
                        height={64}
                        className="object-contain"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] text-[#1A202C]">{selectedCar.title}</h3>
                    <p className="text-sm text-[#90A3BF]">{selectedCar.category} • {selectedCar.fuel} • {selectedCar.capacity}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#90A3BF]">Customer</p>
                <p className="font-semibold text-[#1A202C]">{formData.customerName}</p>
                <p className="text-[#596780]">{formData.customerPhone}</p>
              </div>
              <div>
                <p className="text-[#90A3BF]">Email</p>
                <p className="font-semibold text-[#1A202C]">{formData.customerEmail}</p>
              </div>
              <div>
                <p className="text-[#90A3BF]">Pickup</p>
                <p className="font-semibold text-[#1A202C]">{cities.find(c => c.value === formData.pickupLocation)?.label}</p>
                <p className="text-[#596780]">{formData.pickupDate} at {formData.pickupTime}</p>
              </div>
              <div>
                <p className="text-[#90A3BF]">Drop-off</p>
                <p className="font-semibold text-[#1A202C]">{cities.find(c => c.value === formData.dropoffLocation)?.label}</p>
                <p className="text-[#596780]">{formData.dropoffDate} at {formData.dropoffTime}</p>
              </div>
            </div>

            <div className="bg-[#3563E9] text-white rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-200">Total Rental Price</p>
                <p className="text-2xl font-bold">${calculateTotal()}</p>
              </div>
              <p className="text-xs text-blue-200">{calculateDays()} day(s)</p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 pt-4 border-t">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-6 py-2.5 bg-gray-100 text-[#1A202C] rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !formData.selectedCarId) return;
                if (step === 2 && (!formData.customerName || !formData.customerPhone)) return;
                setStep(step + 1);
              }}
              disabled={step === 1 && !formData.selectedCarId}
              className="px-6 py-2.5 bg-[#3563E9] text-white rounded-lg text-sm font-semibold hover:bg-[#2851c7] transition-colors disabled:opacity-50"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-[#3563E9] text-white rounded-lg text-sm font-semibold hover:bg-[#2851c7] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </>
              ) : (
                "Confirm Rental"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
