"use client";
import { BUDGET_THRESHOLDS, FOOD_CATEGORIES, MESS_INFO } from "@/constants";
import { Item, ItemMap } from "@/types";
import { useState, useEffect, useMemo } from "react";
import { CategoryMap } from "@/types";
import ProductSection from "@/components/item/ProductSection";
import { Calculator, DollarSign, Users } from "lucide-react";
import { BudgetSummary } from "@/components/item/BudgetSummary";
import { BudgetStatus } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [selectedData, setSelectedData] = useState<CategoryMap>({});
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [budgetPerStudent, setBudgetPerStudent] = useState<number>(0);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push("/");
      } else {
        router.push("/auth");
      }
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const initialData = FOOD_CATEGORIES.reduce((acc, category) => {
      const itemMap: Record<number, Item & { key: string }> =
        category.items.reduce((itemAcc, item) => {
          itemAcc[item.id] = {
            ...item,
            key: item.id.toString(), // assuming item.key exists
          };
          return itemAcc;
        }, {} as Record<number, Item & { key: string }>);

      acc[category.id] = {
        id: category.id,
        title: category.title,
        items: itemMap,
      };

      return acc;
    }, {} as CategoryMap);

    setSelectedData(initialData);
  }, []);

  useEffect(() => {
    setTotalBudget(
      (budgetPerStudent ? budgetPerStudent : 0) *
        (totalStudents ? totalStudents : 0)
    );
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

    Object.values(selectedData).forEach((category) => {
      Object.values(category.items).forEach((item) => {
        const bld = item.bld;
        const price = (item.pp ?? 0) > 0;
        if (price && (bld?.breakfast || bld?.lunch || bld?.dinner)) {
          count += 1;
        }
      });
    });

    return count;
  }, [selectedData]);

  const resetSelection = () => {
    const newData: CategoryMap = {};

    Object.entries(selectedData).forEach(([categoryId, category]) => {
      const updatedItems: ItemMap = {};

      Object.entries(category.items).forEach(([itemId, item]) => {
        updatedItems[Number(itemId)] = {
          ...item,
          pp: 0,
          bld: {
            breakfast: false,
            lunch: false,
            dinner: false,
          },
        };
      });

      newData[Number(categoryId)] = {
        ...category,
        items: updatedItems,
      };
    });

    setSelectedData(newData);
  };

  return (
    <div className="w-ful lg:max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold">{MESS_INFO.name}</h2>
              <p className="text-blue-100 text-sm">
                Established:
                {new Date(MESS_INFO.established).toLocaleDateString(
                  "bn-BD"
                )} • {MESS_INFO.type}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="budget-per-student"
                    className="block text-sm font-medium text-gray-700 mb-1 text-nowrap"
                  >
                    Per Student Budget (৳)
                  </label>
                  <input
                    id="budget-per-student"
                    type="number"
                    min="0"
                    value={budgetPerStudent || ""}
                    onChange={(e) => {
                      setBudgetPerStudent(Number(e.target.value));
                    }}
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
                    onChange={(e) => {
                      setTotalStudents(Number(e.target.value));
                    }}
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
        </div>
      </div>

      <div className="p-4">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={resetSelection}
        >
          Reset
        </button>
      </div>
      <ProductSection
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        setTotalPrice={setTotalPrice}
      />
    </div>
  );
}
