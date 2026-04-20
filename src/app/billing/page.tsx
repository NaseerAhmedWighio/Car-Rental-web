"use client";

import { Metadata } from "next";
import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createPaymentIntent, saveRentalToSanity as saveRentalToSanityServer } from "./action";
import Pattern from "@/Public/Pattern.png";
import swap from "../../../public/swap.svg"

export const metadata: Metadata = {
  title: "Checkout | Morent Car Rental",
  description: "Complete your car rental booking. Enter your details and payment information to confirm your rental in Pakistan.",
  keywords: ["checkout", "payment", "book car", "rental booking", "confirm booking", "Morent checkout"],
  openGraph: {
    title: "Checkout | Morent Car Rental",
    description: "Complete your car rental booking.",
    url: "https://morents.vercel.app/billing",
  },
};

const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!stripePublicKey) {
  console.warn("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set.");
}
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

interface RentalCar {
  _id: string;
  id: string;
  slug: string;
  title: string;
  category: string;
  image: string;
  fuel: string;
  type: string;
  capacity: string;
  price: number;
  discount: number;
}

interface BillingData {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  cityLocality: string;
  stateProvince: string;
  postalCode: string;
  countryCode: string;
}

interface RentalFormData {
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffLocation: string;
  dropoffDate: string;
  dropoffTime: string;
}

const CITY_OPTIONS = [
  { value: "khi", label: "Karachi" },
  { value: "hyd", label: "Hyderabad" },
  { value: "lhr", label: "Lahore" },
  { value: "qta", label: "Quetta" },
  { value: "isb", label: "Islamabad" },
  { value: "nbs", label: "Nawabshah" },
];

export default function BillingPage() {
  const [rentItems, setRentItems] = useState<string[]>([]);
  const [rentCars, setRentCars] = useState<RentalCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const postalCodeRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);

  const [billingData, setBillingData] = useState<BillingData>({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    cityLocality: "",
    stateProvince: "",
    postalCode: "",
    countryCode: "US",
  });

  const router = useRouter();

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState<RentalFormData>({
    pickupLocation: "khi",
    pickupDate: getTodayDate(),
    pickupTime: "",
    dropoffLocation: "khi",
    dropoffDate: getTomorrowDate(),
    dropoffTime: "",
  });

  const [rentalDays, setRentalDays] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("pick");

  const [sub, setSub] = useState(0);

  const TAX_RATE = 0.1;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const time = `${hours}:${minutes}`;
      setCurrentTime(time);
      setFormData(prev => ({ ...prev, pickupTime: time, dropoffTime: time }));
    };
    updateTime();
  }, []);

  useEffect(() => {
    const storedRent = localStorage.getItem("rentItems");
    if (storedRent) {
      setRentItems(JSON.parse(storedRent));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (rentItems.length === 0) {
      setRentCars([]);
      setLoading(false);
      return;
    }

    const fetchRentCars = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(
          `*[_type in ["popular","recommended"] && slug.current in $slugs]{
            _id, id, "slug": slug.current, title, category, image, fuel, type, capacity, price, discount
          }`,
          { slugs: rentItems }
        );
        setRentCars(response);
      } catch (error) {
        console.error("Error fetching rent cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentCars();
  }, [rentItems]);

  useEffect(() => {
    if (formData.pickupDate && formData.dropoffDate) {
      const pickup = new Date(formData.pickupDate);
      const dropoff = new Date(formData.dropoffDate);
      const diffTime = dropoff.getTime() - pickup.getTime();
      const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      setRentalDays(days);
    }
  }, [formData.pickupDate, formData.dropoffDate]);

  useEffect(() => {
    if (rentCars.length === 0) return;

    const total = rentCars.reduce((sum, car) => sum + (car.price || 0), 0);
    const days = rentalDays > 0 ? rentalDays : 1;
    const subtotal = total * days;
    setSub(subtotal);

    const fetchClientSecret = async () => {
      try {
        const { clientSecret: secret } = await createPaymentIntent(subtotal * (1 + TAX_RATE));
        setClientSecret(secret);
      } catch (err) {
        console.error("Error creating PaymentIntent:", err);
        setError("Failed to initialize payment");
      }
    };

    fetchClientSecret();
  }, [rentCars.length, rentalDays]);

  const handleSwap = () => {
    setFormData(prev => ({
      pickupLocation: prev.dropoffLocation,
      pickupDate: prev.dropoffDate,
      pickupTime: prev.dropoffTime || currentTime,
      dropoffLocation: prev.pickupLocation,
      dropoffDate: prev.pickupDate,
      dropoffTime: prev.pickupTime || currentTime,
    }));
  };

  const calculateCarTotal = () => {
    return rentCars.reduce((total, car) => total + parseFloat(String(car.price)), 0);
  };

  const calculateSubtotal = () => {
    return calculateCarTotal() * rentalDays;
  };

  const calculateTax = () => {
    return calculateCarTotal() * TAX_RATE;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const saveRentalToSanity = async () => {
    try {
      // Process car images for the server action
      const processedCars = rentCars.map(car => ({
        ...car,
        imageAssetId: (car.image as any)?.asset?._ref || null
      }));

      const result = await saveRentalToSanityServer(
        processedCars,
        billingData,
        formData,
        calculateTotal()
      );

      localStorage.setItem("rentItems", JSON.stringify([]));
      setRentItems([]);
      window.dispatchEvent(new Event("rentItemsUpdated"));

      return result.rentalId;
    } catch (error) {
      console.error("Error saving rental:", error);
      throw error;
    }
  };

  const isBillingDataValid =
    billingData.name.trim() !== "" &&
    billingData.phone.trim() !== "" &&
    billingData.addressLine1.trim() !== "" &&
    billingData.cityLocality.trim() !== "" &&
    billingData.postalCode.trim() !== "" &&
    billingData.stateProvince.trim() !== "";

  const isRentalDataValid =
    formData.pickupLocation.trim() !== "" &&
    formData.dropoffLocation.trim() !== "" &&
    formData.pickupDate.trim() !== "" &&
    formData.dropoffDate.trim() !== "";

  const isButtonEnabled =
    isChecked1 &&
    isChecked2 &&
    isBillingDataValid &&
    isRentalDataValid;

  const handleRentNowClick = () => {
    if (!billingData.name.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!billingData.phone.trim()) {
      alert("Please enter your phone number");
      return;
    }
    if (!billingData.addressLine1.trim()) {
      alert("Please enter your address");
      return;
    }
    if (!billingData.cityLocality.trim()) {
      alert("Please enter your city");
      return;
    }
    if (!billingData.postalCode.trim()) {
      alert("Please enter your postal code");
      return;
    }
    if (!billingData.stateProvince.trim()) {
      alert("Please enter your state/province");
      return;
    }
    if (!isChecked1 || !isChecked2) {
      alert("Please agree to the terms and conditions");
      return;
    }

    setProcessing(true);
    window.dispatchEvent(new CustomEvent("trigger-payment"));
  };

  if (loading || !clientSecret) {
    return (
      <div className="text-center text-2xl font-semibold min-h-[40vh] md:min-h-[70vh] flex justify-center items-center uppercase">
        Loading...
      </div>
    );
  }

  return (
    <main className="bg-[#F6F7F9] w-full min-h-[40vh] md:min-h-[70vh]">
      <div className="lg:mx-10 md:mx-8 mx-5 py-10">
        <div className="flex flex-col lg:flex-row items-start gap-10">
          <div className="order-2 lg:order-1 inline-block w-full space-y-10">
            <form className="space-y-10">
              {/* Step 1: Billing Info */}
              <div className="w-full h-auto bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-[#1A202C] lg:text-[20px] md:text-[18px] text-[16px] font-bold">Billing Info</h1>
                  <p className="lg:hidden text-[#90A3BF] text-[12px] lg:text-[14px] font-medium">Step 1 of 4</p>
                </div>
                <div className="flex justify-between items-center text-[#90A3BF] text-[12px] lg:text-[14px] font-medium">
                  <p>Please enter your billing info</p>
                  <p className="hidden lg:block text-[#90A3BF] text-[12px] lg:text-[14px] font-medium">Step 1 of 4</p>
                </div>
                <div className="md:grid md:grid-cols-2 items-start space-y-6 md:space-y-0 gap-4 md:gap-y-10 py-5">
                  <div className="list-inside md:space-y-4 space-y-2">
                    <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="name">Name</label>
                    <input
                      ref={nameRef}
                      type="text"
                      value={billingData.name}
                      onChange={(e) => setBillingData({ ...billingData, name: e.target.value })}
                      className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="list-inside md:space-y-4 space-y-2">
                    <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="tel">Phone number</label>
                    <input
                      ref={phoneRef}
                      type="tel"
                      value={billingData.phone}
                      onChange={(e) => setBillingData({ ...billingData, phone: e.target.value })}
                      className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none"
                      placeholder="Your number"
                      required
                    />
                  </div>
                  <div className="list-inside md:space-y-4 space-y-2">
                    <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="text">Address</label>
                    <input
                      ref={addressRef}
                      type="text"
                      value={billingData.addressLine1}
                      onChange={(e) => setBillingData({ ...billingData, addressLine1: e.target.value })}
                      className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none"
                      placeholder="Address"
                    />
                  </div>
                  <div className="list-inside md:space-y-4 space-y-2">
                    <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="town/city">Town / City</label>
                    <input
                      ref={cityRef}
                      type="text"
                      value={billingData.cityLocality}
                      onChange={(e) => setBillingData({ ...billingData, cityLocality: e.target.value })}
                      className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none"
                      placeholder="Town or city"
                    />
                  </div>
                  <div className="list-inside md:space-y-4 space-y-2">
                    <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="postalCode">Postal Code</label>
                    <input
                      ref={postalCodeRef}
                      type="text"
                      value={billingData.postalCode}
                      onChange={(e) => setBillingData({ ...billingData, postalCode: e.target.value })}
                      className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none"
                      placeholder="Postal Code"
                    />
                  </div>
                  <div className="list-inside md:space-y-4 space-y-2">
                    <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="stateProvince">State/Province</label>
                    <input
                      ref={stateRef}
                      type="text"
                      value={billingData.stateProvince}
                      onChange={(e) => setBillingData({ ...billingData, stateProvince: e.target.value })}
                      className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none"
                      placeholder="State/Province"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Rental Info */}
              <div className="w-full h-auto bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-[#1A202C] lg:text-[20px] md:text-[18px] text-[16px] font-bold">Rental Info</h1>
                  <p className="lg:hidden text-[#90A3BF] text-[12px] lg:text-[14px] font-medium">Step 2 of 4</p>
                </div>
                <div className="flex justify-between items-center text-[#90A3BF] text-[12px] lg:text-[14px] font-medium">
                  <p>Please select your rental date</p>
                  <p className="hidden lg:block text-[#90A3BF] text-[12px] lg:text-[14px] font-medium">Step 2 of 4</p>
                </div>

                <div className="flex gap-5 py-5">
                  <input type="radio" id="pick" checked={selectedOption === "pick"} onChange={() => setSelectedOption("pick")} />
                  <label htmlFor="pick" className="md:text-[16px] text-[14px] text-[#1A202C] font-semibold">Pick-Up</label>
                </div>

                <div className="md:grid md:grid-cols-2 items-start space-y-6 md:space-y-0 gap-4 md:gap-y-10">
                  <div className="list-inside md:space-y-4 space-y-2">
                    <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="pickupLocation">Location</label>
                    <div className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none items-center">
                      <select
                        value={formData.pickupLocation}
                        onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                        className="bg-transparent outline-none border-none w-full mt-3"
                        name="pickupLocation"
                        id="pickupLocation"
                      >
                        {CITY_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="list-inside md:space-y-4 space-y-2">
                    <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="pickupDate">Date</label>
                    <input
                      type="date"
                      id="pickupDate"
                      className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none"
                      value={formData.pickupDate}
                      min={getTodayDate()}
                      onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                    />
                  </div>
                  <div className="list-inside md:space-y-4 space-y-2">
                    <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="pickupTime">Time</label>
                    <input
                      type="time"
                      id="pickupTime"
                      className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none"
                      value={formData.pickupTime}
                      onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                    />
                  </div>
                  <div className="list-inside md:space-y-4 space-y-2 w-full">
                    <div className="md:h-[26px] lg:h-7" />
                    <div onClick={handleSwap} className="flex justify-center items-center w-full bg-[#3967ee] hover:bg-blue-700 rounded-lg h-12 md:text-[16px] text-[14px] text-white font-semibold">
                      <Image className="font-black w-7 h-7" src={swap} alt="swap" width={20} height={25} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-5 py-5">
                  <input type="radio" id="drop" onChange={() => setSelectedOption("drop")} checked={selectedOption === "drop"} />
                  <label htmlFor="drop" className="text-[16px] text-[#1A202C] font-semibold">Drop - Off</label>
                </div>

                <div className="md:grid md:grid-cols-2 items-start space-y-6 md:space-y-0 gap-4 md:gap-y-10">
                  <div className="list-inside md:space-y-4 space-y-2">
                    <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="dropoffLocation">Location</label>
                    <div className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none items-center">
                      <select
                        value={formData.dropoffLocation}
                        onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
                        className="bg-transparent outline-none border-none w-full mt-3"
                        name="dropoffLocation"
                        id="dropoffLocation"
                      >
                        {CITY_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="list-inside md:space-y-4 space-y-2">
                    <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="dropoffDate">Date</label>
                    <input
                      type="date"
                      id="dropoffDate"
                      className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none"
                      value={formData.dropoffDate}
                      min={formData.pickupDate}
                      onChange={(e) => setFormData({ ...formData, dropoffDate: e.target.value })}
                    />
                  </div>
                  <div className="list-inside md:space-y-4 space-y-2">
                    <label className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold" htmlFor="dropoffTime">Time</label>
                    <input
                      type="time"
                      id="dropoffTime"
                      className="bg-[#F6F7F9] px-6 w-full h-12 rounded-lg outline-none"
                      value={formData.dropoffTime}
                      onChange={(e) => setFormData({ ...formData, dropoffTime: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method */}
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
                        <input type="radio" id="credit-card" checked={true} readOnly />
                        <label htmlFor="credit-card" className="text-[#1A202C] md:text-[16px] text-[14px] font-semibold">
                          Credit Card
                        </label>
                      </div>
                    </div>

                    {stripePromise && clientSecret ? (
                      <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <MultiCarPaymentForm
                          onPaymentSubmit={saveRentalToSanity}
                          processing={processing}
                          setProcessing={setProcessing}
                          rentalDetails={{
                            name: billingData.name,
                            phone: billingData.phone,
                            pickupLocation: formData.pickupLocation,
                            pickupDate: formData.pickupDate,
                            pickupTime: formData.pickupTime || currentTime,
                            dropoffLocation: formData.dropoffLocation,
                            dropoffDate: formData.dropoffDate,
                            dropoffTime: formData.dropoffTime || currentTime,
                            totalPrice: calculateTotal(),
                          }}
                        />
                      </Elements>) : (
                      <div className="p-4 bg-gray-100 rounded-lg text-gray-600 text-center">
                        Initializing payment...
                      </div>
                    )}

                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 text-sm">
                        <span className="font-semibold">Demo Mode:</span> Use card number <span className="font-mono font-bold">4242 4242 4242 4242</span> with any future expiry date and any CVC.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Confirmation */}
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
                    <label htmlFor="agree-2" className="text-[#1F2544] text-[12px] lg:text-[16px] font-medium">I agree with our <span className="underline">terms and conditions</span> and <span className="underline">privacy policy!</span></label>
                  </div>
                </div>
                <div className="py-5">
                  <button
                    type="button"
                    onClick={handleRentNowClick}
                    disabled={!isButtonEnabled || processing}
                    className={`px-6 py-4 font-semibold text-[16px] rounded-lg ${(isButtonEnabled && !processing) ? "bg-[#3563E9] text-white" : "bg-slate-300 text-red-400 cursor-not-allowed"}`}
                  >
                    {processing ? "Processing..." : "Rent Now"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Rental Summary */}
          <div className="order-1 lg:order-2 w-full h-auto sticky lg:top-32 space-y-10">
            <div className="bg-[white] rounded-lg shadow-md p-4">
              <h1 className="text-[#1A202C] lg:text-[20px] md:text-[18px] text-[16px] font-bold">Rental Summary</h1>
              <p className="text-[#90A3BF] lg:text-[14px] text-[12px] font-medium">Prices may change depending on the length of the rental and the price of your rental car.</p>

              {rentCars.length > 0 && (
                <>
                  <div className="flex justify-start items-center gap-2 lg:gap-5 py-5">
                    {rentCars.length === 1 ? (
                      <div className="relative w-28 lg:w-48 h-24 lg:h-44 p-2 shadow-md flex justify-center items-center rounded-lg overflow-hidden" style={{ backgroundImage: `url(${Pattern.src})`, backgroundSize: "cover" }}>
                        <Image
                          src={rentCars[0].image ? urlFor(rentCars[0].image).url() : "/default-image.jpg"}
                          alt={rentCars[0].title}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {rentCars.slice(0, 4).map((car, idx) => (
                          <div key={idx} className="relative w-20 h-20 p-1 shadow-md flex justify-center items-center rounded-lg overflow-hidden" style={{ backgroundImage: `url(${Pattern.src})`, backgroundSize: "cover" }}>
                            <Image
                              src={car.image ? urlFor(car.image).url() : "/default-image.jpg"}
                              alt={car.title}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <div>
                      {rentCars.length === 1 ? (
                        <h1 className="lg:text-[20px] md:text-[18px] text-[14px] font-bold">{rentCars[0].title}</h1>
                      ) : (
                        <>
                          <h1 className="lg:text-[20px] md:text-[18px] text-[14px] font-bold">{rentCars.length} Cars Selected</h1>
                          <p className="text-[#90A3BF] text-xs">Multiple cars for rent</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Car list with remove buttons */}
                  <div className="space-y-3 mt-4">
                    {rentCars.map((car) => (
                      <div key={car.slug} className="flex items-center gap-3 p-2 bg-[#F6F7F9] rounded-lg">
                        <div className="relative w-16 h-12 flex-shrink-0">
                          <Image
                            src={car.image ? urlFor(car.image).url() : "/default-image.jpg"}
                            alt={car.title}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[#1A202C] text-xs font-semibold truncate">{car.title}</h3>
                          <p className="text-[#90A3BF] text-[10px]">${car.price}/day</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = rentItems.filter(s => s !== car.slug);
                            setRentItems(updated);
                            localStorage.setItem("rentItems", JSON.stringify(updated));
                            setRentCars(rentCars.filter(c => c.slug !== car.slug));
                          }}
                          className="text-red-500 text-xs hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="py-5 space-y-5">
                    <div className="flex justify-between text-[14px] md:text-[16px]">
                      <p className="text-[#90A3BF] font-medium">Car Price ({rentalDays} day{rentalDays > 1 ? 's' : ''})</p>
                      <p className="text-[#1A202C] font-semibold">${calculateSubtotal()}</p>
                    </div>
                    <div className="flex justify-between text-[14px] md:text-[16px]">
                      <p className="text-[#90A3BF] font-medium">Tax (10%)</p>
                      <p className="text-[#1A202C] font-semibold">${calculateTax().toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex justify-center items-center mt-4">
                    <input className="w-full h-16 px-10 outline-none rounded-l-lg bg-[#F6F7F9] text-[12px] md:text-[16px]" placeholder="Apply promo code"></input>
                    <div className="relative w-60 h-16 bg-[#F6F7F9] rounded-r-lg items-center text-center font-semibold md:text-[16px] text-[12px] text-[#1A202C] py-5 pr-4">
                      <h2>Apply now</h2>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-8">
                    <div className="gap-3">
                      <h2 className="lg:text-[20px] text-base text-[#1A202C] font-bold">Total Rental Price</h2>
                      <p className="text-[#90A3BF] md:text-[14px] text-[12px] font-medium">Overall price and includes rental discount</p>
                    </div>
                    <h1 className="lg:text-[28px] md:text-[24px] text-[16px] font-semibold text-[#1A202C]">${calculateTotal().toFixed(2)}</h1>
                  </div>
                </>
              )}

              {rentCars.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-[#90A3BF] mb-4">No cars selected for rent.</p>
                  <Link href="/rent" className="text-[#3563E9] hover:underline">
                    Browse cars to rent
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Multi-car payment form
interface MultiCarPaymentFormProps {
  onPaymentSubmit: () => Promise<string | null>;
  processing: boolean;
  setProcessing: (value: boolean) => void;
  rentalDetails: {
    name: string;
    phone: string;
    pickupLocation: string;
    pickupDate: string;
    pickupTime: string;
    dropoffLocation: string;
    dropoffDate: string;
    dropoffTime: string;
    totalPrice: number;
  };
}

function MultiCarPaymentForm({ onPaymentSubmit, processing, setProcessing, rentalDetails }: MultiCarPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    setProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "An unknown error occurred");
      setProcessing(false);
    } else {
      const rentalId = await onPaymentSubmit();
      if (rentalId) {
        const params = new URLSearchParams({
          rentalId,
          name: rentalDetails.name,
          phone: rentalDetails.phone,
          pickupLocation: rentalDetails.pickupLocation,
          pickupDate: rentalDetails.pickupDate,
          pickupTime: rentalDetails.pickupTime,
          dropoffLocation: rentalDetails.dropoffLocation,
          dropoffDate: rentalDetails.dropoffDate,
          dropoffTime: rentalDetails.dropoffTime,
          totalPrice: rentalDetails.totalPrice.toString(),
        });
        router.push(`/billing/success?${params.toString()}`);
      }
      setProcessing(false);
    }
  };

  useEffect(() => {
    const handler = () => handleSubmit();
    window.addEventListener("trigger-payment", handler);
    return () => window.removeEventListener("trigger-payment", handler);
  }, [handleSubmit]);

  return (
    <div>
      <div id="payment-form-wrapper">
        <PaymentElement />
      </div>
      {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
    </div>
  );
}