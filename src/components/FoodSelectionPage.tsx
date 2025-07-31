// pages/FoodSelectionPage.tsx

"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

// Components
import { MessInfoHeader } from "../components/MessInfoHeader";
import { CategorySection } from "../components/CategorySection";
import { ActionButtons } from "../components/ActionButtons";
import { LoadingSpinner } from "../components/LoadingSpinner";

// Hooks
import { useMealSelections } from "../hooks/useMealSelections";
import { useBudgetCalculations } from "../hooks/useMealSelections";

// Constants and Types
import { FOOD_CATEGORIES } from "../constants";
import { MessDaySettings } from "../types";

/**
 * FoodSelectionPage Component
 *
 * Main page component for food selection and meal planning.
 * Manages the overall state and coordinates between different sections.
 *
 * Features:
 * - User authentication and authorization
 * - Meal selection management
 * - Budget tracking and calculations
 * - Mess day settings configuration
 * - Form submission and error handling
 * - Responsive design with loading states
 *
 * @returns JSX element representing the complete food selection page
 */
export const FoodSelectionPage: React.FC = () => {
  // Authentication and routing
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Local state management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [budgetPerStudent, setBudgetPerStudent] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [messDay, setMessDay] = useState<MessDaySettings>({
    morning: true,
    afternoon: true,
    night: true,
  });

  // Custom hooks for meal selections and budget calculations
  const {
    mealSelections,
    selectedItems,
    initialState,
    toggleItem,
    handleMealChange,
    handleClear,
    handleCancel,
  } = useMealSelections();

  const { totalBudget, totalSelectionPrice, remainingBudget, budgetStatus } =
    useBudgetCalculations(selectedItems, budgetPerStudent, totalStudents);

  // Memoized derived state
  const hasSelections = useMemo(() => selectedItems.size > 0, [selectedItems]);
  const hasChanges = useMemo(
    () => JSON.stringify(mealSelections) !== JSON.stringify(initialState),
    [mealSelections, initialState]
  );

  // Authentication check effect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [authLoading, user, router]);

  // Form submission handler
  const handleSave = useCallback(async () => {
    if (!hasSelections) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare submission data
      const submissionData = {
        selections: mealSelections,
        summary: {
          totalItems: selectedItems.size,
          totalPrice: totalSelectionPrice,
          selectedItemIds: Array.from(selectedItems),
        },
        budgetInfo: {
          budgetPerStudent,
          totalStudents,
          totalBudget,
          remainingBudget,
          budgetStatus,
        },
        messSettings: {
          activeMealTimes: messDay,
        },
        metadata: {
          timestamp: new Date().toISOString(),
          userId: user?.id,
        },
      };

      // TODO: Replace with actual API call
      console.log("Saving meal selections:", submissionData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success handling - could show toast notification or redirect
      console.log("✅ Selections saved successfully");

      // Optional: Reset form or redirect to success page
      // router.push('/success');
    } catch (error) {
      console.error("❌ Save error:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to save selections. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    hasSelections,
    mealSelections,
    selectedItems,
    totalSelectionPrice,
    budgetPerStudent,
    totalStudents,
    totalBudget,
    remainingBudget,
    budgetStatus,
    messDay,
    user?.id,
  ]);

  // Clear error when user makes changes
  useEffect(() => {
    if (submitError && hasChanges) {
      setSubmitError(null);
    }
  }, [submitError, hasChanges]);

  // Loading state
  if (authLoading) {
    return <LoadingSpinner message="Loading your food selection..." />;
  }

  // Redirect if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        {/* <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Food Selection
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose your preferred meals for different times of the day. Set your
            budget and manage your meal plan efficiently.
          </p>
        </header> */}

        {/* Mess Information and Configuration Header */}
        <MessInfoHeader
          budgetPerStudent={budgetPerStudent}
          setBudgetPerStudent={setBudgetPerStudent}
          totalStudents={totalStudents}
          setTotalStudents={setTotalStudents}
          totalBudget={totalBudget}
          messDay={messDay}
          setMessDay={setMessDay}
          selectedItemsCount={selectedItems.size}
          totalSelectionPrice={totalSelectionPrice}
          remainingBudget={remainingBudget}
          budgetStatus={budgetStatus}
        />

        {/* Error Display */}
        {submitError && (
          <div
            className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center gap-2 mb-1">
              <svg
                className="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Error</span>
            </div>
            <p>{submitError}</p>
          </div>
        )}

        {/* Food Categories */}
        <main className="space-y-8 mb-8">
          {FOOD_CATEGORIES.map((category) => (
            <CategorySection
              key={category.title}
              category={category}
              selectedItems={selectedItems}
              mealSelections={mealSelections}
              onItemToggle={toggleItem}
              onMealChange={handleMealChange}
            />
          ))}
        </main>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note (optional)
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            rows={3}
            placeholder="Write any special instructions or notes here..."
          />
        </div>

        {/* Sticky Action Buttons */}
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <ActionButtons
            onSave={handleSave}
            onClear={handleClear}
            onCancel={handleCancel}
            hasSelections={hasSelections}
            hasChanges={hasChanges}
            isLoading={isSubmitting}
          />

          {/* Quick Stats Display */}
          {hasSelections && (
            <div className="mt-3 pt-3 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                <span className="font-medium">{selectedItems.size}</span> items
                selected •
                <span className="font-medium">
                  {" "}
                  ৳{totalSelectionPrice.toLocaleString("en-BD")}
                </span>{" "}
                total cost
                {totalBudget > 0 && (
                  <>
                    {" • "}
                    <span
                      className={`font-medium ${
                        budgetStatus === "over-budget"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      ৳{Math.abs(remainingBudget).toLocaleString("en-BD")}
                      {budgetStatus === "over-budget"
                        ? " over budget"
                        : " remaining"}
                    </span>
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodSelectionPage;
