// components/CategorySection.tsx

import React from "react";
import { ItemCard } from "./ItemCard";
import {
  Category,
  MealSelections,
  ItemToggleHandler,
  MealChangeHandler,
} from "../types";

interface CategorySectionProps {
  /** The category data to display */
  category: Category;
  /** Set of currently selected item IDs */
  selectedItems: Set<number>;
  /** Current meal selections for all items */
  mealSelections: MealSelections;
  /** Handler for toggling item selection */
  onItemToggle: ItemToggleHandler;
  /** Handler for meal time changes */
  onMealChange: MealChangeHandler;
}

/**
 * CategorySection Component
 *
 * Displays a category of food items with a title and grid of item cards.
 * Handles the layout and organization of items within a category.
 *
 * Features:
 * - Category title with styled border
 * - Responsive grid layout for items
 * - Passes selection state to individual item cards
 * - Optimized rendering with proper key props
 *
 * @param props - Component props
 * @returns JSX element representing a food category section
 */
export const CategorySection: React.FC<CategorySectionProps> = React.memo(
  ({ category, selectedItems, mealSelections, onItemToggle, onMealChange }) => {
    return (
      <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        {/* Category Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 pb-2 border-b border-gray-200">
            {category.title}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {category.items.length} items available
          </p>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {category.items.map((item) => {
            const isSelected = selectedItems.has(item.id);
            const mealSelection = mealSelections[item.id] || {
              morning: false,
              afternoon: false,
              night: false,
            };

            return (
              <ItemCard
                key={item.id}
                item={item}
                isSelected={isSelected}
                mealSelection={mealSelection}
                onToggle={onItemToggle}
                onMealChange={onMealChange}
              />
            );
          })}
        </div>

        {/* Empty State (if no items) */}
        {category.items.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4a1 1 0 00-1-1H9a1 1 0 00-1 1v1"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">
              No items available in this category
            </p>
          </div>
        )}
      </section>
    );
  }
);

CategorySection.displayName = "CategorySection";
