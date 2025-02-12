import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Car {
    id: string; // Added a fallback for slug if ID is not available
    slug: "slug.current";
    title: string;
    category: string;
    image: string; // Updated to handle Sanity image objects
    fuel: string;
    type: string;
    capacity: string;
    price: number;
    discount?: number;
    link?: string; // Added optional link prop
  }

interface FavoritesContextProps {
  favorites: Car[];
  addToFavorites: (car: Car) => void;
  removeFromFavorites: (carId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Car[]>([]);

  const addToFavorites = (car: Car) => {
    if (!favorites.some((f) => f.id === car.id)) {
      setFavorites((prev) => [...prev, car]);
    }
  };

  const removeFromFavorites = (carId: string) => {
    setFavorites((prev) => prev.filter((car) => car.id !== carId));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
