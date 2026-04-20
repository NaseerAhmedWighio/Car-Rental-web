"use client";

import ProductCard from "../Components/ProductCard";
import Selector from "../Components/Selector";
import CategoryTag from "../Components/CategoryTag";
import { useCategory } from "../Components/CategoryContext";
import { useCart } from "../Components/cartContext";

const CategoryPage = () => {
  const { addToRent, removeFromRent, isInRent } = useCart();
  const { filteredCars } = useCategory();
  
  const handleAddToCart = (slug: string): void => {
    if (isInRent(slug)) {
        removeFromRent(slug);
    } else {
        addToRent(slug);
    }
};

  return (
    <div>
      <main className="w-full min-h-[40vh] md:min-h-[70vh] bg-[#F6F7F9]">
        <div className="flex flex-col xl:flex-row">
          {/* Sidebar - hidden on mobile/tablet, visible on xl screens */}
          <div className="hidden xl:block w-1/6 2xl:w-96 min-h-screen bg-white p-6 lg:p-8 xl:p-10 overflow-y-auto">
            <CategoryTag />
          </div>
          
          {/* Main content */}
          <div className="w-full xl:w-5/6 h-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8">
            <Selector />
            {filteredCars.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64 sm:h-72 bg-white rounded-lg shadow-md mt-4">
                <p className="text-xl sm:text-2xl font-semibold text-gray-400 mb-2">No cars found</p>
                <p className="text-sm sm:text-base text-gray-500">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 justify-items-center mt-6 sm:mt-8">
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
                    link={`/details/${car.slug}`}
                    link2={`/billing/${car.slug}`}
                    onAddToCart={() => handleAddToCart(car.slug)}
                    isInCart={isInRent(car.slug)}
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
