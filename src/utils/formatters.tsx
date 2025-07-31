// utils/formatters.tsx

/**
 * Formats a number as Bengali currency
 * @param amount - The amount to format
 * @param showSymbol - Whether to include the ৳ symbol
 * @returns Formatted currency string
 */
export const formatBengaliCurrency = (
  amount: number,
  showSymbol: boolean = true
): string => {
  const formatted = amount.toLocaleString("en-BD");
  return showSymbol ? `৳${formatted}` : formatted;
};

/**
 * Formats a date for Bengali locale
 * @param date - The date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatBengaliDate = (
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("bn-BD", options);
};

// utils/validation.ts

import { MessDaySettings } from "../types";

/**
 * Validates budget input values
 * @param budgetPerStudent - Budget per student
 * @param totalStudents - Total number of students
 * @returns Validation result with errors if any
 */
export const validateBudgetInputs = (
  budgetPerStudent: number,
  totalStudents: number
) => {
  const errors: string[] = [];

  if (budgetPerStudent < 0) {
    errors.push("Budget per student cannot be negative");
  }

  if (totalStudents < 0) {
    errors.push("Total students cannot be negative");
  }

  if (budgetPerStudent > 0 && totalStudents === 0) {
    errors.push("Please specify the number of students");
  }

  if (budgetPerStudent === 0 && totalStudents > 0) {
    errors.push("Please specify budget per student");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates meal day settings
 * @param messDay - Mess day settings
 * @returns Validation result
 */
export const validateMessDaySettings = (messDay: MessDaySettings) => {
  const hasAtLeastOneMeal = Object.values(messDay).some(Boolean);

  return {
    isValid: hasAtLeastOneMeal,
    errors: hasAtLeastOneMeal ? [] : ["At least one meal time must be active"],
  };
};

/**
 * Validates meal selections
 * @param mealSelections - Current meal selections
 * @param messDay - Active mess day settings
 * @returns Validation result
 */
export const validateMealSelections = (
  mealSelections: MealSelections,
  messDay: MessDaySettings
) => {
  const errors: string[] = [];
  const selections = Object.entries(mealSelections);

  if (selections.length === 0) {
    return {
      isValid: false,
      errors: ["Please select at least one food item"],
    };
  }

  // Check if selected meal times align with active mess days
  for (const [itemId, selection] of selections) {
    const hasValidMealTime =
      (selection.morning && messDay.morning) ||
      (selection.afternoon && messDay.afternoon) ||
      (selection.night && messDay.night);

    if (!hasValidMealTime) {
      errors.push(`Item ${itemId} has no valid meal times selected`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// utils/calculations.ts

import { FOOD_CATEGORIES } from "../constants";
import { MealSelections } from "../types";

/**
 * Calculates total cost for selected items
 * @param selectedItems - Set of selected item IDs
 * @returns Total cost
 */
export const calculateTotalCost = (selectedItems: Set<number>): number => {
  return Array.from(selectedItems).reduce((total, itemId) => {
    const item = FOOD_CATEGORIES.flatMap((cat) => cat.items).find(
      (item) => item.id === itemId
    );
    return total + (item?.price || 0);
  }, 0);
};

/**
 * Calculates cost breakdown by category
 * @param selectedItems - Set of selected item IDs
 * @returns Object with category names as keys and costs as values
 */
export const calculateCostByCategory = (selectedItems: Set<number>) => {
  const breakdown: Record<string, number> = {};

  FOOD_CATEGORIES.forEach((category) => {
    const categoryTotal = category.items
      .filter((item) => selectedItems.has(item.id))
      .reduce((sum, item) => sum + item.price, 0);

    if (categoryTotal > 0) {
      breakdown[category.title] = categoryTotal;
    }
  });

  return breakdown;
};

/**
 * Calculates meal time distribution
 * @param mealSelections - Current meal selections
 * @returns Distribution of items across meal times
 */
export const calculateMealTimeDistribution = (
  mealSelections: MealSelections
) => {
  const distribution = {
    morning: 0,
    afternoon: 0,
    night: 0,
  };

  Object.values(mealSelections).forEach((selection) => {
    if (selection.morning) distribution.morning++;
    if (selection.afternoon) distribution.afternoon++;
    if (selection.night) distribution.night++;
  });

  return distribution;
};

// utils/storage.ts

/**
 * Storage utility for persisting user preferences
 * Note: Only works in browser environment
 */
export const storage = {
  /**
   * Saves budget preferences to localStorage
   */
  saveBudgetPreferences: (budgetPerStudent: number, totalStudents: number) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "mess_budget_preferences",
          JSON.stringify({
            budgetPerStudent,
            totalStudents,
            lastUpdated: new Date().toISOString(),
          })
        );
      } catch (error) {
        console.warn("Failed to save budget preferences:", error);
      }
    }
  },

  /**
   * Loads budget preferences from localStorage
   */
  loadBudgetPreferences: () => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("mess_budget_preferences");
        return saved ? JSON.parse(saved) : null;
      } catch (error) {
        console.warn("Failed to load budget preferences:", error);
        return null;
      }
    }
    return null;
  },

  /**
   * Saves mess day preferences to localStorage
   */
  saveMessDayPreferences: (messDay: MessDaySettings) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "mess_day_preferences",
          JSON.stringify({
            ...messDay,
            lastUpdated: new Date().toISOString(),
          })
        );
      } catch (error) {
        console.warn("Failed to save mess day preferences:", error);
      }
    }
  },

  /**
   * Loads mess day preferences from localStorage
   */
  loadMessDayPreferences: () => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("mess_day_preferences");
        if (saved) {
          const { lastUpdated, ...messDay } = JSON.parse(saved);
          return messDay;
        }
      } catch (error) {
        console.warn("Failed to load mess day preferences:", error);
      }
    }
    return null;
  },
};
