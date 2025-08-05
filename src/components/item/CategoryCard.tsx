import React from "react";
import { ItemCard } from "./ItemCard";
import { Category, MealTime, Product, SelectedItems } from "@/types";

interface CategoryCardProps {
  category: Category;
  selectedItems: SelectedItems;
  toggleMeal: (productId: string, meal: keyof MealTime) => void;
  onPriceChange: (productId: string, price: number) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = React.memo(
  ({ category, selectedItems, toggleMeal, onPriceChange }) => {
    return (
      <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        {/* Category Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 pb-2 border-b border-gray-200">
            {category.label}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {category.products.length} items available
          </p>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {category.products.map((product: Product) => (
            <ItemCard
              key={product.id}
              product={product}
              selectedItems={selectedItems}
              toggleMeal={toggleMeal}
              onPriceChange={onPriceChange}
            />
          ))}
        </div>
      </section>
    );
  }
);

CategoryCard.displayName = "CategoryCard";
