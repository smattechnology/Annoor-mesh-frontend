"use client";
import { Coffee, Sun, Moon } from "lucide-react";
import React, { JSX, useMemo, useState } from "react";

type MealInfo = {
  isActive: boolean;
  budget: number;
  students: number;
  note: string;
};

type MealData = {
  breakfast: MealInfo;
  lunch: MealInfo;
  dinner: MealInfo;
};

const initialMealData: MealData = {
  breakfast: { isActive: false, budget: 0, students: 0, note: "" },
  lunch: { isActive: false, budget: 0, students: 0, note: "" },
  dinner: { isActive: false, budget: 0, students: 0, note: "" },
};

const meals: { key: keyof MealData; label: string; icon: JSX.Element }[] = [
  { key: "breakfast", label: "সকাল", icon: <Coffee /> },
  { key: "lunch", label: "দুপুর", icon: <Sun /> },
  { key: "dinner", label: "রাত", icon: <Moon /> },
];

const MealCard: React.FC<{
  mealKey: keyof MealData;
  meal: MealInfo;
  setMeal: (key: keyof MealData, value: MealInfo) => void;
  icon: JSX.Element;
  label: string;
}> = ({ mealKey, meal, setMeal, icon, label }) => {
  if (!meal.isActive) return null;

  return (
    <div className="w-full flex flex-col gap-4 rounded-xl shadow-md border border-gray-200 p-6 mb-6 bg-white transition-shadow hover:shadow-lg">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
        {icon} <span>{label}</span>
      </h2>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-600">
            Per Student Budget (৳)
          </label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={meal.budget}
            onChange={(e) =>
              setMeal(mealKey, { ...meal, budget: Number(e.target.value) })
            }
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-600">
            Total Students
          </label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={meal.students}
            onChange={(e) =>
              setMeal(mealKey, { ...meal, students: Number(e.target.value) })
            }
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600">
          Note
        </label>
        <textarea
          rows={4}
          className="w-full px-4 py-2 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          value={meal.note}
          onChange={(e) => setMeal(mealKey, { ...meal, note: e.target.value })}
        ></textarea>
      </div>
    </div>
  );
};

const NotePage = () => {
  const [mealData, setMealData] = useState<MealData>(initialMealData);

  const toggleMeal = (key: keyof MealData) => {
    setMealData((prev) => ({
      ...prev,
      [key]: { ...prev[key], isActive: !prev[key].isActive },
    }));
  };

  const setMeal = (key: keyof MealData, value: MealInfo) => {
    setMealData((prev) => ({ ...prev, [key]: value }));
  };

  // Total budget per meal
  const totalBudgets = useMemo(() => {
    const breakfast = mealData.breakfast.isActive
      ? mealData.breakfast.budget * mealData.breakfast.students
      : 0;
    const lunch = mealData.lunch.isActive
      ? mealData.lunch.budget * mealData.lunch.students
      : 0;
    const dinner = mealData.dinner.isActive
      ? mealData.dinner.budget * mealData.dinner.students
      : 0;
    const grandTotal = breakfast + lunch + dinner;

    return { breakfast, lunch, dinner, grandTotal };
  }, [mealData]);

  const handleSubmit = () => {
    const activeMeals = Object.entries(mealData)
      .filter(([_, data]) => data.isActive)
      .reduce(
        (acc, [key, data]) => ({ ...acc, [key]: data }),
        {} as Partial<MealData>
      );

    console.log("Submitting Meal Data:", activeMeals);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Meal Toggle Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {meals.map((meal) => {
            const active = mealData[meal.key].isActive;
            return (
              <button
                key={meal.key}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border shadow-sm transition-colors ${
                  active
                    ? "bg-blue-100 border-blue-300 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => toggleMeal(meal.key)}
              >
                {meal.icon}
                <span>{meal.label}</span>
              </button>
            );
          })}
        </div>

        {/* Meal Cards */}
        {meals.map((meal) => (
          <MealCard
            key={meal.key}
            mealKey={meal.key}
            meal={mealData[meal.key]}
            setMeal={setMeal}
            icon={meal.icon}
            label={meal.label}
          />
        ))}

        {/* Total Budget & Submit Card */}
        {Object.values(mealData).some((m) => m.isActive) && (
          <div className="w-full mb-6 p-6 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col gap-3 max-w-sm mx-auto">
            {/* Meal Totals */}
            {mealData.breakfast.isActive && (
              <div className="flex justify-between text-gray-700 font-medium">
                <span>সকাল:</span>
                <span>৳{totalBudgets.breakfast}</span>
              </div>
            )}
            {mealData.lunch.isActive && (
              <div className="flex justify-between text-gray-700 font-medium">
                <span>দুপুর:</span>
                <span>৳{totalBudgets.lunch}</span>
              </div>
            )}
            {mealData.dinner.isActive && (
              <div className="flex justify-between text-gray-700 font-medium">
                <span>রাত:</span>
                <span>৳{totalBudgets.dinner}</span>
              </div>
            )}

            {/* Grand Total */}
            <div className="flex justify-between text-lg font-semibold text-blue-600 border-t border-gray-200 pt-2">
              <span>Total:</span>
              <span>৳{totalBudgets.grandTotal}</span>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="mt-4 w-full px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-colors font-semibold"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotePage;
