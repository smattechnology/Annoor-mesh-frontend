import React from "react";
import { MealTime, Product, ProductMap, Unit } from "@/types";
import { on } from "events";
import { Shuffle, Trash } from "lucide-react";

interface ItemCardProps {
  /** The food item to display */
  product: Product;
  selectedItem: {
    bld?: MealTime;
    unit?: Unit;
    quantity?: number;
  };
  auto: boolean;
  onToggle: (bld: MealTime) => void;
  omQuantityChange: (quantity: number) => void;
  // onAutoToggle: () => void;
  isAuto: boolean;
  onDelete: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = React.memo(
  ({
    product,
    selectedItem,
    onToggle,
    auto,
    omQuantityChange,
    // onAutoToggle,
    isAuto,
    onDelete,
  }) => {
    const selectSuccess =
      auto ||
      ((selectedItem.bld?.breakfast ||
        selectedItem.bld?.lunch ||
        selectedItem.bld?.dinner) &&
        (selectedItem.quantity ?? 0) > 0);

    const selectWarning =
      !auto &&
      (selectedItem.bld?.breakfast ||
        selectedItem.bld?.lunch ||
        selectedItem.bld?.dinner) &&
      (selectedItem.quantity ?? 0) <= 0;

    const statusClassNames = selectWarning
      ? "border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200"
      : selectSuccess
      ? "border-green-500 bg-green-50 ring-2 ring-green-200"
      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50";

    return (
      <div
        key={product.id}
        className={`border rounded-lg p-4 shadow transition-all duration-200
        ${statusClassNames}`}
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
                ৳{product.unit.price.toLocaleString("en-BD")}
              </span>
              <span className="text-gray-500"> / {product.unit?.label}</span>
            </p>
          </div>

          <div className="flex justify-between items-center gap-2">
            <button
              className="p-2 shadow rounded-lg border border-gray-300 hover:bg-red-100 hover:text-red-700"
              onClick={() => onDelete()}
            >
              <Trash className="h-5 w-5" />
            </button>
          </div>
        </div>

        {!isAuto && (
          <div className="w-full flex items-center gap-3">
            <div className="flex items-center gap-2 w-full">
              <label className="w-full text-sm font-medium text-gray-700">
                পরিমাণ:
              </label>

              <input
                // disabled={
                //   !selectedItem.bld?.breakfast &&
                //   !selectedItem.bld?.lunch &&
                //   !selectedItem.bld?.dinner
                // }
                type="number"
                maxLength={3}
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  if (input.value.length > 3) {
                    input.value = input.value.slice(0, 3);
                  }
                  input.value = input.value.replace(/^0+(?=\d)/, "");
                }}
                value={selectedItem.quantity ?? ""}
                onChange={(e) => {
                  const raw = e.target.value;
                  const value = parseInt(raw, 10);
                  omQuantityChange(value || 0);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   text-center no-spinner text-sm"
                placeholder="000"
              />
            </div>

            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   text-sm"
              defaultValue={product.unit.id}
            >
              {product.units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.icon} {unit.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Meal Toggle Buttons */}
        {/* <div className="mt-3 flex items-center gap-2">
          <div
            className={`w-full rounded-lg border shadow-sm p-2 flex justify-center items-center gap-1 ${
              selectedItem.bld?.breakfast
                ? "bg-blue-100 border-blue-300 text-blue-700"
                : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() =>
              onToggle({
                breakfast: !selectedItem.bld?.breakfast,
                lunch: selectedItem.bld?.lunch,
                dinner: selectedItem.bld?.dinner,
              })
            }
          >
            <span>সকাল</span>
          </div>

          <div
            className={`w-full rounded-lg border shadow-sm p-2 flex justify-center selectedItems-center gap-1 ${
              selectedItem.bld?.lunch
                ? "bg-blue-100 border-blue-300 text-blue-700"
                : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() =>
              onToggle({
                breakfast: selectedItem.bld?.breakfast,
                lunch: !selectedItem.bld?.lunch,
                dinner: selectedItem.bld?.dinner,
              })
            }
          >
            <span>দুপুর</span>
          </div>

          <div
            className={`w-full rounded-lg border shadow-sm p-2 flex justify-center items-center gap-1 ${
              selectedItem.bld?.dinner
                ? "bg-blue-100 border-blue-300 text-blue-700"
                : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() =>
              onToggle({
                breakfast: selectedItem.bld?.breakfast,
                lunch: selectedItem.bld?.lunch,
                dinner: !selectedItem.bld?.dinner,
              })
            }
          >
            <span>রাত</span>
          </div>
        </div> */}
      </div>
    );
  }
);

ItemCard.displayName = "ItemCard";
