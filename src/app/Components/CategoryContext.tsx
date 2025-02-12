"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";

interface Car {
  id: string;
  slug: string;
  title: string;
  image: string;
  fuel: string;
  type: string;
  capacity: string;
  price: number;
  discount: number;
  category: string;
}

export interface CategoryContextProps {
  cars: Car[];
  filteredCars: Car[];
  activeCategories: string[];
  setActiveCategories: (categories: string[]) => void;
  activeCapacities: string[];
  setActiveCapacities: (capacities: string[]) => void;
  price: string;
  setPrice: (price: string) => void;
}

const CategoryContext = createContext<CategoryContextProps | undefined>(undefined);

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activeCapacities, setActiveCapacities] = useState<string[]>([]);
  const [price, setPrice] = useState<string>("99");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: Car[] = await client.fetch(
          `*[_type in ["popular", "recommended"]]{
            _id, title, price, type, image, category, fuel, capacity, "slug": slug.current, discount
          }`
        );
        setCars(data);
        setFilteredCars(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...cars];

    if (activeCategories.length > 0) {
      filtered = filtered.filter((car) => activeCategories.includes(car.category));
    }

    if (activeCapacities.length > 0) {
      filtered = filtered.filter((car) => activeCapacities.includes(car.capacity.toString()));
    }

    filtered = filtered.filter((car) => car.price <= parseInt(price));
    setFilteredCars(filtered);
  }, [activeCategories, activeCapacities, price, cars]);

  return (
    <CategoryContext.Provider value={{
      cars,
      filteredCars,
      activeCategories,
      setActiveCategories,
      activeCapacities,
      setActiveCapacities,
      price,
      setPrice
    }}>
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryContext;
