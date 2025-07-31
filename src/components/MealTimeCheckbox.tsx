// components/MealTimeCheckbox.tsx

import React from "react";
import { MEAL_TIMES } from "../constants";
import { MealTime, MealChangeHandler } from "../types";

interface MealTimeCheckboxProps {
  /** Unique identifier for the item */
  id: number;
  /** The meal time (morning, afternoon, night) */
  mealTime: keyof Omit<MealTime, "editable">;
  /** Whether the checkbox is checked */
  checked: boolean;
  /** Whether the checkbox is disabled */
  disabled: boolean;
  /** Handler for meal time changes */
  onChange: MealChangeHandler;
}

/**
 * MealTimeCheckbox Component
 *
 * A checkbox component for selecting meal times for food items.
 * Displays Bengali labels for meal times and handles selection state.
 *
 * @param props - Component props
 * @returns JSX element representing a meal time checkbox
 */
export const MealTimeCheckbox: React.FC<MealTimeCheckboxProps> = React.memo(
  ({ id, mealTime, checked, disabled, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(id, mealTime, e.target.checked);
    };

    return (
      <label
        className={`flex items-center gap-1 cursor-pointer transition-colors duration-200 ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:text-blue-600"
        }`}
        aria-label={`${MEAL_TIMES[mealTime]} meal selection`}
      >
        <input
          type="checkbox"
          disabled={disabled}
          checked={checked}
          onChange={handleChange}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-colors duration-200"
        />
        <span className="text-xs select-none font-medium">
          {MEAL_TIMES[mealTime]}
        </span>
      </label>
    );
  }
);

MealTimeCheckbox.displayName = "MealTimeCheckbox";
