"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartContextProps {
  cartSlugs: Set<string>;
  addToCart: (slug: string) => void;
  removeFromCart: (slug: string) => void;
  rentItems: string[];
  addToRent: (slug: string) => void;
  removeFromRent: (slug: string) => void;
  isInRent: (slug: string) => boolean;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartSlugs, setCartSlugs] = useState<Set<string>>(new Set());
  const [rentItems, setRentItems] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem("cartSlugs");
    if (storedCart) {
      try {
        setCartSlugs(new Set(JSON.parse(storedCart)));
      } catch (e) {
        console.error("Error parsing cartSlugs:", e);
      }
    }
    
    const storedRent = localStorage.getItem("rentItems");
    if (storedRent) {
      try {
        setRentItems(JSON.parse(storedRent));
        console.log("Loaded rentItems from storage:", storedRent);
      } catch (e) {
        console.error("Error parsing rentItems:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const stored = localStorage.getItem("rentItems");
      console.log("Current rentItems state:", rentItems, "storage:", stored);
    }
  }, [rentItems, isLoaded]);

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("rentItems");
      if (stored) {
        setRentItems(JSON.parse(stored));
      }
    };
    
    window.addEventListener("rentItemsUpdated", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("rentItemsUpdated", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const addToCart = (slug: string) => {
    setCartSlugs((prev) => {
      const newSet = new Set(prev);
      newSet.add(slug);
      localStorage.setItem("cartSlugs", JSON.stringify([...newSet]));
      return newSet;
    });
  };

  const removeFromCart = (slug: string) => {
    setCartSlugs((prev) => {
      const newSet = new Set(prev);
      newSet.delete(slug);
      localStorage.setItem("cartSlugs", JSON.stringify([...newSet]));
      return newSet;
    });
  };

  const addToRent = (slug: string) => {
    if (!rentItems.includes(slug)) {
      const newItems = [...rentItems, slug];
      setRentItems(newItems);
      localStorage.setItem("rentItems", JSON.stringify(newItems));
      console.log("Added to rent:", slug, "Total:", newItems.length);
    } else {
      console.log("Already in rent:", slug);
    }
  };

  const removeFromRent = (slug: string) => {
    const newItems = rentItems.filter((s) => s !== slug);
    setRentItems(newItems);
    localStorage.setItem("rentItems", JSON.stringify(newItems));
    console.log("Removed from rent:", slug, "Remaining:", newItems.length);
  };

  const isInRent = (slug: string) => {
    return rentItems.includes(slug);
  };

  return (
    <CartContext.Provider value={{ 
      cartSlugs, 
      addToCart, 
      removeFromCart, 
      rentItems, 
      addToRent, 
      removeFromRent,
      isInRent 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};