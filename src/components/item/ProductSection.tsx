"use client";
import { Category, MealTime, SelectedItems } from "@/types";
import React, { useEffect } from "react";
import { CategoryCard } from "./CategoryCard";

export interface ProductSectionProps {
  data: Category[] | [];
  selectedItems: SelectedItems;
  toggleMeal: (productId: string, meal: keyof MealTime) => void;
  onPriceChange: (productId: string, price: number) => void;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  data,
  selectedItems,
  toggleMeal,
  onPriceChange,
}) => {
  return (
    <div className="w-full min-h-screen">
      <div className="w-full lg:max-w-7xl mx-auto space-y-4 p-4">
        {data.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            selectedItems={selectedItems}
            toggleMeal={toggleMeal}
            onPriceChange={onPriceChange}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
