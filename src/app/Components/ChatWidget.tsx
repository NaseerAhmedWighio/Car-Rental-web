"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useCart } from "./cartContext";
import { useFavorites } from "../tracking/FavoritesContext";
const CHATBOT_URL = process.env.CHATBOT_URL || "https://naseerahmed-morent.hf.space";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  carData?: CarData;
}

interface CarData {
  slug: string;
  title: string;
  category: string;
  price: number;
  discount?: number;
  imageUrl?: string;
}

interface CartItem {
  slug: string;
  title: string;
  category: string;
  price: number;
  discount?: number;
  imageUrl?: string;
}

interface ChatWidgetProps {
  chatbotUrl?: string;
  position?: "bottom-right" | "bottom-left";
}

const CHAT_STORAGE_PREFIX = "chat_history_";

function getStorageKey(userId: string): string {
  return `${CHAT_STORAGE_PREFIX}${userId}`;
}

function loadChatHistory(userId: string): Message[] {
  if (typeof window === "undefined") return [];
  const key = getStorageKey(userId);
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      }));
    } catch {
      return [];
    }
  }
  return [];
}

function saveChatHistory(userId: string, messages: Message[]): void {
  const key = getStorageKey(userId);
  localStorage.setItem(key, JSON.stringify(messages));
}

function loadUserPreferences(userId: string): any {
  if (typeof window === "undefined") return null;
  const key = `user_preferences_${userId}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

function saveUserPreferences(userId: string, prefs: any): void {
  const key = `user_preferences_${userId}`;
  localStorage.setItem(key, JSON.stringify(prefs));
}

export default function ChatWidget({
  position = "bottom-right",
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const defaultGreeting = "Hello! I'm your car rental assistant.";
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [lastShownCar, setLastShownCar] = useState<CarData | null>(null);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, isSignedIn } = useUser();
  const { rentItems, addToRent, removeFromRent, isInRent } = useCart();
  const { favorites } = useFavorites();
  

  // Load chat history on mount when user is available
  useEffect(() => {
    if (user?.id) {
      const history = loadChatHistory(user.id);
      if (history.length > 0) {
        setMessages(history);
      } else {
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content: "Hello! I'm your car rental assistant. How can I help you today?\n\nI can help you with:\n• 🚗 **Search cars** - Find SUV, Sedan, Truck, or any type\n• 💰 **Check prices** - Get daily/weekly/monthly rates\n• ❤️ **Your favorites** - View saved cars\n• 📅 **Book a car** - Start rental process\n• 📋 **My rentals** - View booking history\n• ❓ **Ask questions** - About features, specs, availability\n• 📞 **Contact support** - Get help anytime\n\nWhat would you like to do?",
            timestamp: new Date(),
          },
        ]);
      }
      const prefs = loadUserPreferences(user.id);
      if (prefs) {
        setUserPreferences(prefs);
      }
    }
  }, [user?.id]);

  // Save chat history when messages change
  useEffect(() => {
    if (user?.id && messages.length > 0) {
      saveChatHistory(user.id, messages);
    }
  }, [messages, user?.id]);

  // Track user preferences from chat
  useEffect(() => {
    if (!user?.id || messages.length < 2) return;
    const recentMessages = messages.slice(-10);
    const prefs: any = { categories: [], priceRange: null, favoriteCars: [] };
    recentMessages.forEach((msg) => {
      if (msg.carData) {
        if (!prefs.categories.includes(msg.carData.category)) {
          prefs.categories.push(msg.carData.category);
        }
        if (msg.carData.price && (prefs.priceRange === null || msg.carData.price < prefs.priceRange)) {
          prefs.priceRange = msg.carData.price;
        }
      }
      if (msg.role === "user") {
        const content = msg.content.toLowerCase();
        if (content.includes("suv")) prefs.categories.push("SUV");
        if (content.includes("sedan")) prefs.categories.push("Sedan");
        if (content.includes("truck")) prefs.categories.push("Truck");
        if (content.includes("electric")) prefs.categories.push("Electric");
        if (content.includes("budget") || content.includes("cheap") || content.includes("affordable")) {
          prefs.priceRange = "budget";
        }
        if (content.includes("luxury") || content.includes("premium") || content.includes("expensive")) {
          prefs.priceRange = "luxury";
        }
      }
    });
    if (prefs.categories.length > 0 || prefs.priceRange) {
      setUserPreferences(prefs);
      saveUserPreferences(user.id, prefs);
    }
  }, [messages, user?.id]);

  // Update welcome message with user name when user logs in
  useEffect(() => {
    if (user?.fullName) {
      setMessages(prev => {
        if (prev[0]?.content.includes("Hello! I'm your car rental assistant.")) {
          return [{
            ...prev[0],
            content: `Hi ${user.fullName}! 👋 How can I help you today?\n\nI can help you with:\n• 🚗 **Search cars** - Find SUV, Sedan, Truck, or any type\n• 💰 **Check prices** - Get daily/weekly/monthly rates\n• ❤️ **Your favorites** - View saved cars\n• 📅 **Book a car** - Start rental process\n• 📋 **My rentals** - View booking history\n• ❓ **Ask questions** - About features, specs, availability\n• 📞 **Contact support** - Get help anytime\n\nWhat would you like to do?`
          }, ...prev.slice(1)];
        }
        return prev;
      });
    }
  }, [user]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Check for payment confirmation from sessionStorage
  useEffect(() => {
    const checkPaymentStatus = () => {
      const confirmed = sessionStorage.getItem("paymentConfirmed");
      if (confirmed) {
        const rentalData = JSON.parse(confirmed);
        const confirmMsg: Message = {
          id: `confirm-${Date.now()}`,
          role: "assistant",
          content: `✅ **Payment Successful!**\n\nYour rental has been confirmed!\n\n📋 **Booking Details:**\n• Rental ID: ${rentalData.rentalId}\n• Car: ${rentalData.carName}\n• Pickup: ${rentalData.pickupLocation} on ${rentalData.pickupDate}\n• Dropoff: ${rentalData.dropoffLocation} on ${rentalData.dropoffDate}\n• Total: $${rentalData.totalPrice}\n\nKeep this rental ID for reference: **${rentalData.rentalId}**\n\nIs there anything else I can help you with?`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, confirmMsg]);
        sessionStorage.removeItem("paymentConfirmed");
      }
    };
    checkPaymentStatus();
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, scrollToBottom]);

  // Sync cart from context
  useEffect(() => {
    const syncCart = async () => {
      if (rentItems.length === 0) {
        setCartItems([]);
        return;
      }

      try {
        const response = await fetch(`${CHATBOT_URL}/api/cart?slugs=${rentItems.join(",")}`);
        const data = await response.json();
        if (data.cars) {
          setCartItems(data.cars);
        }
      } catch (error) {
        console.error("Failed to sync cart:", error);
      }
    };

    syncCart();
  }, [rentItems]);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    const lowerMessage = message.toLowerCase();
    const shouldBookThis = lowerMessage.includes("book this car") || lowerMessage.includes("rent this car");
    const shouldListRentable = lowerMessage.includes("show my rent") || lowerMessage.includes("show rentable") || lowerMessage.includes("my rentals") || lowerMessage.includes("show my car") || lowerMessage.includes("my car");
    const shouldCheckout = lowerMessage.includes("checkout") || lowerMessage.includes("proceed to payment") || lowerMessage.includes("rent now");
    const bookSpecificMatch = lowerMessage.match(/book\s+(?:my\s+)?(?:the\s+)?(.+?)\s+car/i);
    const CHATBOT_URL = process.env.CHATBOT_URL || "https://naseerahmed-morent.hf.space";

    try {
      let responseText = "";
      let responseCarData: CarData | undefined = undefined;

      // Handle "book this car" - book the last shown car
      if (shouldBookThis && lastShownCar) {
        const slug = lastShownCar.slug;
        addToRent(slug);
        setCartItems((prev) => {
          if (prev.find((item) => item.slug === slug)) return prev;
          return [...prev, lastShownCar];
        });
        responseText = `✅ **Car Booked!**\n\nI've added **${lastShownCar.title}** to your rental cart.\n\n• Category: ${lastShownCar.category}\n• Price: $${lastShownCar.price}/day\n${lastShownCar.discount ? `• Discounted: $${lastShownCar.discount}/day` : ""}\n\nWould you like to proceed to payment?`;
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: responseText,
          timestamp: new Date(),
          carData: lastShownCar,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }

      // Handle "book my [name] car" and "book [name] car" - book specific car by name
      if (bookSpecificMatch) {
        const carName = bookSpecificMatch[1].trim();
        try {
          const carResponse = await fetch(`${CHATBOT_URL}/api/cart?search=${encodeURIComponent(carName)}`);
          const carData = await carResponse.json();
          if (carData.cars && carData.cars.length > 0) {
            const car = carData.cars[0];
            const slug = car.slug || car.slug.current;
            const carInfo: CarData = {
              slug: slug,
              title: car.title,
              category: car.category,
              price: car.price,
              discount: car.discount,
            };
            addToRent(slug);
            setCartItems((prev) => {
              if (prev.find((item) => item.slug === slug)) return prev;
              return [...prev, carInfo];
            });
            setLastShownCar(carInfo);
            responseText = `✅ **Car Booked!**\n\nI've added **${car.title}** to your rental cart.\n\n• Category: ${car.category}\n• Price: $${car.price}/day\n${car.discount ? `• Discounted: $${car.discount}/day` : ""}\n\nWould you like to proceed to payment?`;
            const assistantMessage: Message = {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              content: responseText,
              timestamp: new Date(),
              carData: carInfo,
            };
            setMessages((prev) => [...prev, assistantMessage]);
            setIsLoading(false);
            return;
          } else {
            responseText = `I couldn't find a car named "${carName}". Would you like me to search for available cars instead?`;
          }
        } catch (err) {
          console.error("Book car error:", err);
          responseText = `I couldn't find a car named "${carName}". Would you like me to search for available cars instead?`;
        }
      }

// Handle "show my rentals" or "rentable cars"
      if (shouldListRentable) {
        if (rentItems.length > 0) {
          const carDetails = cartItems.map((item, idx) => `${idx + 1}. **${item.title}** - $${item.price}/day (${item.category})`).join("\n");
          responseText = `📋 **Your Current Rentals:**\n\n${carDetails}\n\nTotal: $${cartTotal.toFixed(2)}/day\n\nWould you like to:\n• Proceed to payment\n• Add more cars\n• Remove any car from the list`;
        } else {
          responseText = `📋 **Your Rentals**\n\nYou don't have any cars in your rental list yet. Would you like me to show you available cars?`;
        }
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: responseText,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }

      // Handle "show my favorites" - show user's favorite cars
      if (lowerMessage.includes("show my favorite") || lowerMessage.includes("my favorite car") || lowerMessage.includes("favorite cars")) {
        if (favorites.length > 0) {
          const favDetails = favorites.map((car, idx) => `${idx + 1}. **${car.title}** - $${car.price}/day (${car.category})`).join("\n");
          responseText = `❤️ **Your Favorite Cars:**\n\n${favDetails}\n\nWould you like to:\n• Rent any of these cars\n• Remove any from favorites\n• See more available cars`;
        } else {
          responseText = `❤️ **Your Favorites**\n\nYou haven't added any cars to your favorites yet. Browse cars and tap the heart icon to save them here!`;
        }
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: responseText,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }

      // Handle "checkout" or "rent now" - redirect to billing
      if (shouldCheckout) {
        if (rentItems.length > 0) {
          responseText = `🚗 **Ready for Checkout!**\n\nYou have **${rentItems.length} car(s)** in your rental list:\n\n${cartItems.map((item, idx) => `${idx + 1}. **${item.title}** - $${item.price}/day`).join("\n")}\n\n**Total:** $${cartTotal.toFixed(2)}/day\n\nTaking you to checkout...`;
          const assistantMessage: Message = {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: responseText,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setIsLoading(false);
          window.location.href = "/billing";
          return;
        } else {
          responseText = `⚠️ **No Cars Selected!**\n\nYou don't have any cars in your rental list yet. Here's how to add cars:\n\n1. **Browse cars** - Tell me "show me SUVs" or "show me sedans"\n2. **Pick a car** - Say "book this car" after I show you one\n3. **Or say "book [car name] car"** - Like "book Toyota car"\n\nWould you like me to show you available cars?`;
          const assistantMessage: Message = {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: responseText,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setIsLoading(false);
          return;
        }
      }

      // Normal chat request
      const response = await fetch(`${CHATBOT_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          session_id: sessionId,
          cart_slugs: [...rentItems],
          user_id: user?.id,
          user_email: user?.primaryEmailAddress?.emailAddress,
          user_name: user?.fullName,
          user_preferences: userPreferences,
        }),
      });

      const data = await response.json();
      responseText = data.response || "I'm sorry, I couldn't process that request.";

      // Parse tool call responses and sync with chat context
      let parsed: { success?: boolean; action?: string; car?: any; cars?: any[]; message?: string; rentalData?: any } | null = null;
      try {
        parsed = JSON.parse(responseText);

        if (parsed && parsed.success && parsed.action === "add" && parsed.car) {
          const carSlug = parsed.car.slug;
          const carInfo: CarData = {
            slug: carSlug,
            title: parsed.car.title,
            category: parsed.car.category,
            price: parsed.car.price,
            discount: parsed.car.discount,
            imageUrl: parsed.car.imageUrl,
          };
          setLastShownCar(carInfo);
          responseCarData = carInfo;
          addToRent(carSlug);
          setCartItems((prev) => {
            if (prev.find((item) => item.slug === carSlug)) return prev;
            return [...prev, carInfo];
          });
        }

        if (parsed && parsed.success && parsed.action === "remove" && parsed.car) {
          const carSlug = parsed.car.slug;
          removeFromRent(carSlug);
          setCartItems((prev) => prev.filter((item) => item.slug !== carSlug));
          responseText = `${parsed.message}\n\nI've removed **${parsed.car.title}** from your rental selection.`;
        }

        if (parsed && parsed.success && parsed.action === "create_rental" && parsed.car) {
          sessionStorage.setItem("chatRental", JSON.stringify(parsed.rentalData));
          responseText = `${parsed.message}\n\n👉 [Proceed to Payment](/billing/${parsed.car.slug})`;
        }

        if (parsed && parsed.success && parsed.action === "search_cars" && parsed.cars) {
          if (parsed.cars.length > 0) {
            const shownCar = parsed.cars[0];
            setLastShownCar({
              slug: shownCar.slug,
              title: shownCar.title,
              category: shownCar.category,
              price: shownCar.price,
              discount: shownCar.discount,
            });
            responseCarData = {
              slug: shownCar.slug,
              title: shownCar.title,
              category: shownCar.category,
              price: shownCar.price,
              discount: shownCar.discount,
            };
          }
        }

        if (parsed && parsed.success && parsed.action === "submit_review") {
          // Review submitted
        }
      } catch {
        // Not JSON, treat as regular message
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
        carData: responseCarData,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Sorry, I'm having trouble connecting to the server. Please make sure the chatbot service is running.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleAddToCart = (slug: string, title: string, price: number, discount?: number) => {
    addToRent(slug);
    const existingIndex = cartItems.findIndex((item) => item.slug === slug);
    if (existingIndex >= 0) {
      return;
    }
    setCartItems((prev) => [
      ...prev,
      { slug, title, category: "", price, discount },
    ]);
  };

  const handleRemoveFromCart = (slug: string) => {
    removeFromRent(slug);
    setCartItems((prev) => prev.filter((item) => item.slug !== slug));
  };

  const handleCheckout = () => {
    window.location.href = "/billing";
  };

  const cartTotal = cartItems.reduce((sum, item) => {
    const price = item.discount && Number(item.discount) < Number(item.price)
      ? Number(item.discount)
      : Number(item.price);
    return sum + price;
  }, 0);

  // Enhanced markdown to HTML converter
  const renderMarkdown = (text: string) => {
    let html = text;
    // Convert [text](url) to <a>
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-[#3563E9] underline font-semibold hover:text-[#2A4EB8]">$1</a>');
    // Convert **bold** to <strong>
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:700">$1</strong>');
    // Convert ~~strikethrough~~ to <del>
    html = html.replace(/~~(.+?)~~/g, '<del style="text-decoration:line-through;opacity:0.6">$1</del>');
    // Convert `code` to styled span
    html = html.replace(/`(.+?)`/g, '<span style="background:#f3f4f6;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:12px">$1</span>');
    // Convert newlines to <br>
    html = html.replace(/\n/g, "<br/>");
    // Fix multiple <br/> 
    html = html.replace(/(<br\/>){3,}/g, "<br/>");
    return { __html: html };
  };

  if (!isSignedIn) {
    return null;
  }

  const greeting = user?.fullName 
    ? `Hi ${user.fullName}! 👋`
    : "Hello! I'm your car rental assistant.";

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-50 w-16 h-16 rounded-full bg-[#3563E9] shadow-lg flex items-center justify-center transition-all hover:bg-[#2A4EB8] ${
          position === "bottom-right" ? "bottom-6 right-6" : "bottom-6 left-6"
        }`}
        style={{ bottom: "24px", [position === "bottom-right" ? "right" : "left"]: "24px" }}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M21 11.5C21 16.1944 16.9706 20 12 20C10.7626 20 9.59231 19.718 8.52589 19.2069L3 21L4.82258 16.4673C4.26546 15.4024 4 14.2225 4 13C4 8.02944 8.02944 4 13 4C17.9706 4 22 8.02944 22 13C22 17.9706 17.9706 22 13 22C11.7626 22 10.5923 21.718 9.52589 21.2069L3 23L4.82258 18.4673C4.26546 17.4024 4 16.2225 4 15C4 14.7824 4.01731 14.5692 4.0479 14.3611" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {cartItems.length > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {cartItems.length}
          </span>
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed z-50 w-[360px] max-w-[calc(100vw-48px)] h-[500px] max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{
          bottom: "96px",
          [position === "bottom-right" ? "right" : "left"]: "24px",
          maxHeight: "calc(100vh - 120px)",
        }}
      >
        {/* Header */}
        <div className="bg-[#3563E9] text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Car Rental Assistant 🚗</h3>
            <p className="text-sm text-blue-100">
              {isLoading ? "Thinking..." : "Online - Ask me anything!"}
            </p>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-blue-600 rounded-lg transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 border-b">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#3563E9]">
                  <path d="M3 3H5L5.4 7M7 13H20L21 8H5.4M7 13L5.4 7M7 13L4.5 15.5M20 16L18.5 14M20 16H8M20 16L18.5 18.5M9 21H20V19C20 17.9 19.1 17 18 17H8C6.9 17 6 17.9 6 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm text-[#3563E9] font-medium">{cartItems.length} car(s) selected</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#1A202C]">${cartTotal.toFixed(2)}/day</span>
                <a href="/billing" className="text-sm text-[#3563E9] hover:underline font-medium">
                  Book Now
                </a>
              </div>
            </div>
            <div className="text-xs text-gray-500 truncate">
              {cartItems.map(item => item.title).join(", ")}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  msg.role === "user"
                    ? "bg-[#3563E9] text-white rounded-br-md"
                    : "bg-white text-[#1A202C] rounded-bl-md shadow-sm border border-gray-100"
                }`}
                style={{ wordBreak: "break-word" }}
              >
                <div
                  className="text-sm leading-relaxed chat-message"
                  dangerouslySetInnerHTML={renderMarkdown(msg.content)}
                />
                <p className={`text-xs mt-1 ${msg.role === "user" ? "text-blue-200" : "text-gray-400"}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-md shadow-sm border border-gray-100 px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-2 border-t bg-white flex gap-2 flex-wrap">
          <button
            onClick={() => sendMessage("Browse all cars")}
            className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition"
          >
            Browse All
          </button>
          <button
            onClick={() => sendMessage("Show me SUV cars")}
            className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition"
          >
            SUVs
          </button>
          <button
            onClick={() => sendMessage("Show me Sedan cars")}
            className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition"
          >
            Sedans
          </button>
          <button
            onClick={() => sendMessage("Show me trucks")}
            className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition"
          >
            Trucks
          </button>
          <button
            onClick={() => sendMessage("Electric vehicles")}
            className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition"
          >
            Electric
          </button>
          <button
            onClick={() => sendMessage("My favorites")}
            className="text-xs px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-[#3563E9] rounded-full transition"
          >
            My Favorites
          </button>
          <button
            onClick={() => sendMessage("My rentals")}
            className="text-xs px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-[#3563E9] rounded-full transition"
          >
            My Rentals
          </button>
          <button
            onClick={() => sendMessage("I need help")}
            className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition"
          >
            Help
          </button>
          {cartItems.length > 0 && (
            <button
              onClick={handleCheckout}
              className="text-xs px-3 py-1.5 bg-[#3563E9] text-white hover:bg-[#2A4EB8] rounded-full transition"
            >
              Book Now ({cartItems.length})
            </button>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white rounded-b-2xl">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about cars, prices, or booking..."
              className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-[#3563E9] text-sm"
            />
            <button
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              className="w-10 h-10 bg-[#3563E9] hover:bg-[#2A4EB8] disabled:bg-gray-300 rounded-full flex items-center justify-center transition"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}