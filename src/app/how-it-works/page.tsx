"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function HowItWorksPage() {
  return (
    <main className="bg-[#F6F7F9] min-h-screen">
      <div className="mx-5 lg:mx-20 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A202C] mb-4">How It Works</h1>
          <p className="text-[#90A3BF] text-lg max-w-2xl mx-auto">
            Learn how MORENT makes car rental simple and convenient for you
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 md:p-10 mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A202C] mb-8">Getting Started - 4 Simple Steps</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#F6F7F9] rounded-xl p-6 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-[#3563E9] rounded-full flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
              <div className="w-16 h-16 mx-auto bg-[#3563E9] rounded-full flex items-center justify-center mt-2 mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1A202C] mb-2">Browse Cars</h3>
              <p className="text-[#596780] text-sm">
                Explore our wide selection of vehicles including SUVs, Sedans, Trucks, and Electric cars
              </p>
            </div>
            <div className="bg-[#F6F7F9] rounded-xl p-6 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-[#3563E9] rounded-full flex items-center justify-center text-white font-bold text-lg">
                2
              </div>
              <div className="w-16 h-16 mx-auto bg-[#3563E9] rounded-full flex items-center justify-center mt-2 mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1A202C] mb-2">Select Your Car</h3>
              <p className="text-[#596780] text-sm">
                Choose your preferred vehicle based on category, price, and features
              </p>
            </div>
            <div className="bg-[#F6F7F9] rounded-xl p-6 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-[#3563E9] rounded-full flex items-center justify-center text-white font-bold text-lg">
                3
              </div>
              <div className="w-16 h-16 mx-auto bg-[#3563E9] rounded-full flex items-center justify-center mt-2 mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m8 4v10m-8 4h.01M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1A202C] mb-2">Book & Pay</h3>
              <p className="text-[#596780] text-sm">
                Select rental dates, location, and complete secure payment with Stripe
              </p>
            </div>
            <div className="bg-[#F6F7F9] rounded-xl p-6 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-[#3563E9] rounded-full flex items-center justify-center text-white font-bold text-lg">
                4
              </div>
              <div className="w-16 h-16 mx-auto bg-[#3563E9] rounded-full flex items-center justify-center mt-2 mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1A202C] mb-2">Enjoy Ride</h3>
              <p className="text-[#596780] text-sm">
                Pick up your car and enjoy your journey with full insurance coverage
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 md:p-10 mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A202C] mb-6">Using the AI Chat Assistant</h2>
          <div className="space-y-6">
            <div className="bg-[#F6F7F9] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#1A202C] mb-4">🤖 Smart Car Search</h3>
              <ul className="space-y-2 text-[#596780]">
                <li>• Tell the chatbot: <span className="font-medium text-[#3563E9]">"Show me SUVs"</span> or <span className="font-medium text-[#3563E9]">"I need a family car"</span></li>
                <li>• Ask about prices: <span className="font-medium text-[#3563E9]">"How much is the Tesla?"</span></li>
                <li>• Get recommendations based on your preferences</li>
              </ul>
            </div>
            <div className="bg-[#F6F7F9] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#1A202C] mb-4">📅 Easy Booking Commands</h3>
              <ul className="space-y-2 text-[#596780]">
                <li>• <span className="font-medium text-[#3563E9]">"Book this car"</span> - Book the last shown car</li>
                <li>• <span className="font-medium text-[#3563E9]">"Book [car name] car"</span> - Book a specific car by name</li>
                <li>• <span className="font-medium text-[#3563E9]">"Show my rentals"</span> - View your selected cars</li>
                <li>• <span className="font-medium text-[#3563E9]">"Checkout"</span> - Proceed to payment</li>
              </ul>
            </div>
            <div className="bg-[#F6F7F9] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#1A202C] mb-4">💾 Conversation Memory</h3>
              <ul className="space-y-2 text-[#596780]">
                <li>• Chat history is saved - your conversations persist across sessions</li>
                <li>• Remembers your favorite car types and budget preferences</li>
                <li>• Provides personalized recommendations based on past searches</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 md:p-10 mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A202C] mb-6">Car Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#F6F7F9] rounded-xl p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-[#3563E9] rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1A202C] mb-2">SUVs</h3>
              <p className="text-[#596780] text-sm">Spacious vehicles for families and adventures</p>
            </div>
            <div className="bg-[#F6F7F9] rounded-xl p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-[#3563E9] rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1A202C] mb-2">Sedans</h3>
              <p className="text-[#596780] text-sm">Comfortable cars for daily commute</p>
            </div>
            <div className="bg-[#F6F7F9] rounded-xl p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-[#3563E9] rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1A202C] mb-2">Trucks</h3>
              <p className="text-[#596780] text-sm">Powerful vehicles for heavy loads</p>
            </div>
            <div className="bg-[#F6F7F9] rounded-xl p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-[#3563E9] rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1A202C] mb-2">Electric</h3>
              <p className="text-[#596780] text-sm">Eco-friendly modern vehicles</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 md:p-10 mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A202C] mb-6">Pricing & Packages</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#F6F7F9] rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-[#1A202C] mb-2">Daily Rental</h3>
              <p className="text-3xl font-bold text-[#3563E9] mb-2">From $30</p>
              <p className="text-[#596780] text-sm">Perfect for short-term needs</p>
            </div>
            <div className="bg-[#F6F7F9] rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-[#1A202C] mb-2">Weekly Rental</h3>
              <p className="text-3xl font-bold text-[#3563E9] mb-2">From $180</p>
              <p className="text-[#596780] text-sm">Save up to 15%</p>
            </div>
            <div className="bg-[#F6F7F9] rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-[#1A202C] mb-2">Monthly Rental</h3>
              <p className="text-3xl font-bold text-[#3563E9] mb-2">From $600</p>
              <p className="text-[#596780] text-sm">Best value for long-term</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A202C] mb-6">Features & Benefits</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1A202C]">Instant Booking</h3>
                <p className="text-[#596780] text-sm">Book your car in seconds with real-time availability</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1A202C]">Secure Payments</h3>
                <p className="text-[#596780] text-sm">Safe and encrypted transactions via Stripe</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1A202C]">Insurance Coverage</h3>
                <p className="text-[#596780] text-sm">All rentals include comprehensive insurance</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1A202C]">24/7 Support</h3>
                <p className="text-[#596780] text-sm">Round-the-clock customer assistance</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1A202C]">Multiple Pickup Locations</h3>
                <p className="text-[#596780] text-sm">Choose from 6 convenient locations</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1A202C]">Free Cancellation</h3>
                <p className="text-[#596780] text-sm">Cancel up to 24 hours before pickup</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link 
            href="/rent" 
            className="inline-block px-8 py-4 bg-[#3563E9] text-white rounded-lg font-semibold text-lg hover:bg-[#2A4EB8] transition-colors"
          >
            Start Renting Now
          </Link>
        </div>
      </div>
    </main>
  );
}