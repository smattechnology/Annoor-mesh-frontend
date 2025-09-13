"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Coffee, Sun, Moon } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import api from "@/utils/api";

type MealKey = "breakfast" | "lunch" | "dinner";

const NotePage = () => {
  const [mealType, setMealType] = useState<"single" | "multi">("single");
  const [mealTimes, setMealTimes] = useState<
    Record<MealKey, { isActive: boolean; totalMeal?: number; menu?: string }>
  >({
    breakfast: { isActive: true },
    lunch: { isActive: false },
    dinner: { isActive: false },
  });
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [errors, setErrors] = useState<{
    totalMeal: Partial<Record<MealKey, string>>;
    menu: Partial<Record<MealKey, string>>;
    totalBudget?: string;
  }>({ totalMeal: {}, menu: {} });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleMealTypeChange = (type: "single" | "multi") => {
    if (type === mealType) return;
    setMealType(type);
    setMealTimes({
      breakfast: { isActive: true },
      lunch: { isActive: false },
      dinner: { isActive: false },
    });
  };

  const toggleMealTime = (key: MealKey) => {
    if (mealType === "multi") {
      setMealTimes((prev) => {
        const currentActiveCount = Object.values(prev).filter(
          (meal) => meal.isActive
        ).length;
        if (prev[key].isActive && currentActiveCount === 1) return prev;
        return {
          ...prev,
          [key]: { ...prev[key], isActive: !prev[key].isActive },
        };
      });
    } else {
      setMealTimes({
        breakfast: { ...mealTimes.breakfast, isActive: key === "breakfast" },
        lunch: { ...mealTimes.lunch, isActive: key === "lunch" },
        dinner: { ...mealTimes.dinner, isActive: key === "dinner" },
      });
    }
  };

  const handleMealInput = (key: MealKey, value: number | undefined) => {
    setMealTimes((prev) => ({
      ...prev,
      [key]: { ...prev[key], totalMeal: value },
    }));
    setErrors((prev) => ({
      ...prev,
      totalMeal: { ...prev.totalMeal, [key]: undefined },
    }));
  };

  const handleMenuInput = (key: MealKey, value: string) => {
    setMealTimes((prev) => ({ ...prev, [key]: { ...prev[key], menu: value } }));
    setErrors((prev) => ({
      ...prev,
      menu: { ...prev.menu, [key]: undefined },
    }));
  };

  const handleBudgetInput = (value: number | 0) => {
    setTotalBudget(value);
    setErrors((prev) => ({ ...prev, totalBudget: undefined }));
  };

  // Validation
  const validate = (): boolean => {
    const newErrors: typeof errors = { totalMeal: {}, menu: {} };
    let valid = true;

    Object.entries(mealTimes).forEach(([meal, data]) => {
      if (!data.isActive) return;

      if (!data.totalMeal || data.totalMeal <= 0) {
        newErrors.totalMeal[meal as MealKey] = "Required and must be > 0";
        valid = false;
      }

      if (!data.menu || data.menu.trim() === "") {
        newErrors.menu[meal as MealKey] = "Menu is required";
        valid = false;
      }
    });

    if (!totalBudget || totalBudget <= 0) {
      newErrors.totalBudget = "Required and must be > 0";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleReset = () => {
    setMealType("single");
    setMealTimes({
      breakfast: { isActive: true, totalMeal: undefined, menu: "" },
      lunch: { isActive: false, totalMeal: undefined, menu: "" },
      dinner: { isActive: false, totalMeal: undefined, menu: "" },
    });
    setTotalBudget(0);
    setErrors({ totalMeal: {}, menu: {} });
    setApiError(null);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setApiError(null);

    // Prepare payload
    const payload = {
      breakfast: mealTimes.breakfast.isActive
        ? {
            total_meal: mealTimes.breakfast.totalMeal,
            menu: mealTimes.breakfast.menu,
          }
        : null,
      lunch: mealTimes.lunch.isActive
        ? { total_meal: mealTimes.lunch.totalMeal, menu: mealTimes.lunch.menu }
        : null,
      dinner: mealTimes.dinner.isActive
        ? {
            total_meal: mealTimes.dinner.totalMeal,
            menu: mealTimes.dinner.menu,
          }
        : null,
      budget: totalBudget,
      meal_type: mealType,
    };

    try {
      const response = await api.post("/order/add/note_order", payload);
      // Assuming your API returns success status
      if (response.status === 200 || response.status === 201) {
        setShowModal(false); // close modal if open
        handleReset(); // reset form
      } else {
        setApiError("Failed to submit meal plan. Please try again.");
      }
    } catch (error: any) {
      // Optional: get message from server
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  const activeMeals = Object.fromEntries(
    Object.entries(mealTimes).filter(([_, data]) => data.isActive)
  );

  return (
    <div className="w-full lg:max-w-3xl mx-auto p-4 flex flex-col gap-6">
      {/* Meal Planner Card */}
      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Meal Planner</CardTitle>
          <CardDescription>
            Choose your meal type and active meals.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Meal Type Switch */}
          <div className="w-full flex gap-2">
            <Button
              variant={mealType === "single" ? "default" : "outline"}
              className={`flex-1 ${
                mealType === "single"
                  ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                  : ""
              }`}
              onClick={() => handleMealTypeChange("single")}
            >
              <Coffee className="w-4 h-4 mr-1" /> Single Meal
            </Button>
            <Button
              variant={mealType === "multi" ? "default" : "outline"}
              className={`flex-1 ${
                mealType === "multi"
                  ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                  : ""
              }`}
              onClick={() => handleMealTypeChange("multi")}
            >
              <Coffee className="w-4 h-4 mr-1" /> Multi Meal
            </Button>
          </div>

          {/* Meal Time Buttons */}
          <div className="w-full flex gap-2">
            {(["breakfast", "lunch", "dinner"] as const).map((meal) => (
              <Button
                key={meal}
                variant={mealTimes[meal].isActive ? "default" : "outline"}
                className={`flex-1 ${
                  mealTimes[meal].isActive
                    ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                    : ""
                }`}
                onClick={() => toggleMealTime(meal)}
              >
                {meal === "breakfast" && <Coffee className="w-4 h-4 mr-1" />}
                {meal === "lunch" && <Sun className="w-4 h-4 mr-1" />}
                {meal === "dinner" && <Moon className="w-4 h-4 mr-1" />}
                {meal.charAt(0).toUpperCase() + meal.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Individual Meal Inputs */}
      {(["breakfast", "lunch", "dinner"] as const).map(
        (meal) =>
          mealTimes[meal].isActive && (
            <Card key={meal} className="shadow-md border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold capitalize">
                  {meal}
                </CardTitle>
                <CardDescription>
                  Set total meals and menu for {meal}.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Input
                  type="number"
                  placeholder={`${meal} total meals`}
                  value={
                    mealTimes[meal].totalMeal && mealTimes[meal].totalMeal > 0
                      ? mealTimes[meal].totalMeal
                      : ""
                  }
                  onChange={(e) =>
                    handleMealInput(meal, Number(e.target.value))
                  }
                  disabled={loading}
                />
                {errors.totalMeal[meal] && (
                  <p className="text-red-600 text-sm">
                    {errors.totalMeal[meal]}
                  </p>
                )}
                <textarea
                  className="border rounded p-2 w-full min-h-[80px]"
                  placeholder={`Write your ${meal} menu here...`}
                  value={mealTimes[meal].menu ?? ""}
                  onChange={(e) => handleMenuInput(meal, e.target.value)}
                  disabled={loading}
                />
                {errors.menu[meal] && (
                  <p className="text-red-600 text-sm">{errors.menu[meal]}</p>
                )}
              </CardContent>
            </Card>
          )
      )}

      {/* Budget & Submit */}
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Budget & Submit
          </CardTitle>
          <CardDescription>
            Set your total budget and submit your meal plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Input
            type="number"
            placeholder="Total budget"
            value={totalBudget && totalBudget > 0 ? totalBudget : ""}
            onChange={(e) => handleBudgetInput(Number(e.target.value))}
            disabled={loading}
          />
          {errors.totalBudget && (
            <p className="text-red-600 text-sm">{errors.totalBudget}</p>
          )}
          {apiError && <p className="text-red-600 mt-2">{apiError}</p>}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            className="bg-gray-500 hover:bg-gray-600 text-white"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowModal(validate())}
          >
            Submit Plan
          </Button>
        </CardFooter>
      </Card>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Meal Plan Summary</DialogTitle>
            <DialogDescription>
              Review your meals and budget before final submission.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2 mt-4">
            <p>
              <strong>Meal Type:</strong> {mealType}
            </p>
            {Object.entries(activeMeals).map(([meal, data]) => (
              <div key={meal} className="border-b pb-2">
                <p className="capitalize">
                  <strong>{meal}:</strong>
                </p>
                <p>Total Meals: {data.totalMeal ?? "Not set"}</p>
                <p>Menu: {data.menu || "Not set"}</p>
              </div>
            ))}
            <p className="mt-2">
              <strong>Total Budget:</strong>{" "}
              {totalBudget > 0
                ? totalBudget.toLocaleString("en-BD")
                : "Not set"}
            </p>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowModal(false)}>Close</Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotePage;
