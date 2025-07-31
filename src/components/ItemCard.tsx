// components/ItemCard.tsx

import React from "react";
import { MealTimeCheckbox } from "./MealTimeCheckbox";
import { MEAL_TIMES } from "../constants";
import { Item, MealTime, MealChangeHandler, ItemToggleHandler } from "../types";

interface ItemCardProps {
  /** The food item to display */
  item: Item;
  /** Whether this item is currently selected */
  isSelected: boolean;
  /** Current meal time selections for this item */
  mealSelection: {
    morning: boolean;
    afternoon: boolean;
    night: boolean;
  };
  /** Handler for toggling item selection */
  onToggle: ItemToggleHandler;
  /** Handler for meal time changes */
  onMealChange: MealChangeHandler;
}

/**
 * ItemCard Component
 *
 * Displays a food item with its details and meal time selection options.
 * Handles item selection and meal time configuration.
 *
 * Features:
 * - Visual feedback for selection state
 * - Price and unit display
 * - Meal time checkboxes (when selected)
 * - Disabled state for non-editable meal times
 * - Accessibility support
 *
 * @param props - Component props
 * @returns JSX element representing a food item card
 */
export const ItemCard: React.FC<ItemCardProps> = React.memo(
  ({ item, isSelected, mealSelection, onToggle, onMealChange }) => {
    const handleToggle = () => {
      onToggle(item);
    };

    const cardClassName = `
    border rounded-lg p-4 shadow transition-all duration-200 hover:shadow-md cursor-pointer
    ${
      isSelected
        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
    }
  `.trim();

    return (
      <div className={cardClassName}>
        {/* Item Selection Header */}
        <div
          className="flex items-center gap-3 mb-3"
          onClick={handleToggle}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleToggle();
            }
          }}
          aria-pressed={isSelected}
          aria-describedby={`item-${item.id}-price`}
        >
          {/* Hidden checkbox for form accessibility */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleToggle}
            className="sr-only"
            aria-labelledby={`item-${item.id}-name`}
          />

          {/* Visual checkbox indicator */}
          <div
            className={`
          w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
          ${
            isSelected
              ? "border-blue-500 bg-blue-500"
              : "border-gray-300 bg-white"
          }
        `}
          >
            {isSelected && (
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>

          {/* Item Details */}
          <div className="flex-1 min-w-0">
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
        </div>

        {/* Meal Time Selection (shown when item is selected) */}
        {isSelected && item.mdn && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex gap-3 flex-wrap">
              {(
                Object.keys(MEAL_TIMES) as Array<
                  keyof Omit<MealTime, "editable">
                >
              ).map((mealTime) => (
                <MealTimeCheckbox
                  key={mealTime}
                  id={item.id}
                  mealTime={mealTime}
                  checked={mealSelection[mealTime]}
                  disabled={!item.mdn?.editable}
                  onChange={onMealChange}
                />
              ))}
            </div>

            {/* Non-editable notice */}
            {!item.mdn.editable && (
              <div className="mt-2 flex items-center gap-1">
                <svg
                  className="w-3 h-3 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-xs text-gray-500 italic">
                  Meal times are preset for this item
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

ItemCard.displayName = "ItemCard";
