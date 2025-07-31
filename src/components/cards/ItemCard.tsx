"use client";
import React, { useState } from "react";
import MealTimeCard from "./MealTimeCard";

// Define types
type MealTimeKey = "breakfast" | "lunch" | "dinner";

interface MealTime {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  editable: boolean;
}

interface Item {
  id: number;
  name: string;
  price: number;
  unite: string;
  mdn: MealTime;
}

interface ItemCardProps {
  item: Item;
  onChange: (id: number, mealSelection: Record<MealTimeKey, boolean>) => void;
}

const MEAL_TIMES: Record<MealTimeKey, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};

const ItemCard: React.FC<ItemCardProps> = ({ item, onChange }) => {
  const [isSelected, setIsSelected] = useState(false);
  const [mealSelection, setMealSelection] = useState<
    Record<MealTimeKey, boolean>
  >({
    breakfast: false,
    lunch: false,
    dinner: false,
  });

  const onToggle = () => {
    const newSelected = !isSelected;
    setIsSelected(newSelected);

    // When selected, apply item's mdn values
    setMealSelection(
      newSelected
        ? {
            breakfast: item.mdn.breakfast,
            lunch: item.mdn.lunch,
            dinner: item.mdn.dinner,
          }
        : {
            breakfast: false,
            lunch: false,
            dinner: false,
          }
    );
    // Call onChange if provided
    if (onChange) {
      onChange(item.id, {
        breakfast: item.mdn.breakfast,
        lunch: item.mdn.lunch,
        dinner: item.mdn.dinner,
      });
    }
  };

  const onMealChange = (
    _id: number,
    mealTime: MealTimeKey,
    checked: boolean
  ) => {
    setMealSelection((prev) => ({
      ...prev,
      [mealTime]: checked,
    }));
  };

  return (
    <div
      className={`border rounded-lg p-4 shadow transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <label className="flex items-center gap-3 mb-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 hidden"
          aria-describedby={`item-${item.id}-price`}
        />
        <div className="flex-1">
          <span className="font-medium text-sm text-gray-900 block">
            {item.name}
          </span>
          <p
            id={`item-${item.id}-price`}
            className="text-xs text-gray-600 mt-1"
          >
            {item.price} টাকা / {item.unite}
          </p>
        </div>
      </label>

      {isSelected && item.mdn && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex gap-3 flex-wrap text-xs">
            {(Object.keys(MEAL_TIMES) as MealTimeKey[]).map((mealTime) => (
              <MealTimeCard
                key={mealTime}
                id={item.id}
                mealTime={mealTime}
                disabled={!item.mdn.editable}
                checked={mealSelection[mealTime]}
                onChange={onMealChange}
              />
            ))}
          </div>
          {!item.mdn.editable && (
            <p className="text-xs text-gray-500 mt-2 italic">
              * Meal times are preset for this item
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemCard;
