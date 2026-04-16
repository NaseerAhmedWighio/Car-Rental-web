"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useCart } from "./cartContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  carData?: any;
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

export default function ChatWidget({
  chatbotUrl = "http://localhost:8000",
  position = "bottom-right",
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your car rental assistant. How can I help you today?\n\nYou can ask me to:\n• Search for cars (SUV, Sedan, etc.)\n• Show prices and availability\n• Add cars to your cart\n• Check out and book a car\n• Leave reviews and ratings\n\nWhat would you like to do?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { cartSlugs, addToCart, removeFromCart } = useCart();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, scrollToBottom]);

  // Sync cart from context
  useEffect(() => {
    const syncCart = async () => {
      if (cartSlugs.size === 0) {
        setCartItems([]);
        return;
      }

      try {
        const response = await fetch(`/api/cart?slugs=${[...cartSlugs].join(",")}`);
        const data = await response.json();
        if (data.cars) {
          setCartItems(data.cars);
        }
      } catch (error) {
        console.error("Failed to sync cart:", error);
      }
    };

    syncCart();
  }, [cartSlugs]);

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

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          session_id: sessionId,
          cart_slugs: [...cartSlugs],
        }),
      });

      const data = await response.json();
      const rawResponse = data.response || "I'm sorry, I couldn't process that request.";

      // Parse tool call responses and sync with cart context
      try {
        const parsed = JSON.parse(rawResponse);

        // Handle add to cart
        if (parsed.success && parsed.action === "add") {
          addToCart(parsed.car.slug);
          setCartItems((prev) => {
            if (prev.find((item) => item.slug === parsed.car.slug)) return prev;
            return [...prev, parsed.car];
          });
        }

        // Handle remove from cart
        if (parsed.success && parsed.action === "remove") {
          removeFromCart(parsed.car.slug);
          setCartItems((prev) => prev.filter((item) => item.slug !== parsed.car.slug));
        }

        // Handle create rental - redirect to billing
        if (parsed.success && parsed.action === "create_rental") {
          // Store rental data in sessionStorage for billing page
          sessionStorage.setItem("chatRental", JSON.stringify(parsed.rentalData));
          // Add a clickable link in the message
          const displayMsg = `${parsed.message}\n\n👉 [Proceed to Payment](/billing/${parsed.car.slug})`;
          const assistantMessage: Message = {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: displayMsg,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setIsLoading(false);
          return;
        }

        // Handle submit review
        if (parsed.success && parsed.action === "submit_review") {
          // Review submitted, show confirmation
        }
      } catch {
        // Not JSON, treat as regular message
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: rawResponse,
        timestamp: new Date(),
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
    addToCart(slug);
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
    removeFromCart(slug);
    setCartItems((prev) => prev.filter((item) => item.slug !== slug));
  };

  const handleCheckout = () => {
    window.location.href = "/checkout";
  };

  const cartTotal = cartItems.reduce((sum, item) => {
    const price = item.discount && Number(item.discount) < Number(item.price)
      ? Number(item.discount)
      : Number(item.price);
    return sum + price;
  }, 0);

  // Simple markdown to HTML converter
  const renderMarkdown = (text: string) => {
    let html = text;
    // Convert [text](url) to <a>
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-[#3563E9] underline font-semibold hover:text-[#2A4EB8]">$1</a>');
    // Convert **bold** to <strong>
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:700">$1</strong>');
    // Convert ~~strikethrough~~ to <del>
    html = html.replace(/~~(.+?)~~/g, '<del style="text-decoration:line-through;opacity:0.6">$1</del>');
    // Convert newlines to <br>
    html = html.replace(/\n/g, "<br/>");
    return { __html: html };
  };

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
            <h3 className="font-semibold text-lg">Car Rental Assistant</h3>
            <p className="text-sm text-blue-100">Find and book your perfect car</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-blue-600 rounded-lg transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="bg-blue-50 px-4 py-2 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#3563E9]">
                <path d="M3 3H5L5.4 7M7 13H20L21 8H5.4M7 13L5.4 7M7 13L4.5 15.5M20 16L18.5 14M20 16H8M20 16L18.5 18.5M9 21H20V19C20 17.9 19.1 17 18 17H8C6.9 17 6 17.9 6 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm text-[#3563E9] font-medium">{cartItems.length} car(s) in cart</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-[#1A202C]">${cartTotal.toFixed(2)}</span>
              <a href="/checkout" className="text-sm text-[#3563E9] hover:underline font-medium">
                Checkout
              </a>
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
            onClick={() => sendMessage("Show me SUV cars")}
            className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition"
          >
            SUVs
          </button>
          <button
            onClick={() => sendMessage("Show me popular cars")}
            className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition"
          >
            Popular
          </button>
          <button
            onClick={() => sendMessage("Show me automatic cars")}
            className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition"
          >
            Automatic
          </button>
          {cartItems.length > 0 && (
            <button
              onClick={handleCheckout}
              className="text-xs px-3 py-1.5 bg-[#3563E9] text-white hover:bg-[#2A4EB8] rounded-full transition"
            >
              Checkout ({cartItems.length})
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