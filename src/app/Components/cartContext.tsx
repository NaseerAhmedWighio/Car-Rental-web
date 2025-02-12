// "use client";
// import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// // Define the context structure
// interface CartContextProps {
//   cartSlugs: Set<string>;
//   addToCart: (slug: string) => void;
//   removeFromCart: (slug: string) => void;
// }

// // Create the context
// const CartContext = createContext<CartContextProps | undefined>(undefined);

// // Create the provider component
// export const CartProvider = ({ children }: { children: ReactNode }) => {
//   const [cartSlugs, setCartSlugs] = useState<Set<string>>(new Set());

//   const addToCart = (slug: string) => {
//     setCartSlugs((prev) => new Set(prev).add(slug));
//   };

//   const removeFromCart = (slug: string) => {
//     setCartSlugs((prev) => {
//       const updatedSet = new Set(prev);
//       updatedSet.delete(slug);
//       return updatedSet;
//     });
//   };

//   useEffect(() => {
//         const storedCart = localStorage.getItem("cartSlugs");
//         if (storedCart) {
//           setCartSlugs(new Set(JSON.parse(storedCart)));
//         }
//       }, []);
    
//       const handleAddToCart = (slug: string): void => {
//         setCartSlugs((prevSlugs) => {
//           const updatedSlugs = new Set(prevSlugs);
    
//           if (updatedSlugs.has(slug)) {
//             updatedSlugs.delete(slug);
//           } else {
//             updatedSlugs.add(slug);
//           }
    
//           localStorage.setItem("cartSlugs", JSON.stringify([...updatedSlugs]));
//           return updatedSlugs;
//         });
//       };

//   return (
//     <CartContext.Provider value={{ cartSlugs, addToCart, removeFromCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// // Custom hook to use the context
// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within a CartProvider");
//   }
//   return context;
// };







"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the context structure
interface CartContextProps {
  cartSlugs: Set<string>;
  addToCart: (slug: string) => void;
  removeFromCart: (slug: string) => void;
}

// Create the context
const CartContext = createContext<CartContextProps | undefined>(undefined);

// Create the provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartSlugs, setCartSlugs] = useState<Set<string>>(new Set());

  // Load cart slugs from localStorage on component mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cartSlugs");
    if (storedCart) {
      setCartSlugs(new Set(JSON.parse(storedCart))); // Convert array back to Set
    }
  }, []);
  // useEffect(() => {
  //   const storedCart = localStorage.getItem("cartSlugs");
  //   if (storedCart) {
  //     setCartSlugs(new Set(JSON.parse(storedCart)));
  //   }
  // }, []);

  // Add a slug to the cart
  // const addToCart = (slug: string) => {
  //   setCartSlugs((prev) => {
  //     const updatedSet = new Set(prev).add(slug);
  //     localStorage.setItem("cartSlugs", JSON.stringify([...updatedSet]));
  //     return updatedSet;
  //   });
  // };

  // // Remove a slug from the cart
  // const removeFromCart = (slug: string) => {
  //   setCartSlugs((prev) => {
  //     const updatedSet = new Set(prev);
  //     updatedSet.delete(slug);
  //     localStorage.setItem("cartSlugs", JSON.stringify([...updatedSet]));
  //     return updatedSet;
  //   });
  // };



  const addToCart = (slug: string) => {
    setCartSlugs((prev) => {
      const updatedSet = new Set(prev).add(slug);
      localStorage.setItem("cartSlugs", JSON.stringify([...updatedSet])); // Sync to localStorage
      return updatedSet;
    });
  };
  
  const removeFromCart = (slug: string) => {
    setCartSlugs((prev) => {
      const updatedSet = new Set(prev);
      updatedSet.delete(slug);
      localStorage.setItem("cartSlugs", JSON.stringify([...updatedSet])); // Sync to localStorage
      return updatedSet;
    });
  };

  return (
    <CartContext.Provider value={{ cartSlugs, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
