import React from "react";
import { Item } from "@/types";

interface ItemCardProps {
  /** The food item to display */
  item: Item;
  onToggle: (
    bld: {
      breakfast?: boolean;
      lunch?: boolean;
      dinner?: boolean;
    },
    pp?: number
  ) => void;
  onPriceChange: (pp: number) => void;
}

export const ItemCard: React.FC<ItemCardProps> = React.memo(
  ({ item, onToggle, onPriceChange }) => {
    const selectSuccess =
      (item.bld?.breakfast || item.bld?.lunch || item.bld?.dinner) &&
      (item.pp ?? 0) > 0;

    const selectWarning =
      (item.bld?.breakfast || item.bld?.lunch || item.bld?.dinner) &&
      (item.pp ?? 0) <= 0;

    const statusClassNames = selectWarning
      ? "border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200"
      : selectSuccess
      ? "border-green-500 bg-green-50 ring-2 ring-green-200"
      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50";

    return (
      <div
        key={item.id}
        className={`border rounded-lg p-4 shadow transition-all duration-200 hover:shadow-md cursor-pointer
        ${statusClassNames}`}
      >
        {/* Item Details */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="mb-3">
            <h3
              id={`item-${item.id}-name`}
              className="font-semibold text-sm text-gray-900 truncate"
            >
              {item.name}
            </h3>
            <p
              id={`item-${item.id}-price`}
              className="text-xs text-gray-600 mt-1"
            >
              <span className="font-medium">
                ৳{item.price.toLocaleString("en-BD")}
              </span>
              <span className="text-gray-500"> / {item.unite}</span>
            </p>
          </div>

          <div>
            <input
              disabled={
                !item.bld?.breakfast && !item.bld?.lunch && !item.bld?.dinner
              }
              type="number"
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                if (input.value.length > 3) {
                  input.value = input.value.slice(0, 3);
                }

                // Remove leading zeros unless it's "0"
                input.value = input.value.replace(/^0+(?=\d)/, "");
              }}
              value={item.pp ?? ""} // Always provide a controlled value
              onChange={(e) => {
                const raw = e.target.value;
                const value = parseInt(raw, 10);
                onPriceChange(!isNaN(value) ? value : 0);
              }}
              className="w-15 px-2 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center no-spinner"
              placeholder="000"
            />
          </div>
        </div>

        {/* Meal Toggle Buttons */}
        <div className="mt-3 flex items-center gap-2">
          <div
            className={`w-full rounded-lg border shadow-sm p-2 flex justify-center items-center gap-1 ${
              item.bld?.breakfast
                ? "bg-blue-100 border-blue-300 text-blue-700"
                : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() =>
              onToggle({
                breakfast: !item.bld?.breakfast,
                lunch: item.bld?.lunch,
                dinner: item.bld?.dinner,
              })
            }
          >
            <span>সকাল</span>
          </div>

          <div
            className={`w-full rounded-lg border shadow-sm p-2 flex justify-center items-center gap-1 ${
              item.bld?.lunch
                ? "bg-blue-100 border-blue-300 text-blue-700"
                : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() =>
              onToggle({
                breakfast: item.bld?.breakfast,
                lunch: !item.bld?.lunch,
                dinner: item.bld?.dinner,
              })
            }
          >
            <span>দুপুর</span>
          </div>

          <div
            className={`w-full rounded-lg border shadow-sm p-2 flex justify-center items-center gap-1 ${
              item.bld?.dinner
                ? "bg-blue-100 border-blue-300 text-blue-700"
                : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() =>
              onToggle({
                breakfast: item.bld?.breakfast,
                lunch: item.bld?.lunch,
                dinner: !item.bld?.dinner,
              })
            }
          >
            <span>রাত</span>
          </div>
        </div>
      </div>
    );
  }
);

ItemCard.displayName = "ItemCard";
