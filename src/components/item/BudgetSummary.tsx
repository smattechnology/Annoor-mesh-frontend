// components/BudgetSummary.tsx

import React from "react";

interface BudgetSummaryProps {
  /** Number of selected items */
  selectedItemsCount: number;
  /** Total cost of selected items */
  totalSelectionPrice: number;
  /** Total available budget */
  totalBudget: number;
  /** Remaining budget (can be negative if over budget) */
  remainingBudget: number;
  /** Current budget status */
  budgetStatus:
    | "no-budget"
    | "normal"
    | "low-remaining"
    | "high-utilization"
    | "over-budget";
}

/**
 * BudgetSummary Component
 *
 * Displays a summary of budget information including selected items count,
 * total cost, and remaining budget with appropriate color coding.
 *
 * Features:
 * - Color-coded budget status indicators
 * - Responsive grid layout
 * - Bengali number formatting
 * - Clear visual hierarchy
 *
 * @param props - Component props
 * @returns JSX element representing the budget summary
 */
export const BudgetSummary: React.FC<BudgetSummaryProps> = ({
  selectedItemsCount,
  totalSelectionPrice,
  totalBudget,
  remainingBudget,
  budgetStatus,
}) => {
  const isOverBudget = budgetStatus === "over-budget";
  const isHighUtilization = budgetStatus === "high-utilization";
  const isLowRemaining = budgetStatus === "low-remaining";

  const getCostCardColor = () => {
    if (isOverBudget) return "bg-red-50 text-red-600";
    if (isHighUtilization || isLowRemaining)
      return "bg-amber-50 text-amber-600";
    return "bg-green-50 text-green-600";
  };

  const getRemainingCardColor = () => {
    if (isOverBudget) return "bg-red-50 text-red-600";
    if (isLowRemaining) return "bg-amber-50 text-amber-600";
    return "bg-gray-50 text-gray-700";
  };

  return (
    <div className="space-y-3">
      {/* Items and Cost Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Selected Items Count */}
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">
            {selectedItemsCount}
          </div>
          <div className="text-xs text-blue-600 font-medium">
            Items Selected
          </div>
        </div>

        {/* Total Cost */}
        <div className={`p-3 rounded-lg text-center ${getCostCardColor()}`}>
          <div className="text-2xl font-bold">
            ৳{totalSelectionPrice.toLocaleString("en-BD")}
          </div>
          <div className="text-xs font-medium">Total Cost</div>
        </div>
      </div>

      {/* Budget Information (only show if budget is set) */}
      {totalBudget > 0 && (
        <div
          className={`p-3 rounded-lg text-center ${getRemainingCardColor()}`}
        >
          <div className="text-lg font-semibold">
            ৳{Math.abs(remainingBudget).toLocaleString("en-BD")}
          </div>
          <div className="text-xs font-medium">
            {isOverBudget ? "Over Budget" : "Remaining Budget"}
          </div>

          {/* Budget status indicator */}
          {isOverBudget && (
            <div className="mt-1 text-xs text-red-500 font-medium">
              ⚠️ Exceeds budget by ৳
              {Math.abs(remainingBudget).toLocaleString("en-BD")}
            </div>
          )}
          {isLowRemaining && !isOverBudget && (
            <div className="mt-1 text-xs text-amber-600 font-medium">
              ⚠️ Low budget remaining
            </div>
          )}
        </div>
      )}

      {/* No Budget Set Message */}
      {totalBudget === 0 && selectedItemsCount > 0 && (
        <div className="p-3 rounded-lg text-center bg-gray-100 border-2 border-dashed border-gray-300">
          <div className="text-sm text-gray-600">
            💡 Set a budget to track your spending
          </div>
        </div>
      )}
    </div>
  );
};

BudgetSummary.displayName = "BudgetSummary";
