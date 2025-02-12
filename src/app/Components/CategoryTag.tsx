import { useCategory } from "@/app/Components/CategoryContext";
import CheckboxFilter from "@/app/Components/CheckboxFilter";
import { useRouter } from "next/navigation";

const CategoryTag = () => {
  const {
    cars,
    activeCategories,
    setActiveCategories,
    activeCapacities,
    setActiveCapacities,
    price,
    setPrice,
  } = useCategory();
  const router = useRouter();

  const toggleCategory = (category: string) => {
    setActiveCategories([category]);
    router.replace("/category"); // ✅ Avoids full reload
  };

  const toggleCapacity = (capacity: string) => {
    setActiveCapacities([capacity.replace(" Person", "")]);
    router.replace("/category"); // ✅ Avoids full reload
  };

  const sortedCapacities: string[] = [...new Set(cars.map((car) => parseInt(car.capacity)))]
    .filter((c) => !isNaN(c))
    .sort((a, b) => a - b)
    .map((c) => `${c} Person`);

  return (
    <div className="w-full h-auto bg-white lg:p-10 p-2">
      <div className="flex flex-col space-y-8">
        <div>
          <h3 className="mb-3 text-[#90A3BF] text-[12px] font-semibold">TYPE</h3>
          <CheckboxFilter 
            options={[...new Set(cars.map((car) => car.category))]} 
            activeFilters={activeCategories} 
            onChange={toggleCategory} 
          />
        </div>
        <div>
          <h3 className="mb-3 text-[#90A3BF] text-[12px] font-semibold">CAPACITY</h3>
          <CheckboxFilter 
  options={sortedCapacities} 
  activeFilters={activeCapacities.map(c => `${c} Person`)} // Ensure format matches
  onChange={toggleCapacity} 
/>
        </div>
        <div className="w-full">
          <h3 className="mb-3 text-[#90A3BF] text-[12px] font-semibold">Max Price: ${price}</h3>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            className="w-full" 
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryTag;
