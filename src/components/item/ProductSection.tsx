"use client";
import { CategoryMap, MealTime } from "@/types";
import React, { useEffect } from "react";
import { CategoryCard } from "./CategoryCard";

export interface ProductSectionProps {
  selectedData: CategoryMap;
  setSelectedData: React.Dispatch<React.SetStateAction<CategoryMap>>;
  setTotalPrice: (total: number) => void;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  selectedData,
  setSelectedData,
  setTotalPrice,
}) => {
  const toggleMeal = (categoryId: number, itemId: number, meal: MealTime) => {
    setSelectedData((prev) => {
      const item = prev[categoryId]?.items[itemId];
      if (!item) return prev;
      console.log(item);

      return {
        ...prev,
        [categoryId]: {
          ...prev[categoryId],
          items: {
            ...prev[categoryId].items,
            [itemId]: {
              ...item,
              bld: meal,
            },
          },
        },
      };
    });
  };

  const handlePriceChange = (
    categoryId: number,
    itemId: number,
    newPrice: number
  ) => {
    setSelectedData((prev) => {
      const item = prev[categoryId]?.items[itemId];
      if (!item) return prev;
      return {
        ...prev,
        [categoryId]: {
          ...prev[categoryId],
          items: {
            ...prev[categoryId].items,
            [itemId]: {
              ...item,
              pp: newPrice,
            },
          },
        },
      };
    });
  };

  const handleTotalPriceChange = React.useCallback(
    (categoryId: number, itemId: number) => {
      const item = selectedData[categoryId]?.items[itemId];
      if (!item) return 0;

      const bld = item.bld || {};
      const totalMeals =
        (bld.breakfast ? 1 : 0) + (bld.lunch ? 1 : 0) + (bld.dinner ? 1 : 0);

      const pricePerMeal = item.pp || 0;

      return pricePerMeal * totalMeals;
    },
    [selectedData]
  );

  useEffect(() => {
    let newTotal = 0;

    Object.values(selectedData).forEach((category) => {
      Object.values(category.items).forEach((item) => {
        const subTotalPrice = handleTotalPriceChange(category.id, item.id);
        newTotal += subTotalPrice;
      });
    });

    setTotalPrice(newTotal);
  }, [selectedData, handleTotalPriceChange, setTotalPrice]);

  return (
    <div className="w-full min-h-screen">
      <div className="w-full lg:max-w-7xl mx-auto space-y-4 p-4">
        {Object.values(selectedData).map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onItemToggle={(itemId, bld) => toggleMeal(category.id, itemId, bld)}
            onPriceChange={(itemId, pp) => {
              handlePriceChange(category.id, itemId, pp);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
