import React from "react";
import { ItemCard } from "./ItemCard";
import { Item } from "@/types";

interface CategoryCardProps {
  category: {
    id: number;
    title: string;
    items: Record<number, Item>;
  };
  onItemToggle: (
    id: number,
    bld: { breakfast?: boolean; lunch?: boolean; dinner?: boolean },
    pp?: number
  ) => void;
  onPriceChange: (itemId: number, pp: number) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = React.memo(
  ({ category, onItemToggle, onPriceChange }) => {
    return (
      <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        {/* Category Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 pb-2 border-b border-gray-200">
            {category.title}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {Object.keys(category.items).length} items available
          </p>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.values(category.items).map((item: Item) => (
            <ItemCard
              key={item.id}
              item={item}
              onToggle={(mealToggle) => onItemToggle(item.id, mealToggle)}
              onPriceChange={(pp) => {
                onPriceChange(item.id, pp);
              }}
            />
          ))}
        </div>
      </section>
    );
  }
);

CategoryCard.displayName = "CategoryCard";
