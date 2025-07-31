// hooks/useMealSelections.ts

import { useState, useCallback } from "react";
import { Item, MealSelections, MealTime } from "../types";

/**
 * Custom hook for managing meal selections state and operations
 *
 * @returns Object containing meal selection state and handlers
 */
export const useMealSelections = () => {
  const [mealSelections, setMealSelections] = useState<MealSelections>({});
  const [initialState, setInitialState] = useState<MealSelections>({});
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  /**
   * Toggles an item's selection state
   * When selecting an item, initializes it with default meal times from mdn
   * When deselecting, removes it from selections
   */
  const toggleItem = useCallback((item: Item) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      const isSelected = newSet.has(item.id);

      if (isSelected) {
        // Remove item from selection
        newSet.delete(item.id);
        setMealSelections((prevMeals) => {
          const updated = { ...prevMeals };
          delete updated[item.id];
          return updated;
        });
      } else {
        // Add item to selection
        newSet.add(item.id);
        if (item.mdn) {
          const newSelection = {
            morning: item.mdn.morning,
            afternoon: item.mdn.afternoon,
            night: item.mdn.night,
          };

          setMealSelections((prev) => ({
            ...prev,
            [item.id]: newSelection,
          }));

          setInitialState((prev) => ({
            ...prev,
            [item.id]: newSelection,
          }));
        }
      }

      return newSet;
    });
  }, []);

  /**
   * Handles meal time changes for a specific item
   * Only works if the item allows editable meal times
   */
  const handleMealChange = useCallback(
    (
      id: number,
      mealTime: keyof Omit<MealTime, "editable">,
      value: boolean
    ) => {
      setMealSelections((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [mealTime]: value,
        },
      }));
    },
    []
  );

  /**
   * Clears all selections and resets state
   */
  const handleClear = useCallback(() => {
    setMealSelections({});
    setSelectedItems(new Set());
    setInitialState({});
  }, []);

  /**
   * Cancels changes and restores to initial state
   */
  const handleCancel = useCallback(() => {
    setMealSelections({ ...initialState });
    setSelectedItems(new Set(Object.keys(initialState).map(Number)));
  }, [initialState]);

  return {
    mealSelections,
    selectedItems,
    initialState,
    toggleItem,
    handleMealChange,
    handleClear,
    handleCancel,
  };
};

// hooks/useBudgetCalculations.ts

import { useMemo } from "react";
import { FOOD_CATEGORIES, BUDGET_THRESHOLDS } from "../constants";

/**
 * Custom hook for budget-related calculations
 *
 * @param selectedItems - Set of selected item IDs
 * @param budgetPerStudent - Budget allocated per student
 * @param totalStudents - Total number of students
 * @returns Object containing calculated budget values and status
 */
export const useBudgetCalculations = (
  selectedItems: Set<number>,
  budgetPerStudent: number,
  totalStudents: number
) => {
  const totalBudget = useMemo(
    () => budgetPerStudent * totalStudents,
    [budgetPerStudent, totalStudents]
  );

  const totalSelectionPrice = useMemo(() => {
    return Array.from(selectedItems).reduce((total, itemId) => {
      const item = FOOD_CATEGORIES.flatMap((cat) => cat.items).find(
        (item) => item.id === itemId
      );
      return total + (item?.price || 0);
    }, 0);
  }, [selectedItems]);

  const remainingBudget = useMemo(
    () => totalBudget - totalSelectionPrice,
    [totalBudget, totalSelectionPrice]
  );

  const budgetStatus = useMemo(() => {
    if (totalBudget === 0) return "no-budget";

    const isOverBudget = totalSelectionPrice > totalBudget;
    const budgetUtilization = totalSelectionPrice / totalBudget;

    if (isOverBudget) return "over-budget";
    if (budgetUtilization > BUDGET_THRESHOLDS.HIGH_UTILIZATION)
      return "high-utilization";
    if (remainingBudget < totalBudget * BUDGET_THRESHOLDS.LOW_REMAINING)
      return "low-remaining";

    return "normal";
  }, [totalBudget, totalSelectionPrice, remainingBudget]);

  const budgetUtilization = useMemo(() => {
    return totalBudget > 0 ? (totalSelectionPrice / totalBudget) * 100 : 0;
  }, [totalBudget, totalSelectionPrice]);

  return {
    totalBudget,
    totalSelectionPrice,
    remainingBudget,
    budgetStatus,
    budgetUtilization,
    isOverBudget: budgetStatus === "over-budget",
  };
};
