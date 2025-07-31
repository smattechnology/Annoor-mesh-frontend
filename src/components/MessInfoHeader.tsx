// components/MessInfoHeader.tsx

import React, { useCallback } from "react";
import { Users, Calculator, DollarSign } from "lucide-react";
import { BudgetSummary } from "./BudgetSummary";
import { MESS_INFO, MEAL_TIMES } from "../constants";
import { MessDaySettings } from "../types";

interface MessInfoHeaderProps {
  /** Budget allocated per student */
  budgetPerStudent: number;
  /** Handler for budget per student changes */
  setBudgetPerStudent: (value: number) => void;
  /** Total number of students */
  totalStudents: number;
  /** Handler for total students changes */
  setTotalStudents: (value: number) => void;
  /** Total calculated budget */
  totalBudget: number;
  /** Active meal times configuration */
  messDay: MessDaySettings;
  /** Handler for meal day settings changes */
  setMessDay: (
    settings: MessDaySettings | ((prev: MessDaySettings) => MessDaySettings)
  ) => void;
  /** Number of selected items */
  selectedItemsCount: number;
  /** Total price of selected items */
  totalSelectionPrice: number;
  /** Remaining budget amount */
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
 * MessInfoHeader Component
 *
 * Displays mess information, budget configuration, meal settings, and selection summary.
 * This is the main header component that contains all the configuration and summary data.
 *
 * Features:
 * - Mess information display
 * - Budget configuration inputs
 * - Meal time settings
 * - Selection and budget summary
 * - Responsive grid layout
 * - Form validation and formatting
 *
 * @param props - Component props
 * @returns JSX element representing the mess info header
 */
export const MessInfoHeader: React.FC<MessInfoHeaderProps> = React.memo(
  ({
    budgetPerStudent,
    setBudgetPerStudent,
    totalStudents,
    setTotalStudents,
    totalBudget,
    messDay,
    setMessDay,
    selectedItemsCount,
    totalSelectionPrice,
    remainingBudget,
    budgetStatus,
  }) => {
    // Input change handlers with validation
    const handleBudgetChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, parseInt(e.target.value) || 0);
        setBudgetPerStudent(value);
      },
      [setBudgetPerStudent]
    );

    const handleStudentsChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, parseInt(e.target.value) || 0);
        setTotalStudents(value);
      },
      [setTotalStudents]
    );

    const handleMessDayChange = useCallback(
      (mealType: keyof MessDaySettings, checked: boolean) => {
        setMessDay((prev: MessDaySettings) => ({
          ...prev,
          [mealType]: checked,
        }));
      },
      []
    );

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold">{MESS_INFO.name}</h2>
              <p className="text-blue-100 text-sm">
                Established:{" "}
                {new Date(MESS_INFO.established).toLocaleDateString("bn-BD")} •{" "}
                {MESS_INFO.type}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Capacity</p>
              <p className="text-xl font-semibold">
                {MESS_INFO.capacity} Students
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Mess Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Mess Information
                </h3>
              </div>

              {/* Basic Information */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="text-right max-w-48 text-gray-900">
                    {MESS_INFO.address.street}, {MESS_INFO.address.area}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">City:</span>
                  <span className="text-gray-900">
                    {MESS_INFO.address.city} - {MESS_INFO.address.postalCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact:</span>
                  <span className="text-gray-900">
                    {MESS_INFO.contact.phone}
                  </span>
                </div>
              </div>

              {/* Meal Timings */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm text-gray-900 mb-2">
                  Meal Timings
                </h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Breakfast:</span>
                    <span>{MESS_INFO.mealTiming.breakfast}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lunch:</span>
                    <span>{MESS_INFO.mealTiming.lunch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dinner:</span>
                    <span>{MESS_INFO.mealTiming.dinner}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Configuration */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Calculator className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Budget Configuration
                </h3>
              </div>

              {/* Budget Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="budget-per-student"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Per Student Budget (৳)
                  </label>
                  <input
                    id="budget-per-student"
                    type="number"
                    min="0"
                    value={budgetPerStudent || ""}
                    onChange={handleBudgetChange}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="total-students"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Total Students
                  </label>
                  <input
                    id="total-students"
                    type="number"
                    min="0"
                    value={totalStudents || ""}
                    onChange={handleStudentsChange}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Total Budget Display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Budget
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium text-gray-900">
                  ৳ {totalBudget.toLocaleString("en-BD")}
                </div>
              </div>
            </div>

            {/* Meal Settings & Summary */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Meal Settings & Summary
                </h3>
              </div>

              {/* Active Meal Times */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Active Meal Times
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(
                    Object.keys(MEAL_TIMES) as Array<keyof MessDaySettings>
                  ).map((mealType) => (
                    <label
                      key={mealType}
                      className={`
                      flex items-center justify-center gap-2 p-2 border rounded-lg cursor-pointer transition-all
                      ${
                        messDay[mealType]
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                      }
                    `}
                    >
                      <input
                        type="checkbox"
                        checked={messDay[mealType]}
                        onChange={(e) =>
                          handleMessDayChange(mealType, e.target.checked)
                        }
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">
                        {MEAL_TIMES[mealType]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Budget Summary */}
              <BudgetSummary
                selectedItemsCount={selectedItemsCount}
                totalSelectionPrice={totalSelectionPrice}
                totalBudget={totalBudget}
                remainingBudget={remainingBudget}
                budgetStatus={budgetStatus}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

MessInfoHeader.displayName = "MessInfoHeader";
