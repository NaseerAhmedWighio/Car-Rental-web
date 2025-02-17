"use client";

import Header from "../Components/Header";
import ProductCard from "../Components/ProductCard";
import Selector from "../Components/Selector";
import CategoryTag from "../Components/CategoryTag";
import { useCategory } from "../Components/CategoryContext";
import { useCart } from "../Components/cartContext";

const CategoryPage = () => {
  const { cartSlugs, addToCart, removeFromCart } = useCart(); // Use context
  const { filteredCars } = useCategory(); // ✅ Use filtered cars from context
  const handleAddToCart = (slug: string): void => {
    if (cartSlugs.has(slug)) {
        removeFromCart(slug); // Remove if already in the cart
    } else {
        addToCart(slug); // Add to the cart
    }
};

  return (
    <div>
      <Header />
      <main className="w-full h-auto bg-[#F6F7F9]">
        <div className="flex justify-between">
          <div className="hidden xl:block w-96 min-h-screen max-h-auto space-y-12 bg-white p-10">
            <CategoryTag />
          </div>
          <div className="w-full h-auto pt-4 md:py-10 lg:py-14 -space-y-10 md:-space-y-2 lg:space-y-0">
            <Selector />
            {filteredCars.length === 0 ? (
              <p className="text-2xl text-center font-semibold py-40">No cars found for selected filter.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10 scale-90">
                {filteredCars.map((car) => (
                  <ProductCard
                    key={car.slug}
                    id={car.id}
                    slug={car.slug}
                    title={car.title}
                    category={car.category}
                    capacity={car.capacity}
                    image={car.image}
                    fuel={car.fuel}
                    type={car.type}
                    price={car.price}
                    discount={car.discount}
                    link={`../details/${car.slug}`}
                    onAddToCart={() => handleAddToCart(car.slug)}
                    isInCart={cartSlugs.has(car.slug)} // Check if in cart
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;