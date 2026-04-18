"use client";
import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { useRouter } from "next/navigation";

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
}

export default function BillingPage() {
  const [rentItems, setRentItems] = useState<string[]>([]);
  const [rentCars, setRentCars] = useState<RentalCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

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
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    pickupLocation: "",
    pickupDate: getTodayDate(),
    pickupTime: "",
    dropoffLocation: "",
    dropoffDate: getTomorrowDate(),
    dropoffTime: "",
  });
  const [rentalDays, setRentalDays] = useState<number>(1);
  const [rentalSuccess, setRentalSuccess] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [selectedCourier, setSelectedCourier] = useState<string>("");
  const [labelData, setLabelData] = useState<any>(null);
  const [generatingLabel, setGeneratingLabel] = useState(false);
  const router = useRouter();

  const TAX_RATE = 0.1;
  const COURIER_FEE = 25;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const currentTimeVal = `${hours}:${minutes}`;
    setFormData(prev => ({
      ...prev,
      pickupTime: currentTimeVal,
      dropoffTime: currentTimeVal
    }));
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
            _id,
            id,
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
    } else {
      setRentalDays(1);
    }
  }, [formData.pickupDate, formData.dropoffDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "pickupDate") {
      const pickupDate = new Date(value);
      const currentDropoff = new Date(formData.dropoffDate);
      const minDropoff = new Date(pickupDate);
      minDropoff.setDate(minDropoff.getDate() + 1);
      
      if (currentDropoff <= pickupDate) {
        setFormData((prev) => ({ 
          ...prev, 
          pickupDate: value,
          dropoffDate: minDropoff.toISOString().split("T")[0]
        }));
      } else {
        setFormData((prev) => ({ ...prev, pickupDate: value }));
      }
      return;
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    return calculateSubtotal() + calculateTax() + COURIER_FEE;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rentCars.length === 0) {
      alert("Please select at least one car to rent");
      return;
    }

    if (!formData.customerName || !formData.customerPhone || !formData.pickupLocation || 
        !formData.pickupDate || !formData.dropoffLocation || !formData.dropoffDate) {
      alert("Please fill in all required fields");
      return;
    }

    setProcessing(true);

    try {
      const rentalId = `RNT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      for (const car of rentCars) {
        const rental = {
          _type: "rental",
          carTitle: car.title,
          carSlug: car.slug,
          category: car.category,
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
          status: "active",
          rentalId,
          carImage: car.image ? urlFor(car.image).url() : null,
          rentedAt: new Date().toISOString(),
        };

        await client.create(rental);
      }

      localStorage.setItem("rentItems", JSON.stringify([]));
      setRentItems([]);
      window.dispatchEvent(new Event("rentItemsUpdated"));
      
      setRentalSuccess(rentalId);
      
      // if (formData.pickupLocation && formData.dropoffLocation) {
      //   fetchCourierRates();
      // }
    } catch (error) {
      console.error("Error creating rental:", error);
      alert("Failed to process rental. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center text-blue-500 text-2xl font-semibold min-h-[40vh] md:min-h-[70vh]">
        Loading...
      </div>
    );
  }

  const handleGenerateBooking = async () => {
    if (!selectedCourier) {
      alert("Please select pickup location confirmation method");
      return;
    }
    
    setGeneratingLabel(true);
    
    try {
      const bookingRef = `RNT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      setLabelData({
        bookingRef,
        rentalId: rentalSuccess,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        pickupLocation: formData.pickupLocation,
        dropoffLocation: formData.dropoffLocation,
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        dropoffDate: formData.dropoffDate,
        dropoffTime: formData.dropoffTime,
        cars: rentCars.map(c => c.title).join(", "),
        totalPrice: calculateTotal(),
        generatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error generating booking:", error);
      alert("Failed to generate booking. Please try again.");
    } finally {
      setGeneratingLabel(false);
    }
  };

  const PICKUP_METHODS = [
    { id: "pickup", name: "Pickup at Location", icon: "📍" },
    { id: "delivery", name: "Home Delivery", icon: "🚗" },
    { id: "qrcode", name: "QR Code Verification", icon: "📱" },
  ];

  if (rentalSuccess) {
    return (
      <main className="w-full min-h-[40vh] md:min-h-[70vh] bg-[#F6F7F9] py-6 sm:py-8 lg:py-10">
        <div className="mx-5 md:mx-8 lg:mx-20">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#1A202C] mb-2 text-center">Rental Successful!</h1>
            <p className="text-[#90A3BF] mb-2 text-center">Your Rental ID: <span className="font-semibold text-[#1A202C]">{rentalSuccess}</span></p>
            
            {!labelData ? (
              <>
                <div className="mt-8 p-4 bg-[#F6F7F9] rounded-lg">
                  <h2 className="text-[#1A202C] font-semibold mb-4">Select Pickup/Verification Method</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {PICKUP_METHODS.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedCourier(method.id)}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          selectedCourier === method.id 
                            ? "border-[#3563E9] bg-blue-50" 
                            : "border-gray-200 hover:border-[#3563E9]"
                        }`}
                      >
                        <span className="text-2xl block mb-2">{method.icon}</span>
                        <span className="text-[#1A202C] font-medium block">{method.name}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleGenerateBooking}
                    disabled={generatingLabel || !selectedCourier}
                    className="w-full mt-6 py-3 bg-[#3563E9] text-white font-semibold rounded-lg hover:bg-[#2952cc] disabled:bg-gray-400"
                  >
                    {generatingLabel ? "Generating..." : "Generate Booking Confirmation"}
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-8 space-y-6">
                <div className="p-6 bg-white border-2 border-[#3563E9] rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[#1A202C]">Booking Confirmation</h2>
                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">Confirmed</span>
                  </div>
                  <div className="space-y-3 text-left">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-[#90A3BF] text-sm">Booking Reference</p>
                      <p className="text-2xl font-bold text-[#3563E9]">{labelData.bookingRef}</p>
                    </div>
                    <p><strong>Rental ID:</strong> {labelData.rentalId}</p>
                    <p><strong>Cars:</strong> {labelData.cars}</p>
                    <p><strong>Customer:</strong> {labelData.customerName}</p>
                    <p><strong>Phone:</strong> {labelData.customerPhone}</p>
                    {labelData.customerEmail && <p><strong>Email:</strong> {labelData.customerEmail}</p>}
                    <p><strong>Pickup Location:</strong> {labelData.pickupLocation}</p>
                    <p><strong>Pickup Date & Time:</strong> {labelData.pickupDate} at {labelData.pickupTime}</p>
                    <p><strong>Dropoff Location:</strong> {labelData.dropoffLocation}</p>
                    <p><strong>Dropoff Date & Time:</strong> {labelData.dropoffDate} at {labelData.dropoffTime}</p>
                    <p><strong>Total Paid:</strong> <span className="text-xl font-bold text-[#1A202C]">${labelData.totalPrice.toLocaleString()}</span></p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <button
                      onClick={() => window.print()}
                      className="flex-1 py-3 bg-[#3563E9] text-white font-semibold rounded-lg hover:bg-[#2952cc]"
                    >
                      Download/Print Invoice
                    </button>
                    <button
                      onClick={() => {
                        const text = `Car Rental Booking\nRef: ${labelData.bookingRef}\n${labelData.cars}\nPickup: ${labelData.pickupDate} ${labelData.pickupLocation}`;
                        navigator.clipboard.writeText(text);
                        alert("Booking details copied to clipboard!");
                      }}
                      className="flex-1 py-3 bg-[#22c55e] text-white font-semibold rounded-lg hover:bg-[#16a34a]"
                    >
                      Copy Details
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 text-center">
              <Link href="/">
                <button className="px-6 py-3 bg-[#3563E9] text-white font-semibold rounded-lg hover:bg-[#2952cc]">
                  Return to Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-[40vh] md:min-h-[70vh] bg-[#F6F7F9] py-6 sm:py-8 lg:py-10">
      <div className="mx-5 md:mx-8 lg:mx-20">
        <h1 className="w-full bg-[#3563E9] rounded-lg shadow-md text-[20px] sm:text-[24px] font-semibold text-white text-center mb-6 sm:mb-8 py-3 sm:py-4">
          Complete Your Rental
        </h1>
        
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-10">
          <form onSubmit={handleSubmit} className="order-2 lg:order-1 w-full space-y-6">
            <div className="w-full bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-[#1A202C] text-[18px] sm:text-[20px] font-bold mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="text-[#1A202C] text-[14px] font-semibold block mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    className="bg-[#F6F7F9] px-4 w-full h-12 rounded-lg outline-none text-[#1A202C]"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="text-[#1A202C] text-[14px] font-semibold block mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    required
                    className="bg-[#F6F7F9] px-4 w-full h-12 rounded-lg outline-none text-[#1A202C]"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="text-[#1A202C] text-[14px] font-semibold block mb-2">Email Address</label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className="bg-[#F6F7F9] px-4 w-full h-12 rounded-lg outline-none text-[#1A202C]"
                    placeholder="Enter email (optional)"
                  />
                </div>
              </div>
            </div>

            <div className="w-full bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-[#1A202C] text-[18px] sm:text-[20px] font-bold mb-4">Pickup Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="text-[#1A202C] text-[14px] font-semibold block mb-2">Pickup Location *</label>
                  <select
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleInputChange}
                    required
                    className="bg-[#F6F7F9] px-4 w-full h-12 rounded-lg outline-none text-[#1A202C]"
                  >
                    <option value="">Select city</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Quetta">Quetta</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#1A202C] text-[14px] font-semibold block mb-2">Pickup Date *</label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleInputChange}
                    min={getTodayDate()}
                    required
                    className="bg-[#F6F7F9] px-4 w-full h-12 rounded-lg outline-none text-[#1A202C]"
                  />
                </div>
                <div>
                  <label className="text-[#1A202C] text-[14px] font-semibold block mb-2">Pickup Time</label>
                  <input
                    type="time"
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleInputChange}
                    className="bg-[#F6F7F9] px-4 w-full h-12 rounded-lg outline-none text-[#1A202C]"
                  />
                </div>
              </div>
            </div>

            <div className="w-full bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-[#1A202C] text-[18px] sm:text-[20px] font-bold mb-4">Dropoff Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="text-[#1A202C] text-[14px] font-semibold block mb-2">Dropoff Location *</label>
                  <select
                    name="dropoffLocation"
                    value={formData.dropoffLocation}
                    onChange={handleInputChange}
                    required
                    className="bg-[#F6F7F9] px-4 w-full h-12 rounded-lg outline-none text-[#1A202C]"
                  >
                    <option value="">Select city</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Quetta">Quetta</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#1A202C] text-[14px] font-semibold block mb-2">Dropoff Date *</label>
                  <input
                    type="date"
                    name="dropoffDate"
                    value={formData.dropoffDate}
                    onChange={handleInputChange}
                    min={formData.pickupDate}
                    required
                    className="bg-[#F6F7F9] px-4 w-full h-12 rounded-lg outline-none text-[#1A202C]"
                  />
                </div>
                <div>
                  <label className="text-[#1A202C] text-[14px] font-semibold block mb-2">Dropoff Time</label>
                  <input
                    type="time"
                    name="dropoffTime"
                    value={formData.dropoffTime}
                    onChange={handleInputChange}
                    className="bg-[#F6F7F9] px-4 w-full h-12 rounded-lg outline-none text-[#1A202C]"
                  />
                </div>
              </div>
            </div>

            <div className="w-full bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-[#1A202C] text-[18px] sm:text-[20px] font-bold mb-4">Confirm Rental</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" required className="w-5 h-5" />
                  <span className="text-[#1A202C] text-[14px]">I agree to the terms and conditions</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5" />
                  <span className="text-[#1A202C] text-[14px]">Send me rental confirmation via email</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing || rentCars.length === 0}
              className="w-full py-4 bg-[#3563E9] text-white font-semibold text-[16px] rounded-lg hover:bg-[#2952cc] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? "Processing..." : `Confirm Rental - $${calculateTotal().toLocaleString()}`}
            </button>
          </form>

          <div className="order-1 lg:order-2 w-full lg:w-[400px] bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-[#1A202C] text-[18px] sm:text-[20px] font-bold mb-4">Rental Summary</h2>
            
            {rentCars.length > 0 ? (
              <>
                <div className="space-y-4 mb-6">
                  {rentCars.map((car) => (
                    <div key={car.slug} className="flex items-center gap-4 p-3 bg-[#F6F7F9] rounded-lg">
                      <div className="w-20 h-16 flex-shrink-0">
                        <Image
                          src={car.image ? urlFor(car.image).url() : "/fallback-image.jpg"}
                          alt={car.title}
                          width={80}
                          height={64}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[#1A202C] text-[14px] font-semibold truncate">{car.title}</h3>
                        <p className="text-[#90A3BF] text-[12px]">${car.price}/day</p>
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

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-[14px]">
                    <p className="text-[#90A3BF]">Car Price ({rentalDays} day{rentalDays > 1 ? 's' : ''})</p>
                    <p className="text-[#1A202C] font-semibold">${calculateSubtotal().toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <p className="text-[#90A3BF]">Tax (10%)</p>
                    <p className="text-[#1A202C] font-semibold">${calculateTax().toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <p className="text-[#90A3BF]">Courier & Documentation</p>
                    <p className="text-[#1A202C] font-semibold">${COURIER_FEE.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <p className="text-[#1A202C] text-[16px] font-bold">Total</p>
                    <p className="text-[#1A202C] text-[20px] font-bold">${calculateTotal().toFixed(2)}</p>
                  </div>
                </div>
              </>
            ) : (
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
    </main>
  );
}