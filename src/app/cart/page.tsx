// "use client";
// import { useEffect, useState } from "react";
// import { client } from "@/sanity/lib/client";
// import ProductCard from "../Components/ProductCard";
// import Header from "../Components/Header";

// interface Car {
//     _id: string;
//     id: string;
//     slug: string;
//     title: string;
//     category: string;
//     image: string;
//     fuel: string;
//     type: string;
//     capacity: string;
//     price: number;
//     discount: number;
//     isInCart?:string;
// }

// export default function CartPage() {
//     const [cartSlugs, setCartSlugs] = useState<string[]>([]); // Slugs in the cart
//     const [cartData, setCartData] = useState<Car[]>([]); // Cart product data
//     const [loading, setLoading] = useState(true);

//     // Load slugs from localStorage (or use state management if available)
//     useEffect(() => {
//         const storedCart = localStorage.getItem("cartSlugs");
//         if (storedCart) {
//             setCartSlugs(JSON.parse(storedCart));
//         }
//     }, []);

//     // Fetch product data for slugs
//     useEffect(() => {
//         if (cartSlugs.length === 0) {
//             setLoading(false);
//             return;
//         }

//         const fetchCartData = async () => {
//             try {
//                 const response = await client.fetch(
//                     `*[_type in ["popular","recommended"] && slug.current in $slugs]{
//                         _id,
//                         id,
//                         "slug": slug.current,
//                         title,
//                         category,
//                         image,
//                         fuel,
//                         type,
//                         capacity,
//                         price,
//                         discount
//                     }`,
//                     { slugs: cartSlugs }
//                 );
//                 setCartData(response);
//             } catch (error) {
//                 console.error("Error fetching cart data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchCartData();
//     }, [cartSlugs]);

//     // Remove an item from the cart
//     const handleAddToCart = (slug: string) => {
//         const storedCart = localStorage.getItem("cartSlugs");
//         const cartSlugs = storedCart ? JSON.parse(storedCart) : [];
//         if (!cartSlugs.includes(slug)) {
//             cartSlugs.push(slug);
//         }
//         localStorage.setItem("cartSlugs", JSON.stringify(cartSlugs));
//     };

    

//     if (loading) {
//         return <div className="flex justify-center items-center text-blue-500 text-2xl font-semibold h-96">Loading...</div>;
//     }

//     return (
//         <>
//         <Header/>
//         <main className="w-full h-auto bg-[#F6F7F9] py-10">
//             <div className="mx-5 md:mx-8 lg:mx-20">
//                 <h1 className="w-full bg-blue-500 rounded-lg shadow-md text-[24px] font-semibold text-white text-center mb-8">Your Cart</h1>
//                 <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center">
//                     {cartData.length > 0 ? (
//                         cartData.map((car) => (
//                             <ProductCard
//                             key={car?.slug}
//                             id={car.id}
//                             slug={car?.slug}
//                             title={car.title}
//                             category={car.category}
//                             capacity={car.capacity}
//                             image={car.image}
//                             fuel={car.fuel}
//                             type={car.type}
//                             price={car.price}
//                             discount={car.discount}
//                             link={`../details/${car?.slug}`} 
//                             onAddToCart={() => handleAddToCart(car?.slug)}
//                             // isInCart={cartSlugs.has(car?.slug)}
//                         />
//                         ))
//                     ) : (
//                         <p id="empty" className="w-full place-content-center place-items-center text-blue-500 text-2xl">Your cart is empty.</p>
//                     )}
//                 </div>
//             </div>
//         </main>
//         </>
//     );
// }









// "use client";
// import { useEffect, useState } from "react";
// import { client } from "@/sanity/lib/client";
// import ProductCard from "../Components/ProductCard";
// import Header from "../Components/Header";

// interface Car {
//     _id: string;
//     id: string;
//     slug: string;
//     title: string;
//     category: string;
//     image: string;
//     fuel: string;
//     type: string;
//     capacity: string;
//     price: number;
//     discount: number;
// }

// export default function CartPage() {
//     const [cartSlugs, setCartSlugs] = useState<string[]>([]); // Slugs in the cart
//     const [cartData, setCartData] = useState<Car[]>([]); // Cart product data
//     const [loading, setLoading] = useState(true);

//     // Load slugs from localStorage (or use state management if available)
//     useEffect(() => {
//         const storedCart = localStorage.getItem("cartSlugs");
//         if (storedCart) {
//             setCartSlugs(JSON.parse(storedCart));
//         }
//     }, []);

//     // Fetch product data for slugs
//     useEffect(() => {
//         if (cartSlugs.length === 0) {
//             setLoading(false);
//             return;
//         }

//         const fetchCartData = async () => {
//             try {
//                 const response = await client.fetch(
//                     `*[_type in ["popular","recommended"] && slug.current in $slugs]{
//                         _id,
//                         id,
//                         "slug": slug.current,
//                         title,
//                         category,
//                         image,
//                         fuel,
//                         type,
//                         capacity,
//                         price,
//                         discount
//                     }`,
//                     { slugs: cartSlugs }
//                 );
//                 setCartData(response);
//             } catch (error) {
//                 console.error("Error fetching cart data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchCartData();
//     }, [cartSlugs]);

//     // Remove an item from favorites (cart)
//     const handleRemoveFromFavorites = (slug: string) => {
//         const updatedCartSlugs = cartSlugs.filter((cartSlug) => cartSlug !== slug);
//         setCartSlugs(updatedCartSlugs);
//         setCartData(cartData.filter((item) => item.slug !== slug));
//         localStorage.setItem("cartSlugs", JSON.stringify(updatedCartSlugs));
//     };

//     if (loading) {
//         return <div className="flex justify-center items-center text-blue-500 text-2xl font-semibold h-96">Loading...</div>;
//     }

//     return (
//         <>
//             <Header />
//             <main className="w-full h-auto bg-[#F6F7F9] py-10">
//                 <div className="mx-5 md:mx-8 lg:mx-20">
//                     <h1 className="w-full bg-blue-500 rounded-lg shadow-md text-[24px] font-semibold text-white text-center mb-8">
//                         Your Favorites
//                     </h1>
//                     <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center">
//                         {cartData.length > 0 ? (
//                             cartData.map((car) => (
//                                 <ProductCard
//                                     key={car?.slug}
//                                     id={car.id}
//                                     slug={car?.slug}
//                                     title={car.title}
//                                     category={car.category}
//                                     capacity={car.capacity}
//                                     image={car.image}
//                                     fuel={car.fuel}
//                                     type={car.type}
//                                     price={car.price}
//                                     discount={car.discount}
//                                     link={`../details/${car?.slug}`}
//                                     onAddToCart={() => handleRemoveFromFavorites(car?.slug)}
//                                     isInCart={true} // Pass this as true for filled heart
//                                 />
//                             ))
//                         ) : (
//                             <p id="empty" className="w-full text-center text-blue-500 text-2xl">
//                                 Your favorites are empty.
//                             </p>
//                         )}
//                     </div>
//                 </div>
//             </main>
//         </>
//     );
// }









"use client";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import ProductCard from "../Components/ProductCard";
import Header from "../Components/Header";

interface Car {
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

export default function CartPage() {
  const [cartSlugs, setCartSlugs] = useState<string[]>([]); // Cart slugs in state
  const [cartData, setCartData] = useState<Car[]>([]); // Cart data in state
  const [loading, setLoading] = useState(true);

  // Fetch cart slugs from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem("cartSlugs");
    if (storedCart) {
      setCartSlugs(JSON.parse(storedCart));
    }
  }, []);

  // Fetch product data from backend whenever cartSlugs changes
  useEffect(() => {
    if (cartSlugs.length === 0) {
      setCartData([]);
      setLoading(false);
      return;
    }

    const fetchCartData = async () => {
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
          { slugs: cartSlugs }
        );
        setCartData(response);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [cartSlugs]);

  // Add a product to the cart
  const handleAddToCart = (slug: string) => {
    if (!cartSlugs.includes(slug)) {
      const updatedCartSlugs = [...cartSlugs, slug];
      setCartSlugs(updatedCartSlugs); // Update state
      localStorage.setItem("cartSlugs", JSON.stringify(updatedCartSlugs)); // Sync localStorage
    }
  };
  console.log(handleAddToCart)
  // Remove a product from the cart
  const handleRemoveFromCart = (slug: string) => {
    const updatedCartSlugs = cartSlugs.filter((itemSlug) => itemSlug !== slug);
    setCartSlugs(updatedCartSlugs); // Update state
    localStorage.setItem("cartSlugs", JSON.stringify(updatedCartSlugs)); // Sync localStorage
  };

  // Render loading spinner if data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center text-blue-500 text-2xl font-semibold h-96">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="w-full h-auto bg-[#F6F7F9] py-10">
        <div className="mx-5 md:mx-8 lg:mx-20">
          <h1 className="w-full bg-blue-500 rounded-lg shadow-md text-[24px] font-semibold text-white text-center mb-8">
            Your Cart
          </h1>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center">
            {cartData.length > 0 ? (
              cartData.map((car) => (
                <ProductCard
                  key={car?.slug}
                  id={car.id}
                  slug={car?.slug}
                  title={car.title}
                  category={car.category}
                  capacity={car.capacity}
                  image={car.image}
                  fuel={car.fuel}
                  type={car.type}
                  price={car.price}
                  discount={car.discount}
                  link={`../details/${car?.slug}`}
                  onAddToCart={() => handleRemoveFromCart(car?.slug)} // Handle removal
                  isInCart={true} // Indicate item is in cart (e.g., for a filled heart icon)
                />
              ))
            ) : (
              <p
                id="empty"
                className="w-full text-center text-blue-500 text-2xl"
              >
               
              </p>
            )}
          </div>
          <h2 className={cartData.length==0?  `h-72 flex justify-center items-center text-2xl font-semibold text-red-700`: `hidden`}>Your cart is empty.</h2>
        </div>
      </main>
    </>
  );
}
