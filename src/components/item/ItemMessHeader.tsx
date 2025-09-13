"use client";

import { Calculator, Coffee, DollarSign, Moon, Sun, Users } from "lucide-react";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BUDGET_THRESHOLDS } from "@/constants";
import { BudgetStatus, MealTime, MessData, SelectedCategoryMap } from "@/types";
import { BudgetSummary } from "./BudgetSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ItemMessHeaderProps {
  messInfo: MessData;
  selectedItems: SelectedCategoryMap;
  auto: boolean;
  budgetPerStudent: number;
  totalStudents: number;
  setMealTimes: Dispatch<SetStateAction<MealTime>>;
  mealTimes: MealTime;
  setBudgetPerStudent: Dispatch<SetStateAction<number>>;
  setTotalStudents: Dispatch<SetStateAction<number>>;
  totalBudget: number;
  setTotalBudget: Dispatch<SetStateAction<number>>;
  mealType: "single" | "multi";
  setMealType: Dispatch<SetStateAction<"single" | "multi">>;
}

const ItemMessHeader: React.FC<ItemMessHeaderProps> = ({
  messInfo,
  selectedItems,
  auto,
  budgetPerStudent,
  totalStudents,
  mealTimes,
  setMealTimes,
  setBudgetPerStudent,
  setTotalStudents,
  totalBudget,
  setTotalBudget,
  mealType,
  setMealType,
}) => {
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    setTotalBudget((budgetPerStudent || 0) * (totalStudents || 0));
  }, [budgetPerStudent, totalStudents]);

  const remainingBudget = useMemo(
    () => totalBudget - totalPrice,
    [totalBudget, totalPrice]
  );

  const budgetStatus: BudgetStatus = useMemo(() => {
    if (totalBudget === 0) return "no-budget";

    const isOverBudget = totalPrice > totalBudget;
    const budgetUtilization = totalPrice / totalBudget;

    if (isOverBudget) return "over-budget";
    if (budgetUtilization > BUDGET_THRESHOLDS.HIGH_UTILIZATION)
      return "high-utilization";
    if (remainingBudget < totalBudget * BUDGET_THRESHOLDS.LOW_REMAINING)
      return "low-remaining";

    return "normal";
  }, [totalBudget, totalPrice, remainingBudget]);

  const getSelectedItemCount = useMemo(() => {
    let count = 0;
    let total = 0;
    Object.values(selectedItems).forEach((categories) => {
      Object.values(categories).forEach((item) => {
        if (auto) {
          count += 1;
          total = 0;
        } else {
          let subTotal = item.unit.price * item.quantity;
          total += subTotal;
          count += item.quantity > 0 ? 1 : 0;
        }
      });
    });
    setTotalPrice(total);
    return count;
  }, [selectedItems, auto]);

  return (
    <Card className="shadow-lg border border-gray-200 p-0 overflow-hidden">
      {/* Header Section */}
      <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardTitle className="text-2xl font-bold">{messInfo.name}</CardTitle>
        <p className="text-sm text-blue-100">{messInfo.address.city}</p>
      </CardHeader>

      <CardContent className="px-6 py-4">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Mess Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Mess Information
              </h3>
            </div>
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                <span className="font-medium">Address: </span>
                {messInfo.address.street}, {messInfo.address.area}
              </p>
              <p>
                <span className="font-medium">City: </span>
                {messInfo.address.city} - {messInfo.address.postalCode}
              </p>
              <p>
                <span className="font-medium">Contact: </span>
                {messInfo.phone}
              </p>
            </div>
          </div>

          {/* Budget Configuration */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Budget Configuration
              </h3>
            </div>

            {/* Meal Type Selection */}
            <div className="flex gap-2">
              <Button
                variant={mealType === "single" ? "default" : "outline"}
                className={`flex-1 ${
                  mealType === "single"
                    ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                    : ""
                }`}
                onClick={() => {
                  setMealType("single");
                  setMealTimes({
                    breakfast: true,
                    lunch: false,
                    dinner: false,
                  });
                }}
              >
                <Coffee className="w-4 h-4 mr-1" /> Single
              </Button>

              <Button
                variant={mealType === "multi" ? "default" : "outline"}
                className={`flex-1 ${
                  mealType === "multi"
                    ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                    : ""
                }`}
                onClick={() => {
                  setMealType("multi");
                  setMealTimes({
                    breakfast: true,
                    lunch: false,
                    dinner: false,
                  });
                }}
              >
                <Sun className="w-4 h-4 mr-1" /> Multi
              </Button>
            </div>

            {/* Meal Times */}
            <div className="flex gap-2">
              <Button
                variant={mealTimes.breakfast ? "default" : "outline"}
                className={`flex-1 ${
                  mealTimes.breakfast
                    ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                    : ""
                }`}
                onClick={() =>
                  mealType === "multi"
                    ? setMealTimes({
                        ...mealTimes,
                        breakfast: !mealTimes.breakfast,
                      })
                    : setMealTimes({
                        breakfast: true,
                        lunch: false,
                        dinner: false,
                      })
                }
              >
                <Coffee className="w-4 h-4 mr-1" /> সকাল
              </Button>
              <Button
                variant={mealTimes.lunch ? "default" : "outline"}
                className={`flex-1 ${
                  mealTimes.lunch
                    ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                    : ""
                }`}
                onClick={() =>
                  mealType === "multi"
                    ? setMealTimes({ ...mealTimes, lunch: !mealTimes.lunch })
                    : setMealTimes({
                        breakfast: false,
                        lunch: true,
                        dinner: false,
                      })
                }
              >
                <Sun className="w-4 h-4 mr-1" /> দুপুর
              </Button>
              <Button
                variant={mealTimes.dinner ? "default" : "outline"}
                className={`flex-1 ${
                  mealTimes.dinner
                    ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                    : ""
                }`}
                onClick={() =>
                  mealType === "multi"
                    ? setMealTimes({ ...mealTimes, dinner: !mealTimes.dinner })
                    : setMealTimes({
                        breakfast: false,
                        lunch: false,
                        dinner: true,
                      })
                }
              >
                <Moon className="w-4 h-4 mr-1" /> রাত
              </Button>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Per Student Budget (৳)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={budgetPerStudent || ""}
                  onChange={(e) => setBudgetPerStudent(Number(e.target.value))}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Total Students
                </label>
                <Input
                  type="number"
                  min="0"
                  value={totalStudents || ""}
                  onChange={(e) => setTotalStudents(Number(e.target.value))}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Total Budget */}
            <div>
              <p className="text-sm font-medium mb-1">Total Budget</p>
              <Badge
                variant="outline"
                className="text-base px-3 py-1 border-blue-500 text-blue-700"
              >
                ৳ {totalBudget.toLocaleString("en-BD")}
              </Badge>
            </div>
          </div>

          {/* Meal Settings & Summary */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Meal Settings & Summary
              </h3>
            </div>

            <p className="text-sm text-gray-600">Active Meal Times:</p>
            <div className="flex gap-2 flex-wrap">
              {mealTimes.breakfast && <Badge>সকাল</Badge>}
              {mealTimes.lunch && <Badge>দুপুর</Badge>}
              {mealTimes.dinner && <Badge>রাত</Badge>}
            </div>

            {/* Budget Summary */}
            <BudgetSummary
              selectedItemsCount={getSelectedItemCount}
              totalSelectionPrice={totalPrice}
              totalBudget={totalBudget}
              remainingBudget={remainingBudget}
              budgetStatus={budgetStatus}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemMessHeader;
