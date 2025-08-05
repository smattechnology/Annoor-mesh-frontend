import React from "react";
import { MealTime, Product, SelectedItems } from "@/types";

interface ItemCardProps {
  product: Product;
  selectedItems: SelectedItems;
  toggleMeal: (productId: string, meal: keyof MealTime) => void;
  onPriceChange: (productId: string, price: number) => void;
}

export const ItemCard: React.FC<ItemCardProps> = React.memo(
  ({ product, selectedItems, toggleMeal, onPriceChange }) => {
    const item = selectedItems[product.id];
    const selectSuccess =
      (item?.bld?.breakfast || item?.bld?.lunch || item?.bld?.dinner) &&
      (item?.price ?? 0) > 0;

    const selectWarning =
      (item?.bld?.breakfast || item?.bld?.lunch || item?.bld?.dinner) &&
      (item?.price ?? 0) <= 0;

    const statusClassNames = selectWarning
      ? "border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200"
      : selectSuccess
      ? "border-green-500 bg-green-50 ring-2 ring-green-200"
      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50";

    const getMealButtonClass = (meal: keyof MealTime) =>
      `w-full rounded-lg border shadow-sm p-2 flex justify-center items-center gap-1 ${
        item?.bld?.[meal] ? "bg-blue-100 border-blue-400" : ""
      }`;

    return (
      <div
        key={product.id}
        className={`border rounded-lg p-4 shadow transition-all duration-200 hover:shadow-md cursor-pointer
          ${statusClassNames}
        `}
      >
        {/* Item Details */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="mb-3">
            <h3
              id={`item-${product.id}-name`}
              className="font-semibold text-sm text-gray-900 truncate"
            >
              {product.name}
            </h3>
            <p
              id={`item-${product.id}-price`}
              className="text-xs text-gray-600 mt-1"
            >
              <span className="font-medium">
                ৳{product.price.toLocaleString()}
              </span>
              <span className="text-gray-500"> / {product.unit.label}</span>
            </p>
          </div>

          <div>
            <input
              type="number"
              value={item?.price ?? ""}
              onChange={(e) => {
                const raw = e.target.value;
                const value = parseInt(raw, 10);
                onPriceChange(product.id, !isNaN(value) ? value : 0);
              }}
              onWheel={(e) => e.currentTarget.blur()}
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                if (input.value.length > 3) {
                  input.value = input.value.slice(0, 3);
                }
                input.value = input.value.replace(/^0+(?=\d)/, "");
              }}
              className="w-15 px-2 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center no-spinner"
              placeholder="000"
              disabled={
                !item?.bld?.breakfast && !item?.bld?.lunch && !item?.bld?.dinner
              }
            />
          </div>
        </div>

        {/* Meal Toggle Buttons */}
        <div className="mt-3 flex items-center gap-2">
          <button
            className={getMealButtonClass("breakfast")}
            onClick={() => toggleMeal(product.id, "breakfast")}
          >
            <span>সকাল</span>
          </button>

          <button
            className={getMealButtonClass("lunch")}
            onClick={() => toggleMeal(product.id, "lunch")}
          >
            <span>দুপুর</span>
          </button>

          <button
            className={getMealButtonClass("dinner")}
            onClick={() => toggleMeal(product.id, "dinner")}
          >
            <span>রাত</span>
          </button>
        </div>
      </div>
    );
  }
);

ItemCard.displayName = "ItemCard";
